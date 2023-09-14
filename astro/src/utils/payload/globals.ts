import { URL } from './config';

import type { SiteSetting } from '@/types';

export const getSiteSettings = async () => {
  return (await (
    await fetch(`${URL}/api/globals/site-settings`)
  ).json()) as SiteSetting;
};
