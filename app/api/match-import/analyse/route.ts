import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { isAuthenticatedRequest } from '../../../lib/authz';
import { resolvePlayerName, splitPlayerNames, type ImportedMatch } from '../../../lib/match-import';

export const runtime = 'nodejs';

const schema = {
  type: 'object',
  required: ['rvrGoals', 'opponentGoals', 'playersOfMatch', 'notes', 'goals', 'cards', 'starters', 'bench'],
  properties: {
    rvrGoals: { type: 'integer', minimum: 0 },
    opponentGoals: { type: 'integer', minimum: 0 },
    playersOfMatch: { type: 'array', items: { type: 'string' } },
    cards: { type: 'array', items: { type: 'object', required: ['playerName', 'card', 'minute'], properties: { playerName: { type: 'string' }, card: { type: 'string', enum: ['yellow', 'red'] }, minute: { type: 'integer', minimum: 0, nullable: true } } } },
    notes: { type: 'string', nullable: true },
    goals: { type: 'array', items: { type: 'object', required: ['minute', 'scorerName', 'assistName', 'team'], properties: { minute: { type: 'integer', minimum: 0, nullable: true }, scorerName: { type: 'string' }, assistName: { type: 'string', nullable: true }, team: { type: 'string', enum: ['rvr', 'opponent'] } } } },
    starters: { type: 'array', items: { type: 'object', required: ['playerName', 'squadNumber', 'isCaptain'], properties: { playerName: { type: 'string' }, squadNumber: { type: 'integer', nullable: true }, isCaptain: { type: 'boolean' } } } },
    bench: { type: 'array', items: { type: 'object', required: ['playerName', 'squadNumber', 'isCaptain'], properties: { playerName: { type: 'string' }, squadNumber: { type: 'integer', nullable: true }, isCaptain: { type: 'boolean' } } } },
  },
};

export async function POST(request: Request) {
  const cookie = (await cookies()).get('rvr_workspace_session')?.value;
  if (!isAuthenticatedRequest(cookie)) return NextResponse.json({ error: 'Sign in to import a match.' }, { status: 401 });
  if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: 'Match import is not configured yet. Add GEMINI_API_KEY to the deployment environment.' }, { status: 503 });

  const form = await request.formData();
  const images = form.getAll('screenshots').filter((entry): entry is File => entry instanceof File && entry.size > 0);
  if (images.length < 3 || images.length > 6 || images.some((image) => !image.type.startsWith('image/') || image.size > 6_000_000)) {
    return NextResponse.json({ error: 'Upload three to six PNG, JPEG, or WebP screenshots, each under 6 MB.' }, { status: 400 });
  }

  const content = await Promise.all(images.map(async (image) => ({
    inlineData: { mimeType: image.type, data: Buffer.from(await image.arrayBuffer()).toString('base64') },
  })));
  // Pin a stable model for repeatable weekly imports. Override only when you
  // intentionally want to test a newer Gemini model in the environment.
  const model = process.env.GEMINI_MATCH_IMPORT_MODEL || 'gemini-3.8-flash';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: 'Extract only visible facts from these youth football match screenshots. RVR means River Valley Rangers. Do not infer positions, substitutions, dates, or missing names. Use null when not visible. Retain displayed spelling. List every player of the match as a separate entry in playersOfMatch (there can be two or more; never join names into one string). The match timeline lists events by minute: a football icon is a goal (with the assist in brackets underneath); a solid yellow or red rectangle icon is a card, NOT a goal - put it in cards with the player name and minute, never in goals. Colour decides yellow versus red. Include every card shown. Return the whole starting squad and bench where present. A captain badge means isCaptain true. Every goal event must be tagged with which team scored it: "rvr" for a River Valley Rangers goal, "opponent" for a goal scored against RVR. Never guess a team; use the side of the screen, shirt colour, or team column shown in the screenshot to decide.' }] },
      contents: [{ role: 'user', parts: [{ text: 'These are screenshots for one completed match. Extract the score from RVR perspective, goal events (each tagged with the scoring team), every player of the match (separately), yellow and red cards, starters and bench.' }, ...content] }],
      generationConfig: { responseMimeType: 'application/json', responseSchema: schema },
    }),
  });
  if (!response.ok) {
    console.error('Match import model request failed:', response.status, await response.text());
    return NextResponse.json({ error: 'The screenshot reader could not process these images. Please try again.' }, { status: 502 });
  }
  const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  try {
    const match = JSON.parse(payload.candidates?.[0]?.content?.parts?.[0]?.text || '') as ImportedMatch;
    match.playersOfMatch = (match.playersOfMatch || []).flatMap((name) => splitPlayerNames(name));
    match.cards = match.cards || [];
    // The goals/POTM screen only shows a first name + surname initial; the
    // squad screen shows full names. Resolve the former against the latter
    // so the saved record uses full names throughout.
    const fullNames = [...match.starters, ...match.bench].map((player) => player.playerName);
    if (fullNames.length) {
      match.playersOfMatch = match.playersOfMatch.map((name) => resolvePlayerName(name, fullNames));
      match.cards = match.cards.map((card) => ({ ...card, playerName: resolvePlayerName(card.playerName, fullNames) }));
      match.goals = match.goals.map((goal) => ({
        ...goal,
        scorerName: resolvePlayerName(goal.scorerName, fullNames),
        assistName: goal.assistName ? resolvePlayerName(goal.assistName, fullNames) : goal.assistName,
      }));
    }
    return NextResponse.json({ match });
  } catch {
    return NextResponse.json({ error: 'The screenshot reader returned an invalid result. Please try again.' }, { status: 502 });
  }
}
