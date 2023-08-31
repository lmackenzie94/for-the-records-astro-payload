import { URL } from "./config";

import type { Artist } from "@/types";

export const getArtists = async () =>
  (await (await fetch(`${URL}/api/artists`)).json()).docs as Artist[];

export const getArtist = async (id: string) =>
  (await (await fetch(`${URL}/api/artists/${id}`)).json()) as Artist;
