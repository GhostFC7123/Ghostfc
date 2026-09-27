import { Player, Match, NewsArticle, TeamSettings, LineupConfig } from '../types';

export const INITIAL_TEAM_SETTINGS: TeamSettings = {
  team_name: 'GHOST FC',
  logo_url: '/ghost-fc-logo.jpg',
  tagline: 'BORN TO DOMINATE.',
  founded_year: 2024,
  home_ground: 'The Crypt Arena',
  city: 'London / Global',
  club_description: 'Founded with an uncompromising ethos of tactical supremacy, physical intensity, and athletic dominance, GHOST FC represents a relentless new force in modern football. We strike from the shadows and leave our mark on every pitch.',
  instagram_url: 'https://instagram.com/ghostfc_official',
  facebook_url: 'https://facebook.com/ghostfcofficial',
  tiktok_url: 'https://tiktok.com/@ghostfc',
  youtube_url: 'https://youtube.com/@ghostfc',
  email: 'contact@ghostfc.com',
  phone: '+44 20 7946 0912',
};

export const INITIAL_PLAYERS: Player[] = [
  {
    id: 'p-1',
    name: 'Marco "Phantom" Silva',
    jersey_number: 10,
    position: 'MID',
    position_detail: 'Attacking Midfielder',
    role: 'Club Captain',
    is_captain: true,
    is_vice_captain: false,
    age: 27,
    height: '185 cm',
    preferred_foot: 'Right',
    photo_url: '/ghost_fc_captain_1790354267610.jpg',
    short_description: 'Visionary playmaker with supernatural spatial awareness and deadly set-piece precision.',
    playing_style: 'A classic modern number 10 who commands the tempo. Silva manipulates opposing defensive lines with disguised passes and possesses a lethal long-range strike. Always finds pockets of space where none exist.',
    is_active: true,
    skills: { pace: 88, shooting: 91, passing: 95, dribbling: 94, defending: 62, physical: 82 },
    socials: {
      instagram: 'https://instagram.com/marcosilva_10',
      youtube: 'https://youtube.com',
      tiktok: 'https://tiktok.com'
    },
    videos: [
      {
        id: 'v-101',
        player_id: 'p-1',
        title: 'Silva 35-Yard Free Kick Stunner vs Iron City',
        youtube_url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
        description: 'Spectacular curling set-piece into the top corner at the 89th minute.',
        category: 'GOAL',
        order_num: 1
      },
      {
        id: 'v-102',
        player_id: 'p-1',
        title: 'Masterclass: 9 Key Passes & Playmaking Highlights',
        youtube_url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
        description: 'Every touch, through ball, and dribble from the Champions Cup clash.',
        category: 'SKILLS',
        order_num: 2
      }
    ]
  },
  {
    id: 'p-2',
    name: 'Victor "Apex" Drake',
    jersey_number: 9,
    position: 'FWD',
    position_detail: 'Center Forward / Striker',
    role: 'Lead Striker',
    is_captain: false,
    is_vice_captain: false,
    age: 26,
    height: '189 cm',
    preferred_foot: 'Both',
    photo_url: '/forward_portrait_1790354283023.jpg',
    short_description: 'Ruthless clinical finisher capable of scoring from any angle or distance.',
    playing_style: 'A complete forward possessing elite aerial dominance, blistering acceleration off the shoulder of defenders, and a thunderous shot with either foot.',
    is_active: true,
    skills: { pace: 93, shooting: 96, passing: 78, dribbling: 87, defending: 44, physical: 91 },
    socials: {
      instagram: 'https://instagram.com/victordrake9',
      youtube: 'https://youtube.com'
    },
    videos: [
      {
        id: 'v-201',
        player_id: 'p-2',
        title: 'Hat-Trick Highlights vs Red Wolves',
        youtube_url: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
        description: 'Complete display of finishing, movement, and power.',
        category: 'GOAL',
        order_num: 1
      }
    ]
  },
  {
    id: 'p-3',
    name: 'Damian "Reaper" Vance',
    jersey_number: 4,
    position: 'DEF',
    position_detail: 'Center Back',
    role: 'Vice Captain',
    is_captain: false,
    is_vice_captain: true,
    age: 29,
    height: '193 cm',
    preferred_foot: 'Right',
    photo_url: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&w=800&q=80',
    short_description: 'Colossal defensive enforcer, unmatched in aerial duels and physical intimidation.',
    playing_style: 'A commander of the backline. Vance neutralizes counter-attacks with authoritative slide tackles, dominant aerial clearances, and vocal organizational leadership.',
    is_active: true,
    skills: { pace: 82, shooting: 54, passing: 81, dribbling: 72, defending: 95, physical: 96 },
    socials: {
      instagram: 'https://instagram.com/vance_the_reaper',
      facebook: 'https://facebook.com'
    },
    videos: [
      {
        id: 'v-301',
        player_id: 'p-3',
        title: 'Goal-Line Clearance & Dominant Defensive Highlights',
        youtube_url: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
        description: 'Vance shut down opposition top scorers with clean, authoritative tackles.',
        category: 'HIGHLIGHT',
        order_num: 1
      }
    ]
  },
  {
    id: 'p-4',
    name: 'Julian "Spectre" Cruz',
    jersey_number: 1,
    position: 'GK',
    position_detail: 'Goalkeeper',
    role: 'First Choice Goalkeeper',
    is_captain: false,
    is_vice_captain: false,
    age: 27,
    height: '195 cm',
    preferred_foot: 'Right',
    photo_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    short_description: 'Imposing shot-stopper with feline reflexes and precise distribution under pressure.',
    playing_style: 'Commands the penalty box with total authority. Renowned for spectacular fingertip saves and launching devastating counter-attacks with pinpoint 60-yard throws and kicks.',
    is_active: true,
    skills: { pace: 64, shooting: 25, passing: 82, dribbling: 48, defending: 93, physical: 90 },
    socials: {
      instagram: 'https://instagram.com/julian_spectre_cruz',
      tiktok: 'https://tiktok.com'
    },
    videos: [
      {
        id: 'v-401',
        player_id: 'p-4',
        title: 'Penalty Save & Double Reflex Stop in Derby Win',
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Spectacular heroics preserving the clean sheet.',
        category: 'SAVE',
        order_num: 1
      }
    ]
  },
  {
    id: 'p-5',
    name: 'Raheem "Mirage" Santos',
    jersey_number: 7,
    position: 'FWD',
    position_detail: 'Right Winger',
    role: 'Flank Dynamic Threat',
    is_captain: false,
    is_vice_captain: false,
    age: 23,
    height: '176 cm',
    preferred_foot: 'Left',
    photo_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    short_description: 'Blistering acceleration and ankle-breaking dribbling ability in 1v1 duels.',
    playing_style: 'Inverts from the right wing to unleash venomous curling shots with his left foot. Leaves fullbacks frozen in place with rapid stepovers and explosive changes of pace.',
    is_active: true,
    skills: { pace: 97, shooting: 86, passing: 83, dribbling: 95, defending: 38, physical: 74 },
    socials: {
      instagram: 'https://instagram.com/raheemsantos_7',
      tiktok: 'https://tiktok.com/@raheem7'
    },
    videos: [
      {
        id: 'v-501',
        player_id: 'p-5',
        title: 'Solo Run From Halfway Line vs Titan FC',
        youtube_url: 'https://www.youtube.com/watch?v=21X5lGlDOfg',
        description: 'Beating 4 defenders with pure speed and composure.',
        category: 'GOAL',
        order_num: 1
      }
    ]
  },
  {
    id: 'p-6',
    name: 'Antoine "Nocturne" Laurent',
    jersey_number: 11,
    position: 'FWD',
    position_detail: 'Left Winger',
    role: 'Inverted Forward',
    is_captain: false,
    is_vice_captain: false,
    age: 24,
    height: '180 cm',
    preferred_foot: 'Right',
    photo_url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
    short_description: 'Technical wizard with exceptional close control and clinical crossing accuracy.',
    playing_style: 'Drifts inside between defensive channels, combining with the striker and delivering low driven balls across the face of the goal with deadly frequency.',
    is_active: true,
    skills: { pace: 94, shooting: 88, passing: 87, dribbling: 92, defending: 42, physical: 77 },
    socials: {
      instagram: 'https://instagram.com/antoine_nocturne',
      youtube: 'https://youtube.com'
    },
    videos: []
  },
  {
    id: 'p-7',
    name: 'Lucas "Shadow" Moreno',
    jersey_number: 6,
    position: 'MID',
    position_detail: 'Defensive Midfielder (Anchor)',
    role: 'Midfield Engine',
    is_captain: false,
    is_vice_captain: false,
    age: 26,
    height: '184 cm',
    preferred_foot: 'Right',
    photo_url: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=80',
    short_description: 'Relentless ball-winner who intercepts threats and stabilizes the squad.',
    playing_style: 'Tireless work ethic spanning 90 minutes. Breaks up counter-attacks with laser-sharp anticipation and initiates direct forward transitions with clean passes.',
    is_active: true,
    skills: { pace: 82, shooting: 70, passing: 86, dribbling: 79, defending: 90, physical: 91 },
    socials: {
      instagram: 'https://instagram.com/lucasmoreno_6'
    },
    videos: []
  },
  {
    id: 'p-8',
    name: 'Gabriel "Spark" Sterling',
    jersey_number: 8,
    position: 'MID',
    position_detail: 'Central Midfielder (Box-to-Box)',
    role: 'First Team Engine',
    is_captain: false,
    is_vice_captain: false,
    age: 25,
    height: '182 cm',
    preferred_foot: 'Right',
    photo_url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=800&q=80',
    short_description: 'Dynamic box-to-box midfielder with endless stamina and incisive penetrative runs.',
    playing_style: 'Links defense to attack seamlessly. Known for breaking opposing press lines and arriving late in the box to convert cutbacks.',
    is_active: true,
    skills: { pace: 86, shooting: 84, passing: 89, dribbling: 87, defending: 76, physical: 85 },
    socials: {
      instagram: 'https://instagram.com/gabriel_sterling8',
      tiktok: 'https://tiktok.com'
    },
    videos: []
  },
  {
    id: 'p-9',
    name: 'Kai "Wraith" Takahashi',
    jersey_number: 2,
    position: 'DEF',
    position_detail: 'Right Back',
    role: 'Attacking Fullback',
    is_captain: false,
    is_vice_captain: false,
    age: 24,
    height: '179 cm',
    preferred_foot: 'Right',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    short_description: 'Lightning-fast modern fullback who provides overlapping width and intense pressing.',
    playing_style: 'Stamina monster who sprints box to box, shuts down opposition wingers with recovery pace, and delivers whipped crosses with pinpoint accuracy.',
    is_active: true,
    skills: { pace: 93, shooting: 65, passing: 84, dribbling: 83, defending: 86, physical: 81 },
    socials: {
      instagram: 'https://instagram.com/kai_takahashi_2'
    },
    videos: []
  },
  {
    id: 'p-10',
    name: 'Matteo "Falcon" Rossi',
    jersey_number: 3,
    position: 'DEF',
    position_detail: 'Left Back',
    role: 'Defensive Anchor Fullback',
    is_captain: false,
    is_vice_captain: false,
    age: 25,
    height: '181 cm',
    preferred_foot: 'Left',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    short_description: 'Tenacious defender with surgical sliding tackles and dangerous curled crosses.',
    playing_style: 'Tactically disciplined defender who maintains defensive shape while exploiting gaps along the touchline when GHOST FC counters.',
    is_active: true,
    skills: { pace: 89, shooting: 68, passing: 85, dribbling: 81, defending: 87, physical: 83 },
    socials: {
      instagram: 'https://instagram.com/matteorossi_3'
    },
    videos: []
  },
  {
    id: 'p-11',
    name: 'Alexander "Gargoyle" Cole',
    jersey_number: 5,
    position: 'DEF',
    position_detail: 'Center Back',
    role: 'Defensive Leader',
    is_captain: false,
    is_vice_captain: false,
    age: 28,
    height: '192 cm',
    preferred_foot: 'Left',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    short_description: 'Left-footed ball-playing center back with dominant physical presence.',
    playing_style: 'Calm under high pressing, Cole provides defensive balance with Vance, winning aerial duels and spraying diagonal switches to the wingers.',
    is_active: true,
    skills: { pace: 80, shooting: 48, passing: 84, dribbling: 73, defending: 93, physical: 94 },
    socials: {
      instagram: 'https://instagram.com/alex_cole5'
    },
    videos: []
  },
  // Bench / Substitutes
  {
    id: 'p-12',
    name: 'Leo "Shade" Sterling',
    jersey_number: 13,
    position: 'GK',
    position_detail: 'Backup Goalkeeper',
    role: 'Squad Player',
    is_captain: false,
    is_vice_captain: false,
    age: 22,
    height: '191 cm',
    preferred_foot: 'Right',
    photo_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    short_description: 'Agile young keeper with sharp reflexes and immense shot-stopping potential.',
    playing_style: 'Quick off his line and proactive in 1v1 situations.',
    is_active: true,
    skills: { pace: 60, shooting: 20, passing: 74, dribbling: 40, defending: 86, physical: 82 },
    socials: { instagram: 'https://instagram.com/leosterling13' },
    videos: []
  },
  {
    id: 'p-13',
    name: 'Noah "Bunker" Larsson',
    jersey_number: 15,
    position: 'DEF',
    position_detail: 'Center Back / Fullback',
    role: 'Substitute Defender',
    is_captain: false,
    is_vice_captain: false,
    age: 23,
    height: '188 cm',
    preferred_foot: 'Right',
    photo_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    short_description: 'Versatile defender comfortable anywhere across the back line.',
    playing_style: 'Physical and aggressive marking style.',
    is_active: true,
    skills: { pace: 81, shooting: 45, passing: 78, dribbling: 70, defending: 85, physical: 87 },
    socials: {},
    videos: []
  },
  {
    id: 'p-14',
    name: 'Jax "Echo" Mercer',
    jersey_number: 14,
    position: 'MID',
    position_detail: 'Central Midfielder',
    role: 'Impact Midfielder',
    is_captain: false,
    is_vice_captain: false,
    age: 21,
    height: '180 cm',
    preferred_foot: 'Both',
    photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    short_description: 'Energetic young playmaker with crisp one-touch passing.',
    playing_style: 'Injects tempo and fresh energy into the midfield during late stages of matches.',
    is_active: true,
    skills: { pace: 84, shooting: 78, passing: 85, dribbling: 86, defending: 68, physical: 76 },
    socials: { instagram: 'https://instagram.com/jax_mercer' },
    videos: []
  },
  {
    id: 'p-15',
    name: 'Carlos "Ghostblade" Vega',
    jersey_number: 19,
    position: 'FWD',
    position_detail: 'Striker / Winger',
    role: 'Super Sub Forward',
    is_captain: false,
    is_vice_captain: false,
    age: 22,
    height: '183 cm',
    preferred_foot: 'Right',
    photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    short_description: 'Explosive forward with raw power and rapid turn of pace.',
    playing_style: 'Punishes tired defenses in the final 20 minutes with direct dribbling and powerful strikes.',
    is_active: true,
    skills: { pace: 93, shooting: 86, passing: 75, dribbling: 87, defending: 35, physical: 84 },
    socials: { instagram: 'https://instagram.com/vega_ghostblade' },
    videos: []
  }
];

