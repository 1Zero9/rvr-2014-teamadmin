'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

export function InstallAppButton() {
  const [prompt, setPrompt] = useState<InstallEvent | null>(null);
  const [showIosHelp, setShowIosHelp] = useState(false);
  useEffect(() => {
    const onPrompt = (event: Event) => { event.preventDefault(); setPrompt(event as InstallEvent); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);
  async function install() {
    if (prompt) { await prompt.prompt(); await prompt.userChoice; setPrompt(null); return; }
    setShowIosHelp(true);
  }
  return <div className="install-app-wrap"><button type="button" className="install-app-button" onClick={install}><Download size={15} /> Add to phone</button>{showIosHelp && <span className="install-app-help">In Safari: Share → Add to Home Screen.</span>}</div>;
}
