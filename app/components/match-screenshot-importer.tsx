'use client';

import { useRef, useState, useTransition } from 'react';
import { CheckCircle2, ImageUp, LoaderCircle, Save, Sparkles, X } from 'lucide-react';
import { saveImportedMatchAction } from '../actions';
import { COMPETITION_TYPES, guessCompetitionType, type CompetitionType, type ImportedMatch } from '../lib/match-import';

type MatchOption = { id: string; label: string; competition: string; recorded: boolean };

const MAX_FILES = 6;

/** Phone screenshots are several MB each; Vercel rejects request bodies over
 * ~4.5 MB, which made the upload hang. Shrink to a readable size first. */
async function shrink(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82));
    return blob ? new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }) : file;
  } catch { return file; }
}

export function MatchScreenshotImporter({ matches }: { matches: MatchOption[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [match, setMatch] = useState<ImportedMatch | null>(null);
  const [error, setError] = useState('');
  const [working, setWorking] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, startSaving] = useTransition();
  const [matchId, setMatchId] = useState('');
  const [competitionType, setCompetitionType] = useState<CompetitionType>('league');

  async function analyse() {
    setError(''); setMatch(null);
    if (files.length < 3) { setError('Choose at least the three match-detail screenshots (plus the Results screen if you have it).'); return; }
    setWorking(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 90_000);
    try {
      const form = new FormData();
      for (const file of await Promise.all(files.map(shrink))) form.append('screenshots', file);
      const response = await fetch('/api/match-import/analyse', { method: 'POST', body: form, signal: controller.signal });
      const body = await response.json().catch(() => ({})) as { match?: ImportedMatch; error?: string };
      if (!response.ok || !body.match) throw new Error(body.error || 'Could not analyse the screenshots.');
      setMatch(body.match);
      // Most recent unrecorded completed fixture is almost always the right one.
      const suggested = matches.find((item) => !item.recorded);
      if (suggested) chooseMatch(suggested.id);
    } catch (cause) {
      setError(cause instanceof DOMException && cause.name === 'AbortError' ? 'That took too long. Check your signal and try again.' : cause instanceof Error ? cause.message : 'Could not analyse the screenshots.');
    } finally { clearTimeout(timer); setWorking(false); }
  }

  function chooseMatch(id: string) {
    setMatchId(id);
    const item = matches.find((entry) => entry.id === id);
    if (item) setCompetitionType(guessCompetitionType(item.competition));
  }

  function save() {
    if (!match || !matchId) { setError('Choose the matching fixture first.'); return; }
    setError('');
    const form = new FormData();
    form.set('importedMatch', JSON.stringify(match)); form.set('matchId', matchId); form.set('competitionType', competitionType);
    startSaving(async () => {
      try { await saveImportedMatchAction(form); setSaved(true); }
      catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save the match.'); }
    });
  }

  function reset() {
    setFiles([]); setMatch(null); setError(''); setWorking(false); setSaved(false); setMatchId(''); setCompetitionType('league');
  }

  return <>
    <button type="button" className="import-trigger-btn" onClick={() => dialogRef.current?.showModal()}>
      <Sparkles size={16} /> Import match screenshots
    </button>
    <dialog ref={dialogRef} className="import-dialog" onClose={reset}>
      <article className="match-importer">
        <div className="section-heading">
          <div><span>IMPORT</span><h3>Match screenshots</h3></div>
          <button type="button" className="icon-button" aria-label="Close" onClick={() => dialogRef.current?.close()}><X size={18} /></button>
        </div>
        {saved ? <>
          <p className="import-success"><CheckCircle2 size={20} /> Match saved.</p>
          <button type="button" className="primary" onClick={() => dialogRef.current?.close()}>Done</button>
        </> : <>
          <label className="screenshot-picker"><ImageUp size={20} /><span><strong>{files.length ? `${files.length}/${MAX_FILES} screenshots selected` : 'Choose 3–6 screenshots'}</strong><small>{files.length ? `Pick again to add more, up to ${MAX_FILES} total` : 'Match screens and Results · large images are shrunk automatically'}</small></span><input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            value=""
            onChange={(event) => {
              const picked = Array.from(event.target.files || []);
              setFiles((current) => {
                const merged = [...current, ...picked].filter((file, index, all) =>
                  all.findIndex((other) => other.name === file.name && other.lastModified === file.lastModified) === index);
                return merged.slice(0, MAX_FILES);
              });
            }}
          /></label>
          {files.length > 0 && <ul className="screenshot-file-list">{files.map((file) => (
            <li key={`${file.name}-${file.lastModified}`}>
              <span>{file.name}</span>
              <button type="button" className="icon-button" aria-label={`Remove ${file.name}`} onClick={() => setFiles((current) => current.filter((entry) => entry !== file))}><X size={13} /></button>
            </li>
          ))}</ul>}
          <button type="button" className="primary" disabled={working || saving} onClick={analyse}>{working ? <LoaderCircle className="spin" size={16} /> : <Sparkles size={16} />}{working ? 'Reading screenshots…' : match ? 'Read again' : 'Read screenshots'}</button>
          {error && <p className="match-import-error">{error}</p>}
          {match && <div className="import-review">
            <label>Save against fixture<select value={matchId} onChange={(event) => chooseMatch(event.target.value)}><option value="" disabled>Choose the matching fixture</option>{matches.map((item) => <option key={item.id} value={item.id}>{item.label}{item.recorded ? ' ✓ recorded' : ''}</option>)}</select></label>
            <div className="import-type" role="radiogroup" aria-label="Competition type">{COMPETITION_TYPES.map((type) => (
              <button key={type.value} type="button" role="radio" aria-checked={competitionType === type.value} className={competitionType === type.value ? 'active' : ''} onClick={() => setCompetitionType(type.value)}>{type.label}</button>
            ))}</div>
            <div className="import-score"><strong>Extracted score</strong><span>RVR {match.rvrGoals} – {match.opponentGoals} opponent</span></div>
            <div className="import-summary"><strong>{match.goals.length} goals</strong><span>{match.goals.map((goal) => goal.team === 'opponent' ? `Opponent goal${goal.minute ? ` · ${goal.minute}′` : ''}` : `${goal.minute ? `${goal.minute}′ ` : ''}${goal.scorerName}${goal.assistName ? ` (${goal.assistName})` : ''}`).join(' · ') || 'No goal events visible'}</span></div>
            <div className="import-summary"><strong>Player of the match ({match.playersOfMatch.length})</strong><span>{match.playersOfMatch.join(' · ') || 'None found'}</span></div>
            <div className="import-summary"><strong>Cards ({match.cards.length})</strong><span>{match.cards.map((card) => `${card.card === 'red' ? '🟥' : '🟨'} ${card.playerName}${card.minute ? ` ${card.minute}′` : ''}`).join(' · ') || 'None found'}</span></div>
            <div className="import-summary"><strong>Squad</strong><span>{match.starters.length} starting · {match.bench.length} bench</span></div>
            <button className="primary" type="button" disabled={saving || !matchId} onClick={save}>{saving ? <LoaderCircle className="spin" size={16} /> : <Save size={16} />}{saving ? 'Saving…' : 'Save match'}</button>
          </div>}
        </>}
      </article>
    </dialog>
  </>;
}
