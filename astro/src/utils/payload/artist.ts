import { getLimitQuery, getStatusQuery } from '@/utils/helpers';
import { URL } from './config';

// use for more complex queries (see payload docs)
// import qs from 'qs';

import type { Artist } from '@/types';

export const getArtists = async () =>
  (await (await fetch(`${URL}/api/artists`)).json()).docs as Artist[];

export const getArtistById = async (id: string) =>
  (await (await fetch(`${URL}/api/artists/${id}`)).json()) as Artist;

export const getArtistBySlug = async (slug: string) => {
  return await (
    await fetch(`${URL}/api/artists?where[slug][equals]=${slug}`)
  ).json();
};

export const getRecordsBySimilarGenre = async (
  record: Record,
  limit: number = 3
) => {
  const { id, genres: genresArray } = record;

  const genres = genresArray?.map((genre) => genre.id).join(',');

  try {
    const similarRecords = (
      await (
        await fetch(
          `${URL}/api/records?where[genres][in]=${genres}&where[id][not_equals]=${id}&${getStatusQuery(
            'published'
          )}&${getLimitQuery(limit)}`
        )
      ).json()
    ).docs;

    return similarRecords as Record[];
  } catch (e) {
    console.log(e);

    return [];
  }
};
export const getArtistsBySimilarGenre = async (
  artist: Artist,
  limit: number = 3
) => {
  const { id, genres: genresArray } = artist;

  const genres = genresArray?.map((genre) => genre.id).join(',');

  try {
    const similarArtists = (
      await (
        await fetch(
          `${URL}/api/artists?where[genres][in]=${genres}&where[id][not_equals]=${id}&${getStatusQuery(
            'published'
          )}&${getLimitQuery(limit)}`
        )
      ).json()
    ).docs;

    return similarArtists as Artist[];
  } catch (e) {
    console.log(e);

    return [];
  }
};
