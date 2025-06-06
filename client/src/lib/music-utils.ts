
// Mock data for the demo

import { SearchResultProps } from '@/components/SearchResult';

// Mock result data
export const getMockResults = (): SearchResultProps[] => {
  return [
    {
      id: '1',
      title: 'Sunset Vibes',
      artist: 'ChillBeats',
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      previewUrl: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
      licenseType: 'Free to Use',
      downloadUrl: 'https://assets.mixkit.co/music/download/mixkit-tech-house-vibes-130.mp3',
      bpm: 124,
      genre: 'Electronic',
      mood: 'Chill',
      similarity: 0.95,
    },
    {
      id: '2',
      title: 'Dreamy Nights',
      artist: 'ElectroWave',
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      previewUrl: 'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3',
      licenseType: 'Attribution Required',
      downloadUrl: 'https://assets.mixkit.co/music/download/mixkit-dreaming-big-31.mp3',
      bpm: 110,
      genre: 'Ambient',
      mood: 'Dreamy',
      similarity: 0.87,
    },
    {
      id: '3',
      title: 'Urban Flow',
      artist: 'CityBeats',
      imageUrl: 'https://images.unsplash.com/photo-1504700610630-ac6aba3536d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      previewUrl: 'https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-738.mp3',
      licenseType: 'Free to Use',
      downloadUrl: 'https://assets.mixkit.co/music/download/mixkit-hip-hop-02-738.mp3',
      bpm: 95,
      genre: 'Hip Hop',
      mood: 'Energetic',
      similarity: 0.82,
    },
    {
      id: '4',
      title: 'Morning Sunshine',
      artist: 'NatureSounds',
      imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      previewUrl: 'https://assets.mixkit.co/music/preview/mixkit-sun-and-his-daughter-580.mp3',
      licenseType: 'Attribution Required',
      downloadUrl: 'https://assets.mixkit.co/music/download/mixkit-sun-and-his-daughter-580.mp3',
      bpm: 85,
      genre: 'Acoustic',
      mood: 'Happy',
      similarity: 0.78,
    },
    {
      id: '5',
      title: 'Digital Future',
      artist: 'TechGroove',
      imageUrl: 'https://images.unsplash.com/photo-1544511916-0148ccdeb877?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      previewUrl: 'https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3',
      licenseType: 'Free to Use',
      downloadUrl: 'https://assets.mixkit.co/music/download/mixkit-deep-urban-623.mp3',
      bpm: 130,
      genre: 'Techno',
      mood: 'Intense',
      similarity: 0.75,
    },
    {
      id: '6',
      title: 'Summer Feels',
      artist: 'BeachVibes',
      imageUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1626&q=80',
      previewUrl: 'https://assets.mixkit.co/music/preview/mixkit-beach-party-1141.mp3',
      licenseType: 'Free to Use',
      downloadUrl: 'https://assets.mixkit.co/music/download/mixkit-beach-party-1141.mp3',
      bpm: 105,
      genre: 'Pop',
      mood: 'Upbeat',
      similarity: 0.72,
    },
  ];
};

// Filter options
export const filterOptions = {
  bpmRanges: [
    { label: 'All BPM', value: 'all' },
    { label: 'Slow (< 90 BPM)', value: 'slow' },
    { label: 'Medium (90-120 BPM)', value: 'medium' },
    { label: 'Fast (> 120 BPM)', value: 'fast' },
  ],
  genres: [
    { label: 'All Genres', value: 'all' },
    { label: 'Electronic', value: 'Electronic' },
    { label: 'Ambient', value: 'Ambient' },
    { label: 'Hip Hop', value: 'Hip Hop' },
    { label: 'Acoustic', value: 'Acoustic' },
    { label: 'Techno', value: 'Techno' },
    { label: 'Pop', value: 'Pop' },
  ],
  moods: [
    { label: 'All Moods', value: 'all' },
    { label: 'Chill', value: 'Chill' },
    { label: 'Dreamy', value: 'Dreamy' },
    { label: 'Energetic', value: 'Energetic' },
    { label: 'Happy', value: 'Happy' },
    { label: 'Intense', value: 'Intense' },
    { label: 'Upbeat', value: 'Upbeat' },
  ],
};

// Filter functions
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

// Apply all filters
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
