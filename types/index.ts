export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface PlayerSkills {
  id?: string;
  player_id?: string;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface PlayerSocials {
  id?: string;
  player_id?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
}

export interface PlayerVideo {
  id: string;
  player_id: string;
  title: string;
  youtube_url: string;
  description: string;
  category?: 'GOAL' | 'ASSIST' | 'SKILLS' | 'SAVE' | 'HIGHLIGHT';
  order_num?: number;
  created_at?: string;
}

export interface Player {
  id: string;
  name: string;
  jersey_number: number;
  position: PlayerPosition;
  position_detail: string;
  role: string;
  is_captain: boolean;
  is_vice_captain: boolean;
  age: number;
  height: string;
  preferred_foot: 'Right' | 'Left' | 'Both';
  photo_url: string;
  short_description: string;
  playing_style: string;
  is_active: boolean;
  skills: PlayerSkills;
  socials: PlayerSocials;
  videos?: PlayerVideo[];
  created_at?: string;
}

export type FormationType = '4-3-3' | '4-4-2' | '4-2-3-1' | '3-5-2' | '3-4-3';

export interface StartingXIPosition {
  slotId: string;      // e.g. "GK", "LB", "CB1", "CB2", "RB", "CM1", etc.
  label: string;       // e.g. "GK", "CB", "ST"
  x: number;           // percentage on pitch (0-100)
  y: number;           // percentage on pitch (0-100)
  playerId?: string;
}

export interface LineupConfig {
  id?: string;
  formation: FormationType;
  starting_xi: Record<string, string>; // slotId -> playerId
  substitutes: string[];               // array of playerIds
  updated_at?: string;
}

export type MatchStatus = 'Upcoming' | 'Completed' | 'Cancelled';

export interface Match {
  id: string;
  opponent: string;
  opponent_logo_url: string;
  date: string;          // YYYY-MM-DD
  time: string;          // HH:MM
  venue: string;
  competition: string;
  is_home: boolean;
  ghost_score: number | null;
  opponent_score: number | null;
  status: MatchStatus;
  round_info?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  content: string;
  image_url: string;
  category: string;
  published_date: string;
  is_published: boolean;
  author: string;
}

export interface TeamSettings {
  id?: string;
  team_name: string;
  logo_url: string;
  tagline: string;
  founded_year: number;
  home_ground: string;
  city: string;
  club_description: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  youtube_url: string;
  email: string;
  phone: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  role: string;
  full_name?: string;
  created_at?: string;
}

export interface ActivityLogItem {
  id: string;
  admin: string;
  action: string;
  entity: string;
  timestamp: string;
}

export * from './database';
