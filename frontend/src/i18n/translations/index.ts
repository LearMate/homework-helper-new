import { en } from './en';

export const resources = {
  en: { translation: en }
} as const;

export type Translation = typeof en;
export type TranslationKey = keyof Translation | `${keyof Translation}.${string}`;

export const subjects = ['math', 'physics', 'chemistry', 'biology', 'history', 'literature'] as const;
export type Subject = typeof subjects[number];
