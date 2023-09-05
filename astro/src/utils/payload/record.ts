import { URL } from './config';

import type { Record } from '@/types';

export const getRecords = async () =>
  (await (await fetch(`${URL}/api/records`)).json()).docs as Record[];

export const getRecordById = async (id: string) =>
  (await (await fetch(`${URL}/api/records/${id}`)).json()) as Record;

export const getRecordBySlug = async (slug: string) => {
  return await (
    await fetch(`${URL}/api/records?where[slug][equals]=${slug}`)
  ).json();
};

export const getRecordsByArtist = async (id: string) => {
  return (
    await (await fetch(`${URL}/api/records?where[artist][equals]=${id}`)).json()
  ).docs as Record[];
};

export const getRecordsBySimilarGenre = async (record: Record) => {
  const { id, genres: genresArray } = record;

  const genres = genresArray?.map((genre) => genre.id).join(',');

  console.log('GENRESSSS, ', genres);

  try {
    const similarRecords = (
      await (
        await fetch(
          `${URL}/api/records?where[genres][in]=${genres}&where[id][not_equals]=${id}`
        )
      ).json()
    ).docs;

    return similarRecords as Record[];
  } catch (e) {
    console.log(e);

    return [];
  }
};
