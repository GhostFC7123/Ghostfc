export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string;
          name: string;
          jersey_number: number;
          position: 'GK' | 'DEF' | 'MID' | 'FWD';
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
          created_at?: string;
        };
        Insert: {
          id?: string;
          name: string;
          jersey_number: number;
          position: 'GK' | 'DEF' | 'MID' | 'FWD';
          position_detail?: string;
          role?: string;
          is_captain?: boolean;
          is_vice_captain?: boolean;
          age?: number;
          height?: string;
          preferred_foot?: 'Right' | 'Left' | 'Both';
          photo_url?: string;
          short_description?: string;
          playing_style?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          jersey_number?: number;
          position?: 'GK' | 'DEF' | 'MID' | 'FWD';
          position_detail?: string;
          role?: string;
          is_captain?: boolean;
          is_vice_captain?: boolean;
          age?: number;
          height?: string;
          preferred_foot?: 'Right' | 'Left' | 'Both';
          photo_url?: string;
          short_description?: string;
          playing_style?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };

      player_skills: {
        Row: {
          id: string;
          player_id: string;
          pace: number;
          shooting: number;
          passing: number;
          dribbling: number;
          defending: number;
          physical: number;
        };
        Insert: {
          id?: string;
          player_id: string;
          pace: number;
          shooting: number;
          passing: number;
          dribbling: number;
          defending: number;
          physical: number;
        };
        Update: {
          id?: string;
          player_id?: string;
          pace?: number;
          shooting?: number;
          passing?: number;
          dribbling?: number;
          defending?: number;
          physical?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'player_skills_player_id_fkey';
            columns: ['player_id'];
            isOneToOne: true;
            referencedRelation: 'players';
            referencedColumns: ['id'];
          }
        ];
      };

      player_socials: {
        Row: {
          id: string;
          player_id: string;
          instagram?: string;
          facebook?: string;
          tiktok?: string;
          youtube?: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          instagram?: string;
          facebook?: string;
          tiktok?: string;
          youtube?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          instagram?: string;
          facebook?: string;
          tiktok?: string;
          youtube?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'player_socials_player_id_fkey';
            columns: ['player_id'];
            isOneToOne: true;
            referencedRelation: 'players';
            referencedColumns: ['id'];
          }
        ];
      };

      player_videos: {
        Row: {
          id: string;
          player_id: string;
          title: string;
          youtube_url: string;
          description?: string;
          category?: string;
          order_num?: number;
          created_at?: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          title: string;
          youtube_url: string;
          description?: string;
          category?: string;
          order_num?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          title?: string;
          youtube_url?: string;
          description?: string;
          category?: string;
          order_num?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'player_videos_player_id_fkey';
            columns: ['player_id'];
            isOneToOne: false;
            referencedRelation: 'players';
            referencedColumns: ['id'];
          }
        ];
      };

      lineup: {
        Row: {
          id: string;
          formation: string;
          starting_xi: Json;
          substitutes: Json;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          formation?: string;
          starting_xi?: Json;
          substitutes?: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          formation?: string;
          starting_xi?: Json;
          substitutes?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };

      matches: {
        Row: {
          id: string;
          opponent: string;
          opponent_logo_url: string;
          date: string;
          time: string;
          venue: string;
          competition: string;
          is_home: boolean;
          ghost_score: number | null;
          opponent_score: number | null;
          status: 'Upcoming' | 'Completed' | 'Cancelled';
          round_info?: string;
        };
        Insert: {
          id?: string;
          opponent: string;
          opponent_logo_url?: string;
          date?: string;
          time?: string;
          venue?: string;
          competition?: string;
          is_home?: boolean;
          ghost_score?: number | null;
          opponent_score?: number | null;
          status?: 'Upcoming' | 'Completed' | 'Cancelled';
          round_info?: string;
        };
        Update: {
          id?: string;
          opponent?: string;
          opponent_logo_url?: string;
          date?: string;
          time?: string;
          venue?: string;
          competition?: string;
          is_home?: boolean;
          ghost_score?: number | null;
          opponent_score?: number | null;
          status?: 'Upcoming' | 'Completed' | 'Cancelled';
          round_info?: string;
        };
        Relationships: [];
      };

      news: {
        Row: {
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
          created_at?: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          short_description?: string;
          content?: string;
          image_url?: string;
          category?: string;
          published_date?: string;
          is_published?: boolean;
          author?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          short_description?: string;
          content?: string;
          image_url?: string;
          category?: string;
          published_date?: string;
          is_published?: boolean;
          author?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      team_settings: {
        Row: {
          id: string;
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
          updated_at?: string;
        };
        Insert: {
          id?: string;
          team_name?: string;
          logo_url?: string;
          tagline?: string;
          founded_year?: number;
          home_ground?: string;
          city?: string;
          club_description?: string;
          instagram_url?: string;
          facebook_url?: string;
          tiktok_url?: string;
          youtube_url?: string;
          email?: string;
          phone?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          team_name?: string;
          logo_url?: string;
          tagline?: string;
          founded_year?: number;
          home_ground?: string;
          city?: string;
          club_description?: string;
          instagram_url?: string;
          facebook_url?: string;
          tiktok_url?: string;
          youtube_url?: string;
          email?: string;
          phone?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      admin_profiles: {
        Row: {
          id: string;
          email: string;
          role: string;
          full_name?: string;
          created_at?: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: string;
          full_name?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: string;
          full_name?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      activity_logs: {
        Row: {
          id: string;
          admin: string;
          action: string;
          entity: string;
          created_at?: string;
        };
        Insert: {
          id?: string;
          admin: string;
          action: string;
          entity: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin?: string;
          action?: string;
          entity?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_authorized_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Convenient Row and helper aliases
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type PlayerRow = Tables<'players'>;
export type PlayerSkillRow = Tables<'player_skills'>;
export type PlayerSocialRow = Tables<'player_socials'>;
export type PlayerVideoRow = Tables<'player_videos'>;
export type LineupRow = Tables<'lineup'>;
export type MatchRow = Tables<'matches'>;
export type NewsRow = Tables<'news'>;
export type TeamSettingsRow = Tables<'team_settings'>;
export type AdminProfileRow = Tables<'admin_profiles'>;
export type ActivityLogRow = Tables<'activity_logs'>;
