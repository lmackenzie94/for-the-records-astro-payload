import { URL } from './api';

import type { SiteSetting } from '@/types';

export const getSiteSettings = async () => {
  return (await (
    await fetch(`${URL}/api/globals/site-settings`)
  ).json()) as SiteSetting;
};
