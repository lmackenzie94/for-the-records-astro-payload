import { URL } from './config';

import type { Post } from '@/types';

export const getPosts = async () =>
  (await (await fetch(`${URL}/api/posts`)).json()).docs as Post[];

export const getPost = async (id: string) =>
  (await (await fetch(`${URL}/api/posts/${id}`)).json()) as Post;
