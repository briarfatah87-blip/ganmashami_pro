// Xtream Codes API Client for fetching movies and series from IPTV

const BASE_URL = process.env.XTREAM_BASE_URL || 'http://plus.kurdcinema.krd:25461';
const USERNAME = process.env.XTREAM_USERNAME || 'test';
const PASSWORD = process.env.XTREAM_PASSWORD || 'test1234';

const API_URL = `${BASE_URL}/player_api.php?username=${USERNAME}&password=${PASSWORD}`;

// ===== Types =====

export interface XtreamCategory {
  category_id: string;
  category_name: string;
  parent_id: number;
}

export interface XtreamVodStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string | null;
  rating: string | number;
  rating_5based: number;
  added: string;
  category_id: string;
  container_extension: string;
  custom_sid: string;
  direct_source: string;
}

export interface XtreamSeries {
  num: number;
  name: string;
  series_id: number;
  cover: string | null;
  plot: string;
  cast: string;
  director: string;
  genre: string;
  releaseDate: string;
  last_modified: string;
  rating: string | number;
  rating_5based: number;
  backdrop_path: string[];
  youtube_trailer: string;
  episode_run_time: string;
  category_id: string;
}

export interface XtreamSeasonInfo {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  season_number: number;
  vote_average: number;
  cover: string;
  cover_big: string;
}

export interface XtreamEpisode {
  id: string;
  episode_num: number;
  title: string;
  container_extension: string;
  info: {
    tmdb_id: number;
    releasedate: string;
    plot: string;
    duration_secs: number;
    duration: string;
    movie_image: string;
    bitrate: number;
    rating: number;
    season: string;
  };
  custom_sid: string;
  added: string;
  season: number;
  direct_source: string;
}

export interface XtreamSeriesInfo {
  seasons: XtreamSeasonInfo[];
  info: XtreamSeries;
  episodes: Record<string, XtreamEpisode[]>;
}

export interface XtreamVodInfo {
  info: {
    tmdb_id: string;
    name: string;
    o_name: string;
    cover_big: string;
    movie_image: string;
    releasedate: string;
    episode_run_time: string;
    youtube_trailer: string;
    director: string;
    actors: string;
    cast: string;
    description: string;
    plot: string;
    age: string;
    mpaa_rating: string;
    country: string;
    genre: string;
    backdrop_path: string[];
    duration_secs: number;
    duration: string;
    rating: string;
    bitrate: number;
    video?: {
      width: number;
      height: number;
      codec_name: string;
    };
    audio?: {
      codec_name: string;
      channels: number;
      channel_layout: string;
    };
  };
  movie_data: {
    stream_id: number;
    name: string;
    container_extension: string;
  };
}

// ===== Mapped Types (for the app) =====

export interface MappedMovie {
  id: string;
  title: string;
  description: string;
  poster: string;
  backdrop: string;
  releaseYear: number;
  releaseDate: string;
  duration: number;
  durationText: string;
  genre: string;
  rating: number;
  views: number;
  streamUrl: string;
  streamId: number;
  containerExtension: string;
  director: string;
  cast: string;
  country: string;
  youtubeTrailer: string;
  quality: string;
  audioChannels: string;
}

export interface MappedSeries {
  id: string;
  title: string;
  description: string;
  poster: string;
  backdrop: string;
  releaseYear: number;
  genre: string;
  rating: number;
  views: number;
  seriesId: number;
  seasons: MappedSeason[];
}

export interface MappedSeason {
  id: string;
  seasonNumber: number;
  title: string;
  episodes: MappedEpisode[];
}

export interface MappedEpisode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  streamUrl: string;
}

// ===== Helper =====

function extractYear(name: string): number {
  const match = name.match(/\((\d{4})\)/);
  if (match) return parseInt(match[1]);
  const match2 = name.match(/\.(\d{4})(?:\.|$)/);
  if (match2) return parseInt(match2[1]);
  return 0;
}

function cleanTitle(name: string): string {
  // Remove year patterns like (2024) or .2024
  return name
    .replace(/\s*\(\d{4}\)\s*$/, '')
    .replace(/\.\d{4}(?:\..+)?$/, '')
    .replace(/\./g, ' ')
    .trim();
}

// ===== API Functions =====

async function fetchApi(action: string, params: Record<string, string> = {}): Promise<unknown> {
  const searchParams = new URLSearchParams(params);
  const url = `${API_URL}&action=${action}${searchParams.toString() ? '&' + searchParams.toString() : ''}`;

  const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
  if (!res.ok) throw new Error(`Xtream API error: ${res.status}`);
  return res.json();
}

// --- Categories ---

export async function getVodCategories(): Promise<XtreamCategory[]> {
  return fetchApi('get_vod_categories') as Promise<XtreamCategory[]>;
}

export async function getSeriesCategories(): Promise<XtreamCategory[]> {
  return fetchApi('get_series_categories') as Promise<XtreamCategory[]>;
}

// --- VOD Streams ---

export async function getVodStreams(categoryId?: string): Promise<XtreamVodStream[]> {
  const params: Record<string, string> = {};
  if (categoryId) params.category_id = categoryId;
  return fetchApi('get_vod_streams', params) as Promise<XtreamVodStream[]>;
}

export async function getVodStreamsByCategory(categoryId: string): Promise<XtreamVodStream[]> {
  return getVodStreams(categoryId);
}

// --- Series ---

export async function getSeries(categoryId?: string): Promise<XtreamSeries[]> {
  const params: Record<string, string> = {};
  if (categoryId) params.category_id = categoryId;
  return fetchApi('get_series', params) as Promise<XtreamSeries[]>;
}

