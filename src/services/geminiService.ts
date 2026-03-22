import { minifigCatalog } from '../data/minifigCatalog';
import { Minifigure } from '../types';

const normalize = (value: string) => value.trim().toLowerCase();

const getSearchableFields = (minifigure: Minifigure) => [
  minifigure.name,
  minifigure.id,
  minifigure.theme,
  minifigure.series,
  minifigure.description,
  minifigure.setNumber ?? '',
  ...minifigure.tags,
].map(normalize);

const getMatchScore = (minifigure: Minifigure, query: string) => {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) return 0;

  return getSearchableFields(minifigure).reduce((score, field) => {
    if (field === normalizedQuery) return score + 120;
    if (field.startsWith(normalizedQuery)) return score + 80;
    if (field.includes(normalizedQuery)) return score + 40;

    const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);
    const matchingTerms = queryTerms.filter((term) => field.includes(term)).length;

    return matchingTerms > 0 ? score + matchingTerms * 15 : score;
  }, 0);
};

export const searchMinifigures = async (query: string): Promise<Minifigure[]> => {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) return [];

  const results = minifigCatalog
    .map((minifigure) => ({ minifigure, score: getMatchScore(minifigure, normalizedQuery) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return left.minifigure.name.localeCompare(right.minifigure.name);
    })
    .map(({ minifigure }) => minifigure);

  return Promise.resolve(results);
};
