import { URL } from './config';

// use for more complex queries (see payload docs)
// import qs from 'qs';

import type { Artist, Record } from '@/types';
import { getRecords } from './record';

export const getArtists = async () =>
  (await (await fetch(`${URL}/api/artists`)).json()).docs as Artist[];

export const getArtistById = async (id: string) =>
  (await (await fetch(`${URL}/api/artists/${id}`)).json()) as Artist;

export const getArtistBySlug = async (slug: string) => {
  return await (
    await fetch(`${URL}/api/artists?where[slug][equals]=${slug}`)
  ).json();
};
