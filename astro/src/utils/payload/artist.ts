import { URL } from './config';

import type { Artist, Record } from '@/types';
import { getRecords } from './record';

export const getArtists = async () =>
  (await (await fetch(`${URL}/api/artists`)).json()).docs as Artist[];

export const getArtist = async (id: string) =>
  (await (await fetch(`${URL}/api/artists/${id}`)).json()) as Artist;

export const getArtistRecords = async (id: string) => {
  // TODO: better way to do this?
  // get all records
  const records: Record[] = await getRecords();

  return records.filter((record) => {
    return record.artist.some((artist) => artist.id === id);
  });
};
