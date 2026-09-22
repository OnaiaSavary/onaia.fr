import type { CollectionEntry, Reference } from 'astro:content';
import { defineCollection } from 'astro:content';
import { z } from 'zod';

const publicationSchema = z.object({
  title: z.string(),
  authors: z.array(z.string()),
  year: z.number().int(),
  journal: z.string().optional(),
  doi: z.string().optional(),
  url: z.string().optional(),
  pdf: z.string().optional(),
  abstract: z.string().optional(),
  topics: z.array(z.string()).optional(),
  projects: z.array(z.string()).optional(),
  featured: z.boolean().optional()
});

const conferenceSchema = z.object({
  title: z.string(),
  conference: z.string().optional(),
  year: z.number().int(),
  location: z.string().optional(),
  contributionType: z.string().optional(),
  abstract: z.string().optional(),
  slides: z.string().optional(),
  publication: z.string().optional(),
  project: z.string().optional()
});

const posterSchema = z.object({
  title: z.string(),
  conference: z.string().optional(),
  year: z.number().int(),
  location: z.string().optional(),
  pdf: z.string().optional(),
  preview: z.string().optional(),
  project: z.string().optional(),
  publication: z.string().optional()
});

const researchProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string().optional(),
  startYear: z.number().int().optional(),
  endYear: z.number().int().optional(),
  topics: z.array(z.string()).optional(),
  publications: z.array(z.string()).optional()
});

const vulgarisationSchema = z.object({
  title: z.string(),
  date: z.string().optional(),
  summary: z.string().optional(),
  tags: z.array(z.string()).optional(),
  cover: z.string().optional()
});

export const collections = {
  publications: defineCollection({ schema: publicationSchema }),
  conferences: defineCollection({ schema: conferenceSchema }),
  posters: defineCollection({ schema: posterSchema }),
  researchProjects: defineCollection({ schema: researchProjectSchema }),
  vulgarisation: defineCollection({ schema: vulgarisationSchema })
};
