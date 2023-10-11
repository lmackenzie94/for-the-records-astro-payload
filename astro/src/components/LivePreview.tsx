'use client';

import { useLivePreview } from '@/hooks/useLivePreview';
import type { Artist as ArtistType } from '@/types';

// Fetch the page in a server component, pass it to the client component, then thread it through the hook
// The hook will take over from there and keep the preview in sync with the changes you make
// The `data` property will contain the live data of the document
const ArtistClient: React.FC<{
  artist: {
    id: string;
    name: string;
    updatedAt: string;
    createdAt: string;
  };
}> = ({ artist }) => {
  const { data } = useLivePreview<ArtistType>({
    initialData: artist,
    // serverURL: import.meta.env.PAYLOAD_URL // doesn't work...
    serverURL: 'http://localhost:3001'
    // depth: 2
  });

  return <p>LIVE PREVIEW: {data.name}</p>;
};

export default ArtistClient;
