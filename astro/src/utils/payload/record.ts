import type { Record } from '@/types';
import { getLimitQuery, getStatusQuery } from '@/utils/helpers';
import { URL, apiFetch } from './api';

// GET ALL RECORDS
// have to set a limit of 0, otherwise only 10 records will be fetched
export const getRecords = async (limit: number = 0) =>
  (
    await apiFetch(
      `${URL}/api/records?${getStatusQuery('published')}&${getLimitQuery(limit)}`
    )
  ).docs as Record[];

// GET RECORD BY ID
export const getRecordById = async (id: string) =>
  (await apiFetch(`${URL}/api/records/${id}`)) as Record;

// GET RECORD BY SLUG
export const getRecordBySlug = async (slug: string) => {
  return (await apiFetch(
    `${URL}/api/records?where[slug][equals]=${slug}&${getStatusQuery(
      'published'
    )}`
  )) as Record;
};

// GET RECORDS BY ARTIST
export const getRecordsByArtist = async (id: string, limit: number = 3) => {
  return (
    await apiFetch(
      `${URL}/api/records?where[artist][equals]=${id}&${getLimitQuery(
        limit
      )}&${getStatusQuery('published')}`
    )
  ).docs as Record[];
};

// GET SIMILAR RECORDS BY GENRE
export const getSimilarRecordsByGenre = async (
  record: Record,
  limit: number = 3
) => {
  const { id, genres: genresArray } = record;

  const genres = genresArray?.map((genre) => genre.id).join(',');

  try {
    const similarRecords = (
      await apiFetch(
        `${URL}/api/records?where[genres][in]=${genres}&where[id][not_equals]=${id}&${getLimitQuery(
          limit
        )}&${getStatusQuery('published')}`
      )
    ).docs;

    return similarRecords as Record[];
  } catch (e) {
    console.log(e);

    return [];
  }
};

// GET RANDOM RECORDS
export const getRandomRecords = async (limit: number = 8) => {
  const allRecords = await getRecords();

  const randomRecords = allRecords
    .sort(() => 0.5 - Math.random())
    .slice(0, limit);

  return randomRecords as Record[];
};
