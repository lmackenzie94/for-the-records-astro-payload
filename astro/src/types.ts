/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  collections: {
    posts: Post;
    users: User;
    media: Media;
    records: Record;
    artists: Artist;
    genres: Genre;
  };
  globals: {};
}
export interface Post {
  id: string;
  title?: string;
  hallo?: string;
  publishedDate?: string;
  content?: {
    [k: string]: unknown;
  }[];
  status?: 'draft' | 'published';
  updatedAt: string;
  createdAt: string;
}
export interface User {
  id: string;
  name?: string;
  role: 'admin' | 'user';
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string;
  resetPasswordExpiration?: string;
  salt?: string;
  hash?: string;
  loginAttempts?: number;
  lockUntil?: string;
  password?: string;
}
export interface Media {
  id: string;
  alt?: string;
  updatedAt: string;
  createdAt: string;
  url?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
}
export interface Record {
  id: string;
  title: string;
  slug?: string;
  artist: string[] | Artist[];
  label?: string;
  genres: string[] | Genre[];
  releaseDate?: string;
  image: string | Media;
  createdBy?: string | User;
  content?: {
    [k: string]: unknown;
  }[];
  status?: 'draft' | 'published';
  updatedAt: string;
  createdAt: string;
}
export interface Artist {
  id: string;
  name: string;
  slug?: string;
  genres?: string[] | Genre[];
  image: string | Media;
  content?: {
    [k: string]: unknown;
  }[];
  status?: 'draft' | 'published';
  updatedAt: string;
  createdAt: string;
}
export interface Genre {
  id: string;
  title: string;
  slug?: string;
  updatedAt: string;
  createdAt: string;
}
