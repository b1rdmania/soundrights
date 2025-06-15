// Production music utility functions

import { SearchResultProps } from '@/components/SearchResult';

// Search result utilities
export const getSearchResults = (): SearchResultProps[] => {
  // This function would normally query the database for real tracks
  // For now, returning empty array until backend integration is complete
  return [];
};

// Filter options for production use
export const filterOptions = {
  bpmRanges: [
    { label: 'All BPM', value: 'all' },
    { label: 'Slow (< 90 BPM)', value: 'slow' },
    { label: 'Medium (90-120 BPM)', value: 'medium' },
    { label: 'Fast (> 120 BPM)', value: 'fast' }
  ],
  genres: [
    { label: 'All Genres', value: 'all' },
    { label: 'Electronic', value: 'Electronic' },
    { label: 'Ambient', value: 'Ambient' },
    { label: 'Hip Hop', value: 'Hip Hop' },
    { label: 'Acoustic', value: 'Acoustic' },
    { label: 'Techno', value: 'Techno' },
    { label: 'Pop', value: 'Pop' }
  ],
  moods: [
    { label: 'All Moods', value: 'all' },
    { label: 'Chill', value: 'Chill' },
    { label: 'Dreamy', value: 'Dreamy' },
    { label: 'Energetic', value: 'Energetic' },
    { label: 'Happy', value: 'Happy' },
    { label: 'Intense', value: 'Intense' },
    { label: 'Upbeat', value: 'Upbeat' }
  ]
};

// Filter functions for search results
export const filterByBPM = (results: SearchResultProps[], bpmRange: string): SearchResultProps[] => {
  if (bpmRange === 'all') return results;
  
  return results.filter(result => {
    const bpm = result.bpm;
    if (bpmRange === 'slow') return bpm < 90;
    if (bpmRange === 'medium') return bpm >= 90 && bpm <= 120;
    if (bpmRange === 'fast') return bpm > 120;
    return true;
  });
};

export const filterByGenre = (results: SearchResultProps[], genre: string): SearchResultProps[] => {
  if (genre === 'all') return results;
  return results.filter(result => result.genre === genre);
};

export const filterByMood = (results: SearchResultProps[], mood: string): SearchResultProps[] => {
  if (mood === 'all') return results;
  return results.filter(result => result.mood === mood);
};

// Apply all filters to search results
export const applyFilters = (
  results: SearchResultProps[],
  bpmRange: string,
  genre: string,
  mood: string
): SearchResultProps[] => {
  let filteredResults = results;
  
  filteredResults = filterByBPM(filteredResults, bpmRange);
  filteredResults = filterByGenre(filteredResults, genre);
  filteredResults = filterByMood(filteredResults, mood);
  
  return filteredResults;
};