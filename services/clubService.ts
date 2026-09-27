import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Player, Match, NewsArticle, TeamSettings, LineupConfig, FormationType, PlayerVideo, PlayerSkills, PlayerSocials, ActivityLogItem } from '../types';
import {
  INITIAL_PLAYERS,
  INITIAL_MATCHES,
  INITIAL_NEWS,
  INITIAL_LINEUP,
  INITIAL_TEAM_SETTINGS
} from './sampleData';

const STORAGE_KEYS = {
  PLAYERS: 'ghost_fc_players',
  MATCHES: 'ghost_fc_matches',
  NEWS: 'ghost_fc_news',
  LINEUP: 'ghost_fc_lineup',
  SETTINGS: 'ghost_fc_settings',
  LOGS: 'ghost_fc_activity_logs',
};

// Local storage helpers with safe parsing
function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export const clubService = {
  // Check live Supabase connection status
  isLiveSupabase(): boolean {
    return isSupabaseConfigured;
  },

  // ---------------- PLAYERS ----------------
  async getPlayers(): Promise<Player[]> {
    if (isSupabaseConfigured) {
      try {
        const { data: playersData, error } = await supabase
          .from('players')
          .select(`
            *,
            skills:player_skills(*),
            socials:player_socials(*),
            videos:player_videos(*)
          `)
          .order('jersey_number', { ascending: true });

        if (!error && playersData && playersData.length > 0) {
          return playersData.map((p: any) => {
            const resolvedSkills = Array.isArray(p.skills) ? p.skills[0] : p.skills;
            const resolvedSocials = Array.isArray(p.socials) ? p.socials[0] : p.socials;

            return {
              ...p,
              skills: resolvedSkills || { pace: 75, shooting: 75, passing: 75, dribbling: 75, defending: 75, physical: 75 },
              socials: resolvedSocials || {},
              videos: p.videos || []
            };
          });
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local store:', err);
      }
    }
    return getLocalItem<Player[]>(STORAGE_KEYS.PLAYERS, INITIAL_PLAYERS);
  },

  async getPlayerById(id: string): Promise<Player | null> {
    const players = await this.getPlayers();
    return players.find((p) => p.id === id) || null;
  },

  async savePlayer(player: Partial<Player>): Promise<Player> {
    const players = await this.getPlayers();
    let updatedPlayer: Player;

    if (player.id) {
      // Update
      const index = players.findIndex((p) => p.id === player.id);
      if (index === -1) throw new Error('Player not found');
      updatedPlayer = { ...players[index], ...player } as Player;
      players[index] = updatedPlayer;
    } else {
      // Create new
      const newId = 'p-' + Date.now();
      updatedPlayer = {
        id: newId,
        name: player.name || 'New Player',
        jersey_number: player.jersey_number || 99,
        position: player.position || 'FWD',
        position_detail: player.position_detail || 'Forward',
        role: player.role || 'Squad Member',
        is_captain: false,
        is_vice_captain: false,
        age: player.age || 20,
        height: player.height || '180 cm',
        preferred_foot: player.preferred_foot || 'Right',
        photo_url: player.photo_url || '/ghost-fc-logo.jpg',
        short_description: player.short_description || '',
        playing_style: player.playing_style || '',
        is_active: player.is_active ?? true,
        skills: player.skills || { pace: 75, shooting: 75, passing: 75, dribbling: 75, defending: 75, physical: 75 },
        socials: player.socials || {},
        videos: player.videos || [],
        created_at: new Date().toISOString()
      };
      players.push(updatedPlayer);
    }

    if (isSupabaseConfigured) {
      try {
        const { error: pError } = await supabase.from('players').upsert({
          id: updatedPlayer.id,
          name: updatedPlayer.name,
          jersey_number: updatedPlayer.jersey_number,
          position: updatedPlayer.position,
          position_detail: updatedPlayer.position_detail,
          role: updatedPlayer.role,
          is_captain: updatedPlayer.is_captain,
          is_vice_captain: updatedPlayer.is_vice_captain,
          age: updatedPlayer.age,
          height: updatedPlayer.height,
          preferred_foot: updatedPlayer.preferred_foot,
          photo_url: updatedPlayer.photo_url,
          short_description: updatedPlayer.short_description,
          playing_style: updatedPlayer.playing_style,
          is_active: updatedPlayer.is_active
        });

        if (!pError) {
          if (updatedPlayer.skills) {
            await supabase.from('player_skills').upsert(
              {
                player_id: updatedPlayer.id,
                pace: updatedPlayer.skills.pace,
                shooting: updatedPlayer.skills.shooting,
                passing: updatedPlayer.skills.passing,
                dribbling: updatedPlayer.skills.dribbling,
                defending: updatedPlayer.skills.defending,
                physical: updatedPlayer.skills.physical
              },
              { onConflict: 'player_id' }
            );
          }
          if (updatedPlayer.socials) {
            await supabase.from('player_socials').upsert(
              {
                player_id: updatedPlayer.id,
                instagram: updatedPlayer.socials.instagram || '',
                facebook: updatedPlayer.socials.facebook || '',
                tiktok: updatedPlayer.socials.tiktok || '',
                youtube: updatedPlayer.socials.youtube || ''
              },
              { onConflict: 'player_id' }
            );
          }
        }
      } catch (err) {
        console.warn('Supabase player upsert error:', err);
      }
    }

    setLocalItem(STORAGE_KEYS.PLAYERS, players);
    this.logActivity(
      player.id
        ? `Updated dossier for player ${updatedPlayer.name} (#${updatedPlayer.jersey_number})`
        : `Added new squad player ${updatedPlayer.name} (#${updatedPlayer.jersey_number})`,
      'Players'
    );
    return updatedPlayer;
  },

  async deletePlayer(id: string): Promise<boolean> {
    const players = await this.getPlayers();
    const targetPlayer = players.find((p) => p.id === id);
    const filtered = players.filter((p) => p.id !== id);
    setLocalItem(STORAGE_KEYS.PLAYERS, filtered);

    // Also remove from lineup if present
    const lineup = await this.getLineup();
    let lineupChanged = false;
    const newStartingXI = { ...lineup.starting_xi };
    for (const slot in newStartingXI) {
      if (newStartingXI[slot] === id) {
        delete newStartingXI[slot];
        lineupChanged = true;
      }
    }
    const newSubs = lineup.substitutes.filter((subId) => subId !== id);
    if (lineupChanged || newSubs.length !== lineup.substitutes.length) {
      await this.saveLineup({ ...lineup, starting_xi: newStartingXI, substitutes: newSubs });
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('players').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }
    this.logActivity(`Permanently deleted squad player ${targetPlayer?.name || id}`, 'Players');
    return true;
  },

  async setCaptain(captainId: string, viceCaptainId: string): Promise<void> {
    const players = await this.getPlayers();
    const updated = players.map((p) => ({
      ...p,
      is_captain: p.id === captainId,
      is_vice_captain: p.id === viceCaptainId,
      role: p.id === captainId ? 'Club Captain' : p.id === viceCaptainId ? 'Vice Captain' : (p.role === 'Club Captain' || p.role === 'Vice Captain' ? 'First Team' : p.role)
    }));
    setLocalItem(STORAGE_KEYS.PLAYERS, updated);

    if (isSupabaseConfigured) {
      try {
        for (const p of updated) {
          await supabase.from('players').update({
            is_captain: p.is_captain,
            is_vice_captain: p.is_vice_captain,
            role: p.role
          }).eq('id', p.id);
        }
      } catch (err) {
        console.warn('Supabase captain update error:', err);
      }
    }
  },

  // ---------------- VIDEOS ----------------
  async addPlayerVideo(playerId: string, video: Omit<PlayerVideo, 'id' | 'player_id'>): Promise<PlayerVideo> {
    const players = await this.getPlayers();
    const playerIndex = players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) throw new Error('Player not found');

    const newVideo: PlayerVideo = {
      id: 'v-' + Date.now(),
      player_id: playerId,
      ...video,
      created_at: new Date().toISOString()
    };

    if (!players[playerIndex].videos) {
      players[playerIndex].videos = [];
    }
    players[playerIndex].videos.push(newVideo);
    setLocalItem(STORAGE_KEYS.PLAYERS, players);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('player_videos').insert({
          id: newVideo.id,
          player_id: newVideo.player_id,
          title: newVideo.title,
          youtube_url: newVideo.youtube_url,
          description: newVideo.description || '',
          category: newVideo.category || 'HIGHLIGHT',
          order_num: newVideo.order_num || 1,
          created_at: newVideo.created_at
        });
      } catch (err) {
        console.warn('Supabase video insert error:', err);
      }
    }
    this.logActivity(`Added highlight reel "${newVideo.title}" for ${players[playerIndex]?.name || 'player'}`, 'Videos');
    return newVideo;
  },

  async editPlayerVideo(playerId: string, videoId: string, updates: Partial<PlayerVideo>): Promise<void> {
    const players = await this.getPlayers();
    const pIdx = players.findIndex((p) => p.id === playerId);
    if (pIdx !== -1 && players[pIdx].videos) {
      const vIdx = players[pIdx].videos!.findIndex((v) => v.id === videoId);
      if (vIdx !== -1) {
        players[pIdx].videos![vIdx] = { ...players[pIdx].videos![vIdx], ...updates };
        setLocalItem(STORAGE_KEYS.PLAYERS, players);
      }
    }
    if (isSupabaseConfigured) {
      try {
        await supabase.from('player_videos').update({
          title: updates.title,
          youtube_url: updates.youtube_url,
          description: updates.description,
          category: updates.category
        }).eq('id', videoId);
      } catch (err) {
        console.warn('Supabase video update error:', err);
      }
    }
    this.logActivity(`Updated YouTube highlight reel "${updates.title || videoId}"`, 'Videos');
  },

  async deletePlayerVideo(playerId: string, videoId: string): Promise<boolean> {
    const players = await this.getPlayers();
    const player = players.find((p) => p.id === playerId);
    if (player && player.videos) {
      player.videos = player.videos.filter((v) => v.id !== videoId);
      setLocalItem(STORAGE_KEYS.PLAYERS, players);
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('player_videos').delete().eq('id', videoId);
      } catch (err) {
        console.warn('Supabase video delete error:', err);
      }
    }
    this.logActivity(`Removed video highlight ${videoId}`, 'Videos');
    return true;
  },

  // ---------------- MATCHES ----------------
  async getMatches(): Promise<Match[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('matches')
          .select('*')
          .order('date', { ascending: false });

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase match fetch error:', err);
      }
    }
    return getLocalItem<Match[]>(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);
  },

  async saveMatch(match: Partial<Match>): Promise<Match> {
    const matches = await this.getMatches();
    let updatedMatch: Match;

    if (match.id) {
      const idx = matches.findIndex((m) => m.id === match.id);
      if (idx === -1) throw new Error('Match not found');
      updatedMatch = { ...matches[idx], ...match } as Match;
      matches[idx] = updatedMatch;
    } else {
      updatedMatch = {
        id: 'm-' + Date.now(),
        opponent: match.opponent || 'Opponent FC',
        opponent_logo_url: match.opponent_logo_url || '/ghost-fc-logo.jpg',
        date: match.date || new Date().toISOString().split('T')[0],
        time: match.time || '20:00',
        venue: match.venue || 'The Crypt Arena',
        competition: match.competition || 'Elite Super League',
        is_home: match.is_home ?? true,
        ghost_score: match.ghost_score ?? null,
        opponent_score: match.opponent_score ?? null,
        status: match.status || 'Upcoming',
        round_info: match.round_info || 'Fixture'
      };
      matches.unshift(updatedMatch);
    }

    setLocalItem(STORAGE_KEYS.MATCHES, matches);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('matches').upsert(updatedMatch);
      } catch (err) {
        console.warn('Supabase match upsert error:', err);
      }
    }
    return updatedMatch;
  },

  async deleteMatch(id: string): Promise<boolean> {
    const matches = await this.getMatches();
    const filtered = matches.filter((m) => m.id !== id);
    setLocalItem(STORAGE_KEYS.MATCHES, filtered);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('matches').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase match delete error:', err);
      }
    }
    return true;
  },

  // ---------------- NEWS ----------------
  async getNews(): Promise<NewsArticle[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('published_date', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((item) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            short_description: item.short_description || '',
            content: item.content || '',
            image_url: item.image_url || '',
            category: item.category || 'CLUB NEWS',
            published_date: item.published_date || '',
            is_published: item.is_published ?? true,
            author: item.author || 'GHOST FC Media'
          }));
        }
      } catch (err) {
        console.warn('Supabase news fetch error:', err);
      }
    }
    return getLocalItem<NewsArticle[]>(STORAGE_KEYS.NEWS, INITIAL_NEWS);
  },

  async getNewsById(idOrSlug: string): Promise<NewsArticle | null> {
    const articles = await this.getNews();
    return articles.find((a) => a.id === idOrSlug || a.slug === idOrSlug) || null;
  },

  async saveNews(article: Partial<NewsArticle>): Promise<NewsArticle> {
    const list = await this.getNews();
    let updated: NewsArticle;

    const slug = article.slug || (article.title ? article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'news-' + Date.now());

    if (article.id) {
      const idx = list.findIndex((a) => a.id === article.id);
      if (idx === -1) throw new Error('News article not found');
      updated = { ...list[idx], ...article, slug } as NewsArticle;
      list[idx] = updated;
    } else {
      updated = {
        id: 'news-' + Date.now(),
        title: article.title || 'Untitled News',
        slug,
        short_description: article.short_description || '',
        content: article.content || '',
        image_url: article.image_url || '/stadium_atmosphere_1790354254462.jpg',
        category: article.category || 'CLUB NEWS',
        published_date: article.published_date || new Date().toISOString().split('T')[0],
        is_published: article.is_published ?? true,
        author: article.author || 'GHOST FC Media'
      };
      list.unshift(updated);
    }

    setLocalItem(STORAGE_KEYS.NEWS, list);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('news').upsert(updated);
      } catch (err) {
        console.warn('Supabase news upsert error:', err);
      }
    }
    return updated;
  },

  async deleteNews(id: string): Promise<boolean> {
    const list = await this.getNews();
    const filtered = list.filter((n) => n.id !== id);
    setLocalItem(STORAGE_KEYS.NEWS, filtered);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('news').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase news delete error:', err);
      }
    }
    return true;
  },

  // ---------------- LINEUP & FORMATION ----------------
  async getLineup(): Promise<LineupConfig> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('lineup')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          return {
            id: data.id,
            formation: data.formation as FormationType,
            starting_xi: typeof data.starting_xi === 'string' ? JSON.parse(data.starting_xi) : data.starting_xi,
            substitutes: typeof data.substitutes === 'string' ? JSON.parse(data.substitutes) : data.substitutes,
            updated_at: data.updated_at
          };
        }
      } catch (err) {
        console.warn('Supabase lineup fetch error:', err);
      }
    }
    return getLocalItem<LineupConfig>(STORAGE_KEYS.LINEUP, INITIAL_LINEUP);
  },

  async saveLineup(lineup: LineupConfig): Promise<LineupConfig> {
    const updated = {
      ...lineup,
      id: lineup.id || 'default_lineup',
      updated_at: new Date().toISOString()
    };
    setLocalItem(STORAGE_KEYS.LINEUP, updated);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('lineup').upsert({
          id: updated.id,
          formation: updated.formation,
          starting_xi: updated.starting_xi,
          substitutes: updated.substitutes,
          updated_at: updated.updated_at
        });
      } catch (err) {
        console.warn('Supabase lineup upsert error:', err);
      }
    }
    return updated;
  },

  // ---------------- TEAM SETTINGS ----------------
  async getTeamSettings(): Promise<TeamSettings> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('team_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase settings fetch error:', err);
      }
    }
    return getLocalItem<TeamSettings>(STORAGE_KEYS.SETTINGS, INITIAL_TEAM_SETTINGS);
  },

  async saveTeamSettings(settings: Partial<TeamSettings>): Promise<TeamSettings> {
    const current = await this.getTeamSettings();
    const updated = { ...current, ...settings, id: current.id || 'default_settings' };
    setLocalItem(STORAGE_KEYS.SETTINGS, updated);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('team_settings').upsert({
          ...updated,
          id: updated.id || 'default_settings'
        });
      } catch (err) {
        console.warn('Supabase settings upsert error:', err);
      }
    }
    this.logActivity('Updated official club brand identity and ground metadata', 'Team Settings');
    return updated;
  },

  // ---------------- DIRECT SKILLS & SOCIALS ----------------
  async updatePlayerSkills(playerId: string, skills: PlayerSkills): Promise<void> {
    const players = await this.getPlayers();
    const idx = players.findIndex((p) => p.id === playerId);
    if (idx !== -1) {
      players[idx].skills = skills;
      setLocalItem(STORAGE_KEYS.PLAYERS, players);
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('player_skills').upsert(
          {
            player_id: playerId,
            pace: skills.pace,
            shooting: skills.shooting,
            passing: skills.passing,
            dribbling: skills.dribbling,
            defending: skills.defending,
            physical: skills.physical
          },
          { onConflict: 'player_id' }
        );
      } catch (err) {
        console.warn('Supabase player skills upsert error:', err);
      }
    }
    const pName = idx !== -1 ? players[idx].name : playerId;
    this.logActivity(`Updated athletic performance attributes for ${pName}`, 'Player Skills');
  },

  async updatePlayerSocials(playerId: string, socials: PlayerSocials): Promise<void> {
    const players = await this.getPlayers();
    const idx = players.findIndex((p) => p.id === playerId);
    if (idx !== -1) {
      players[idx].socials = socials;
      setLocalItem(STORAGE_KEYS.PLAYERS, players);
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('player_socials').upsert(
          {
            player_id: playerId,
            instagram: socials.instagram || '',
            facebook: socials.facebook || '',
            tiktok: socials.tiktok || '',
            youtube: socials.youtube || ''
          },
          { onConflict: 'player_id' }
        );
      } catch (err) {
        console.warn('Supabase player socials upsert error:', err);
      }
    }
    const pName = idx !== -1 ? players[idx].name : playerId;
    this.logActivity(`Updated verified social profiles for ${pName}`, 'Player Socials');
  },

  // ---------------- VIDEOS AGGREGATE ----------------
  async getAllVideos(): Promise<Array<PlayerVideo & { playerName?: string }>> {
    const players = await this.getPlayers();
    const result: Array<PlayerVideo & { playerName?: string }> = [];

    for (const p of players) {
      if (p.videos && p.videos.length > 0) {
        for (const v of p.videos) {
          result.push({
            ...v,
            playerName: p.name
          });
        }
      }
    }
    return result;
  },

  // ---------------- ACTIVITY AUDIT LOG ----------------
  async getActivityLogs(): Promise<ActivityLogItem[]> {
    const defaultLogs: ActivityLogItem[] = [
      {
        id: 'log-1',
        admin: 'khaledarahman93@gmail.com',
        action: 'System initialized & verified Supabase connectivity',
        entity: 'System Architecture',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];

    const logs = getLocalItem<ActivityLogItem[]>(STORAGE_KEYS.LOGS, defaultLogs);
    return logs;
  },

  logActivity(action: string, entity: string, admin?: string): void {
    try {
      const currentLogs = getLocalItem<ActivityLogItem[]>(STORAGE_KEYS.LOGS, []);
      const newLog: ActivityLogItem = {
        id: 'log-' + Date.now(),
        admin: admin || 'khaledarahman93@gmail.com',
        action,
        entity,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      const updated = [newLog, ...currentLogs].slice(0, 50); // Keep latest 50
      setLocalItem(STORAGE_KEYS.LOGS, updated);
    } catch (e) {
      console.warn('Failed to record activity audit log:', e);
    }
  },

  // Reset local database back to default sample state
  resetToSampleData(): void {
    setLocalItem(STORAGE_KEYS.PLAYERS, INITIAL_PLAYERS);
    setLocalItem(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);
    setLocalItem(STORAGE_KEYS.NEWS, INITIAL_NEWS);
    setLocalItem(STORAGE_KEYS.LINEUP, INITIAL_LINEUP);
    setLocalItem(STORAGE_KEYS.SETTINGS, INITIAL_TEAM_SETTINGS);
  }
};
