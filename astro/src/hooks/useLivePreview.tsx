// import LivePreview from '@payloadcms/live-preview';
import { subscribe, unsubscribe } from '@payloadcms/live-preview'; // buddy build fails with this
// ^^ ERROR: Named export 'subscribe' not found. The requested module '@payloadcms/live-preview' is a CommonJS module, which may not support all module.exports as named exports.
import { useCallback, useEffect, useState } from 'react';

export const useLivePreview = <T extends any>(props: {
  depth?: number;
  initialData: T;
  serverURL: string;
}): {
  data: T;
  isLoading: boolean;
} => {
  const { depth = 0, initialData, serverURL } = props;
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const onChange = useCallback((mergedData) => {
    setData(mergedData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const subscription = subscribe({
      callback: onChange,
      depth,
      initialData,
      serverURL
    });

    return () => {
      unsubscribe(subscription);
    };
  }, [serverURL, onChange, depth, initialData]);

  return {
    data,
    isLoading
  };
};
