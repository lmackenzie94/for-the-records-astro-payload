'use client';

import { useLivePreview } from '@/hooks/useLivePreview';
import { Serialize } from '@/utils/lexical/ReactSerializer';

const ContentReact = ({ content, className = '' }) => {
  // const contentArray = getContentArray(content);

  const serverURL = import.meta.env.DEV
    ? 'http://localhost:3001'
    : 'https://for-the-records.com';

  const { data } = useLivePreview({
    initialData: content,
    // serverURL: import.meta.env.PAYLOAD_URL // doesn't work...
    serverURL
    // depth: 2
  });

  return (
    <div className={`${className}`}>
      <Serialize nodes={data?.content?.root?.children} />
    </div>
  );
};

export default ContentReact;
