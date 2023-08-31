import { URL } from "./config";

import type { Record } from "@/types";

export const getRecords = async () =>
  (await (await fetch(`${URL}/api/records`)).json()).docs as Record[];

export const getRecord = async (id: string) =>
  (await (await fetch(`${URL}/api/records/${id}`)).json()) as Record;
