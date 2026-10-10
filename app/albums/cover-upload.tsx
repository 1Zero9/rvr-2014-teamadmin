'use client';

import { useState } from 'react';

// Resizes the chosen photo in the browser so the stored cover stays small.
export function CoverUpload() {
  const [data, setData] = useState('');
  const [busy, setBusy] = useState(false);

  async function onPick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 900 / bitmap.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      setData(canvas.toDataURL('image/jpeg', 0.8));
    } catch { setData(''); } finally { setBusy(false); }
  }

  return <label>Or upload a cover photo
    <input type="file" accept="image/*" onChange={(e) => onPick(e.target.files?.[0])} />
    <input type="hidden" name="coverData" value={data} />
    {busy && <small>Preparing photo…</small>}
    {data && !busy && <img src={data} alt="Selected cover preview" style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 8, marginTop: 6 }} />}
  </label>;
}
