import { URL } from './config';

import type { Record } from '@/types';

const fetchWithCredentials = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    ...options,
    credentials: 'include'
    // headers: {
    //   // TODO: only works if you add this header...
    //   Authorization: `JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hY2tlbnppZWx1a2U5NEBnbWFpbC5jb20iLCJpZCI6IjY0ZjBmNmY0NGRlN2Y1ZDg4ZWYxNjc1YSIsImNvbGxlY3Rpb24iOiJ1c2VycyIsImlhdCI6MTY5Mzk1MTM1NCwiZXhwIjoxNjkzOTU4NTU0fQ.-n0ypBaTxP4Ojvm99Km-hsNf4oCm1r-D-RoSO3V5faw`
    // }
  });

  return res;
};

export const getRecords = async () =>
  (await (await fetchWithCredentials(`${URL}/api/records`)).json())
    .docs as Record[];

export const getRecordById = async (id: string) =>
  (await (await fetch(`${URL}/api/records/${id}`)).json()) as Record;

export const getRecordBySlug = async (slug: string) => {
  return await (
    await fetch(`${URL}/api/records?where[slug][equals]=${slug}`)
  ).json();
};

export const getRecordsByArtist = async (id: string, limit: number = 3) => {
  return (
    await (
      await fetch(
        `${URL}/api/records?where[artist][equals]=${id}&limit=${limit}`
      )
    ).json()
  ).docs as Record[];
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
          `${URL}/api/records?where[genres][in]=${genres}&where[id][not_equals]=${id}&limit=${limit}`
        )
      ).json()
    ).docs;

    return similarRecords as Record[];
  } catch (e) {
    console.log(e);

    return [];
  }
};
