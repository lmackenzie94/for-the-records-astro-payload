import { getLimitQuery, getStatusQuery } from '@/utils/helpers';
import { URL } from './config';

// use for more complex queries (see payload docs)
// import qs from 'qs';

import type { Artist } from '@/types';

const customFetch = async (url: string) => {
  const res = await fetch(url);
  return await res.json();
};

export const getArtists = async () =>
  (await customFetch(`${URL}/api/artists`)).docs as Artist[];

export const getArtistById = async (id: string) =>
  (await customFetch(`${URL}/api/artists/${id}`)) as Artist;

export const getArtistBySlug = async (slug: string) => {
  return await customFetch(`${URL}/api/artists?where[slug][equals]=${slug}`);
};

export const getArtistsBySimilarGenre = async (
  artist: Artist,
  limit: number = 3
) => {
  const { id, genres: genresArray } = artist;

  const genres = genresArray?.map((genre) => genre.id).join(',');

  try {
    const similarArtists = (
      await customFetch(
        `${URL}/api/artists?where[genres][in]=${genres}&where[id][not_equals]=${id}&${getStatusQuery(
          'published'
        )}&${getLimitQuery(limit)}`
      )
    ).docs;

    return similarArtists as Artist[];
  } catch (e) {
    console.log(e);

    return [];
  }
};
