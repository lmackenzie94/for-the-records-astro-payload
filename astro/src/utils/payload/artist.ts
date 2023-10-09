import type { Artist } from '@/types';
import { getLimitQuery, getStatusQuery } from '@/utils/helpers';
import { URL, apiFetch } from './api';

// use for more complex queries (see payload docs)
// import qs from 'qs';

// GET ALL ARTISTS
export const getArtists = async () =>
  (await apiFetch(`${URL}/api/artists`)).docs as Artist[];

// GET ARTIST BY ID
export const getArtistById = async (id: string) =>
  (await apiFetch(`${URL}/api/artists/${id}`)) as Artist;

// GET ARTIST BY SLUG
export const getArtistBySlug = async (slug: string) => {
  return (await apiFetch(
    `${URL}/api/artists?where[slug][equals]=${slug}`
  )) as Artist;
};

// GET SIMILAR ARTISTS BY GENRE
export const getSimilarArtistsByGenre = async (
  artist: Artist,
  limit: number = 3
) => {
  const { id, genres: genresArray } = artist;

  const genres = genresArray?.map((genre) => genre.id).join(',');

  try {
    const similarArtists = (
      await apiFetch(
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
