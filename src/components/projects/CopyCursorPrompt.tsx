import { useState } from 'react';

interface Props {
  prompt: string;
  label: string;
  copiedLabel: string;
}

export default function CopyCursorPrompt({ prompt, label, copiedLabel }: Props) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const area = document.createElement('textarea');
      area.value = prompt;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button type="button" className="btn btn-primary" onClick={onCopy}>
      {copied ? copiedLabel : label}
    </button>
  );
}