export const INITIAL_LINEUP: LineupConfig = {
  formation: '4-3-3',
  starting_xi: {
    GK: 'p-4',    // Julian Cruz
    RB: 'p-9',    // Kai Takahashi
    CB1: 'p-3',   // Damian Vance
    CB2: 'p-11',  // Alexander Cole
    LB: 'p-10',   // Matteo Rossi
    CDM: 'p-7',   // Lucas Moreno
    CM1: 'p-8',   // Gabriel Sterling
    CAM: 'p-1',   // Marco Silva (C)
    RW: 'p-5',    // Raheem Santos
    ST: 'p-2',    // Victor Drake
    LW: 'p-6',    // Antoine Laurent
  },
  substitutes: ['p-12', 'p-13', 'p-14', 'p-15'],
};

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'm-1',
    opponent: 'Valkyrie FC',
    opponent_logo_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=150&q=80',
    date: '2026-09-28',
    time: '20:00',
    venue: 'The Crypt Arena (Home)',
    competition: 'Premier Champions Cup',
    is_home: true,
    ghost_score: null,
    opponent_score: null,
    status: 'Upcoming',
    round_info: 'Group Stage - Matchday 5'
  },
  {
    id: 'm-2',
    opponent: 'Iron City FC',
    opponent_logo_url: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&w=150&q=80',
    date: '2026-10-04',
    time: '19:45',
    venue: 'Ironworks Stadium (Away)',
    competition: 'Elite Super League',
    is_home: false,
    ghost_score: null,
    opponent_score: null,
    status: 'Upcoming',
    round_info: 'Round 16'
  },
  {
    id: 'm-3',
    opponent: 'Shadow United',
    opponent_logo_url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=150&q=80',
    date: '2026-10-12',
    time: '20:30',
    venue: 'The Crypt Arena (Home)',
    competition: 'National Cup',
    is_home: true,
    ghost_score: null,
    opponent_score: null,
    status: 'Upcoming',
    round_info: 'Quarter-Final'
  },
  {
    id: 'm-4',
    opponent: 'Red Wolves SC',
    opponent_logo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    date: '2026-09-18',
    time: '20:00',
    venue: 'The Crypt Arena (Home)',
    competition: 'Elite Super League',
    is_home: true,
    ghost_score: 3,
    opponent_score: 0,
    status: 'Completed',
    round_info: 'Round 15'
  },
  {
    id: 'm-5',
    opponent: 'Titan FC',
    opponent_logo_url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=150&q=80',
    date: '2026-09-12',
    time: '18:30',
    venue: 'Titan Colosseum (Away)',
    competition: 'Premier Champions Cup',
    is_home: false,
    ghost_score: 2,
    opponent_score: 1,
    status: 'Completed',
    round_info: 'Group Stage - Matchday 4'
  },
  {
    id: 'm-6',
    opponent: 'Viper SC',
    opponent_logo_url: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=150&q=80',
    date: '2026-09-05',
    time: '19:00',
    venue: 'The Crypt Arena (Home)',
    competition: 'Elite Super League',
    is_home: true,
    ghost_score: 4,
    opponent_score: 1,
    status: 'Completed',
    round_info: 'Round 14'
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'GHOST FC Prepares for Crucial European Clash at The Crypt',
    slug: 'ghost-fc-prepares-for-crucial-european-clash',
    short_description: 'Captain Marco Silva and head coach unveil the tactical blueprint ahead of Monday night showdown with Valkyrie FC.',
    content: `Under the floodlights of The Crypt Arena, GHOST FC held their final tactical training session with total intensity. With both sides battling for the top seed in Group A of the Premier Champions Cup, the stage is set for a high-octane encounter.\n\n"We don't play to participate; we play to conquer," stated captain Marco Silva in the pre-match press conference. "Every player knows their role. When that whistle blows, our supporters will feel the stadium shake."\n\nStriker Victor Drake looks poised to return to the starting XI after resting during the weekend league fixture, giving GHOST FC their full attacking complement.`,
    image_url: '/stadium_atmosphere_1790354254462.jpg',
    category: 'MATCH PREVIEW',
    published_date: '2026-09-24',
    is_published: true,
    author: 'Club Media Team'
  },
  {
    id: 'news-2',
    title: 'Victor Drake Named Player of the Month After 6-Goal Blitz',
    slug: 'victor-drake-player-of-the-month',
    short_description: 'Number 9 striker bags the award following a relentless streak of match-winning strikes across all competitions.',
    content: `Victor Drake has been officially crowned Player of the Month following a peerless run of form in September. With 6 goals in 4 matches, including a sensational hat-trick against Red Wolves SC, the striker has proved unstoppable.\n\n"Individual honors reflect the squad's collective work ethic," Drake commented. "My teammates put the ball in dangerous areas, and I execute."`,
    image_url: '/forward_portrait_1790354283023.jpg',
    category: 'AWARDS',
    published_date: '2026-09-20',
    is_published: true,
    author: 'Editorial Desk'
  },
  {
    id: 'news-3',
    title: 'Tactical Analysis: How GHOST FC Mastered the Relentless Press',
    slug: 'tactical-analysis-ghost-fc-high-press',
    short_description: 'An in-depth breakdown of the high-intensity defensive structure that has produced four consecutive clean sheets.',
    content: `Statistics from the recent stretch highlight why GHOST FC boast the stingiest defense in the division. Led by vice captain Damian Vance and defensive midfielder Lucas Moreno, the team averages 18.4 ball recoveries in the opponent's defensive third per 90 minutes.\n\nBy suffocating passing lanes and funneling opposition build-ups toward physical bottlenecks, the squad forces turnovers and launches rapid, lethal counter-thrusts within 4.2 seconds.`,
    image_url: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&w=1200&q=80',
    category: 'TACTICAL FOCUS',
    published_date: '2026-09-15',
    is_published: true,
    author: 'Tactics Room'
  }
];