export async function getSeriesInfo(seriesId: string | number): Promise<XtreamSeriesInfo> {
  return fetchApi('get_series_info', { series_id: String(seriesId) }) as Promise<XtreamSeriesInfo>;
}

export async function getVodInfo(vodId: string | number): Promise<XtreamVodInfo> {
  return fetchApi('get_vod_info', { vod_id: String(vodId) }) as Promise<XtreamVodInfo>;
}

// --- Stream URLs (proxied through Next.js to avoid CORS/mixed-content issues) ---

export function getMovieStreamUrl(streamId: number, extension: string = 'mp4'): string {
  return `/api/stream?type=movie&id=${streamId}&ext=${extension}`;
}

export function getEpisodeStreamUrl(episodeId: string | number, extension: string = 'mp4'): string {
  return `/api/stream?type=series&id=${episodeId}&ext=${extension}`;
}

// ===== Mapping Functions =====

export function mapVodToMovie(vod: XtreamVodStream, categoryName?: string): MappedMovie {
  const rating = typeof vod.rating === 'string' ? parseFloat(vod.rating) || 0 : vod.rating || 0;
  return {
    id: `movie-${vod.stream_id}`,
    title: cleanTitle(vod.name),
    description: '',
    poster: vod.stream_icon || '',
    backdrop: vod.stream_icon || '',
    releaseYear: extractYear(vod.name),
    releaseDate: '',
    duration: 0,
    durationText: '',
    genre: categoryName || '',
    rating: Math.round(rating * 10) / 10,
    views: 0,
    streamUrl: getMovieStreamUrl(vod.stream_id, vod.container_extension),
    streamId: vod.stream_id,
    containerExtension: vod.container_extension,
    director: '',
    cast: '',
    country: '',
    youtubeTrailer: '',
    quality: '',
    audioChannels: '',
  };
}

export function mapVodInfoToMovie(info: XtreamVodInfo): MappedMovie {
  const data = info.info;
  const movieData = info.movie_data;
  const rating = parseFloat(data?.rating) || 0;
  const year = data?.releasedate ? parseInt(data.releasedate.split('-')[0]) : extractYear(data?.name || '');

  let quality = '';
  if (data?.video?.width) {
    if (data.video.width >= 3840) quality = '4K';
    else if (data.video.width >= 1920) quality = '1080p';
    else if (data.video.width >= 1280) quality = '720p';
    else quality = `${data.video.width}x${data.video.height}`;
  }

  return {
    id: `movie-${movieData?.stream_id}`,
    title: cleanTitle(data?.name || movieData?.name || ''),
    description: data?.plot || data?.description || '',
    poster: data?.movie_image || data?.cover_big || '',
    backdrop: data?.backdrop_path?.[0] || data?.cover_big || '',
    releaseYear: year || 0,
    releaseDate: data?.releasedate || '',
    duration: data?.duration_secs ? Math.floor(data.duration_secs / 60) : 0,
    durationText: data?.duration || '',
    genre: data?.genre || '',
    rating: Math.round(rating * 10) / 10,
    views: 0,
    streamUrl: getMovieStreamUrl(movieData?.stream_id, movieData?.container_extension),
    streamId: movieData?.stream_id,
    containerExtension: movieData?.container_extension || 'mp4',
    director: data?.director || '',
    cast: data?.cast || data?.actors || '',
    country: data?.country || '',
    youtubeTrailer: data?.youtube_trailer || '',
    quality,
    audioChannels: data?.audio?.channel_layout || '',
  };
}

export function mapSeriesToApp(series: XtreamSeries): MappedSeries {
  if (!series) {
    return {
      id: 'series-unknown',
      title: 'Unknown Series',
      description: '',
      poster: '',
      backdrop: '',
      releaseYear: 0,
      genre: '',
      rating: 0,
      views: 0,
      seriesId: 0,
      seasons: [],
    };
  }
  const rating = typeof series.rating === 'string' ? parseFloat(series.rating) || 0 : series.rating || 0;
  const year = series.releaseDate ? parseInt(series.releaseDate.split('-')[0]) : extractYear(series.name || '');
  return {
    id: `series-${series.series_id}`,
    title: cleanTitle(series.name || ''),
    description: series.plot || '',
    poster: series.cover || '',
    backdrop: series.backdrop_path?.[0] || series.cover || '',
    releaseYear: year || 0,
    genre: series.genre?.trim() || '',
    rating: Math.round(rating * 10) / 10,
    views: 0,
    seriesId: series.series_id,
    seasons: [],
  };
}

export function mapSeriesInfoToApp(info: XtreamSeriesInfo, seriesId: string | number): MappedSeries {
  const mapped = mapSeriesToApp(info?.info as XtreamSeries);

  // The get_series_info API doesn't include series_id in its info object, so inject it
  mapped.id = `series-${seriesId}`;
  mapped.seriesId = typeof seriesId === 'string' ? parseInt(seriesId) || 0 : seriesId;

  if (info?.seasons) {
    mapped.seasons = info.seasons.map(season => ({
      id: `season-${season.id}`,
      seasonNumber: season.season_number,
      title: season.name || `Season ${season.season_number}`,
      episodes: (info.episodes?.[String(season.season_number)] || []).map(ep => ({
        id: `episode-${ep.id}`,
        episodeNumber: ep.episode_num,
        title: ep.title || `Episode ${ep.episode_num}`,
        description: ep.info?.plot || '',
        duration: ep.info?.duration_secs ? Math.floor(ep.info.duration_secs / 60) : 0,
        thumbnail: ep.info?.movie_image || '',
        streamUrl: getEpisodeStreamUrl(ep.id, ep.container_extension),
      })),
    }));
  }

  return mapped;
}
