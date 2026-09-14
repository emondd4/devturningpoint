import { useEffect, useState } from 'react';
import { getTopicProgress, markTopicComplete, touchTopic } from '../../stores/progress';
import type { Locale } from '../../i18n/config';

interface Props {
  topicId: string;
  locale: Locale;
}

export default function MarkCompleteButton({ topicId, locale }: Props) {
  const [completed, setCompleted] = useState(false);
  const isBn = locale === 'bn';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await touchTopic(topicId);
        const progress = await getTopicProgress(topicId);
        if (!cancelled) setCompleted(Boolean(progress?.completed));
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [topicId]);

  const onComplete = async () => {
    await markTopicComplete(topicId);
    setCompleted(true);
  };

  return (
    <button type="button" className="btn btn-primary" onClick={onComplete} disabled={completed}>
      {completed ? (isBn ? 'সম্পন্ন' : 'Completed') : isBn ? 'সম্পন্ন হয়েছে চিহ্নিত করুন' : 'Mark complete'}
    </button>
  );
}
