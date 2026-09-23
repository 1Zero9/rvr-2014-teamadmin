'use client';

import { useState } from 'react';
import { ImageUp, LoaderCircle, Save, Sparkles } from 'lucide-react';
import { saveImportedMatchAction } from '../actions';
import type { ImportedMatch } from '../lib/match-import';

type MatchOption = { id: string; label: string };

export function MatchScreenshotImporter({ matches }: { matches: MatchOption[] }) {
  const [files, setFiles] = useState<File[]>([]);
  const [match, setMatch] = useState<ImportedMatch | null>(null);
  const [error, setError] = useState('');
  const [working, setWorking] = useState(false);

  async function analyse() {
    setError(''); setMatch(null);
    if (files.length < 3 || files.length > 4) { setError('Choose the three match-detail screenshots, plus the optional Results screen.'); return; }
    setWorking(true);
    try {
      const form = new FormData(); files.forEach((file) => form.append('screenshots', file));
      const response = await fetch('/api/match-import/analyse', { method: 'POST', body: form });
      const body = await response.json() as { match?: ImportedMatch; error?: string };
      if (!response.ok || !body.match) throw new Error(body.error || 'Could not analyse the screenshots.');
      setMatch(body.match);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not analyse the screenshots.'); }
    finally { setWorking(false); }
  }

  return <article className="panel match-importer">
    <div className="section-heading"><div><span>WEEKLY MATCH IMPORT</span><h3>Read match screenshots</h3></div><Sparkles size={20} /></div>
    <p className="match-stats-help">Choose the match detail, starting squad and bench screenshots; add the Results screen when you have it. Images are analysed for this import and are not retained by this site.</p>
    <label className="screenshot-picker"><ImageUp size={20} /><span><strong>{files.length ? `${files.length} screenshot${files.length === 1 ? '' : 's'} selected` : 'Choose 3–4 screenshots'}</strong><small>PNG, JPEG or WebP · 6 MB maximum each</small></span><input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={(event) => setFiles(Array.from(event.target.files || []).slice(0, 4))} /></label>
    {files.length > 0 && <ul className="screenshot-file-list">{files.map((file) => <li key={`${file.name}-${file.lastModified}`}>{file.name}</li>)}</ul>}
    <button type="button" className="primary" disabled={working} onClick={analyse}>{working ? <LoaderCircle className="spin" size={16} /> : <Sparkles size={16} />}{working ? 'Reading screenshots…' : 'Read screenshots'}</button>
    {error && <p className="match-import-error">{error}</p>}
    {match && <form action={saveImportedMatchAction} className="import-review">
      <input type="hidden" name="importedMatch" value={JSON.stringify(match)} />
      <label>Save against fixture<select name="matchId" required defaultValue=""><option value="" disabled>Choose the matching fixture</option>{matches.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <div className="import-score"><strong>Extracted score</strong><span>RVR {match.rvrGoals} – {match.opponentGoals} opponent</span></div>
      <div className="import-summary"><strong>{match.goals.length} goals</strong><span>{match.goals.map((goal) => `${goal.minute ? `${goal.minute}′ ` : ''}${goal.scorerName}${goal.assistName ? ` (${goal.assistName})` : ''}`).join(' · ') || 'No goal events visible'}</span></div>
      <div className="import-summary"><strong>Squad</strong><span>{match.starters.length} starting · {match.bench.length} bench{match.playerOfMatch ? ` · POTM: ${match.playerOfMatch}` : ''}</span></div>
      <p className="match-stats-help">Review the result above against the screenshots before saving. Saving again replaces the imported private record for this fixture.</p>
      <button className="primary" type="submit"><Save size={16} /> Confirm and save match</button>
    </form>}
  </article>;
}
