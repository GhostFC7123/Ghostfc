import React, { useEffect, useState } from 'react';
import { clubService } from '../services/clubService';
import { TeamSettings } from '../types';
import { GhostLogo } from '../components/common/GhostLogo';
import { Shield, Trophy, MapPin, Award, Target, Flame, Users, Calendar, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [settings, setSettings] = useState<TeamSettings | null>(null);

  useEffect(() => {
    async function load() {
      const s = await clubService.getTeamSettings();
      setSettings(s);
    }
    load();
    window.scrollTo(0, 0);
  }, []);

  const ground = settings?.home_ground || 'The Crypt Arena';
  const founded = settings?.founded_year || 2024;
  const tagline = settings?.tagline || 'BORN TO DOMINATE.';

  const values = [
    {
      title: 'SHADOW PRECISION',
      desc: 'Tactical discipline engineered to exploit microscopic defensive fractures in opponent setups.',
      icon: Target
    },
    {
      title: 'RELENTLESS INTENSITY',
      desc: 'Suffocating defensive pressure from the first whistle to the 95th minute with zero compromise.',
      icon: Flame
    },
    {
      title: 'FEARLESS AMBITION',
      desc: 'Entering every tournament, pitch, and duel with single-minded focus on winning trophies.',
      icon: Trophy
    },
    {
      title: 'UNBREAKABLE UNITY',
      desc: 'From the coaching staff to the supporters in the grandstand, a collective singular force.',
      icon: Users
    }
  ];

  const colors = [
    { name: 'OBSIDIAN BLACK', hex: '#050507', role: 'Primary Atmosphere & Kit Base' },
    { name: 'CRIMSON RED', hex: '#E50914', role: 'Accent Power, Passion & Energy' },
    { name: 'OPTIC WHITE', hex: '#FFFFFF', role: 'Typography & Structural Contrast' },
    { name: 'CARBON GRAY', hex: '#1C202C', role: 'Secondary Surfaces & Tactile Borders' },
  ];

  return (
    <div className="min-h-screen bg-[#050507] text-[#F0F1F5] pt-24 pb-28">
      {/* Header Banner */}
      <section className="relative py-16 sm:py-24 bg-[#08090C] border-b border-[#181B24] overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E50914]/12 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute inset-0 bg-carbon-mesh opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-[#E50914] uppercase tracking-widest font-bold">
                <Shield className="w-4 h-4" />
                FOUNDED {founded} · LONDON / GLOBAL · FIRST TIER
              </div>
              <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-wide">
                ABOUT GHOST FC
              </h1>
              <p className="font-teko text-2xl sm:text-3xl text-[#E50914] font-bold tracking-[0.2em] uppercase">
                "{tagline}"
              </p>
              <p className="text-sm sm:text-base text-[#9A9EB0] leading-relaxed">
                {settings?.club_description ||
                  'GHOST FC was established as a cutting-edge modern football club blending supreme athletic conditioning with aggressive tactical dominance. We compete with honor, play with relentless intensity, and leave an indelible mark on football history.'}
              </p>
            </div>

            {/* Crest Presentation Card */}
            <div className="p-8 sm:p-10 bg-[#0C0E14] border-2 border-[#222736] shadow-2xl flex flex-col items-center text-center max-w-sm w-full card-rim">
              <GhostLogo size="xl" showText={false} />
              <h3 className="font-heading text-2xl font-black text-white mt-5 tracking-wider">
                THE PHANTOM CREST
              </h3>
              <p className="text-xs text-[#8E93A3] mt-2 leading-relaxed">
                The hooded crowned phantom inside the battle shield embodies stealth, authority, and tactical inevitability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Crest Anatomy Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono text-[#E50914] uppercase tracking-widest block font-bold">
            VISUAL ANATOMY
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-white tracking-wide">
            THE ANATOMY OF OUR CREST
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          <div className="p-6 bg-[#0C0E14] border border-[#1E222E] card-rim">
            <div className="w-10 h-10 rounded bg-[#141620] border border-[#262B3A] flex items-center justify-center text-[#E50914] mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-heading text-lg font-black text-white uppercase tracking-wider mb-2">
              THE THREE-POINTED CROWN
            </h4>
            <p className="text-xs sm:text-sm text-[#8E93A3] leading-relaxed">
              Symbolizes our quest for trophies across League, Cup, and European competition. An emblem of sovereign football excellence.
            </p>
          </div>

          <div className="p-6 bg-[#0C0E14] border border-[#1E222E] card-rim">
            <div className="w-10 h-10 rounded bg-[#141620] border border-[#262B3A] flex items-center justify-center text-[#E50914] mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-heading text-lg font-black text-white uppercase tracking-wider mb-2">
              THE SHIELD OF FORTRESS
            </h4>
            <p className="text-xs sm:text-sm text-[#8E93A3] leading-relaxed">
              Represents an impregnable backline and physical defensive solidarity that frustrates opposing attacking units.
            </p>
          </div>

          <div className="p-6 bg-[#0C0E14] border border-[#1E222E] card-rim">
            <div className="w-10 h-10 rounded bg-[#141620] border border-[#262B3A] flex items-center justify-center text-[#E50914] mb-4">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="font-heading text-lg font-black text-white uppercase tracking-wider mb-2">
              GLOWING CRIMSON EYES
            </h4>
            <p className="text-xs sm:text-sm text-[#8E93A3] leading-relaxed">
              Focus, predatory vision, and supernatural concentration on the ball. Unfazed by roaring opposition stadiums.
            </p>
          </div>
        </div>
      </section>

      {/* Official Brand Palette */}
      <section className="bg-[#08090C] border-y border-[#181B24] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-left">
            <span className="text-xs font-mono text-[#E50914] uppercase tracking-widest block mb-1 font-bold">
              OFFICIAL LIVERY
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-white tracking-wide">
              CLUB COLOR SYSTEM
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {colors.map((color) => (
              <div key={color.name} className="p-5 bg-[#0C0E14] border border-[#1E222E] space-y-3 card-rim">
                <div
                  className="w-full h-16 rounded-none border border-white/10 shadow-inner"
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <h4 className="font-heading text-base font-black text-white tracking-wider">
                    {color.name}
                  </h4>
                  <div className="font-mono text-xs text-[#E50914] font-bold">{color.hex}</div>
                  <p className="text-xs text-[#8E93A3] mt-1">{color.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Home Fortress */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center bg-[#0C0E14] border border-[#202432] p-6 sm:p-10 shadow-2xl card-rim">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#E50914] uppercase font-bold">
              <MapPin className="w-4 h-4" />
              HOME STADIUM & GROUNDS
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide">
              {ground}
            </h2>
            <p className="text-xs sm:text-sm text-[#9A9EB0] leading-relaxed">
              Featuring an advanced hybrid turf system, state-of-the-art sensory floodlighting arrays, and intense acoustic containment, {ground} creates one of football’s most intimidating environments for visiting squads.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-[#101217] border border-[#222634]">
                <span className="text-[10px] font-mono text-[#585D6E] uppercase block font-bold">CAPACITY</span>
                <span className="font-heading text-xl font-black text-white">52,400</span>
              </div>
              <div className="p-3 bg-[#101217] border border-[#222634]">
                <span className="text-[10px] font-mono text-[#585D6E] uppercase block font-bold">SURFACE</span>
                <span className="font-heading text-xl font-black text-white">Hybrid Turf</span>
              </div>
              <div className="p-3 bg-[#101217] border border-[#222634]">
                <span className="text-[10px] font-mono text-[#585D6E] uppercase block font-bold">ATMOSPHERE</span>
                <span className="font-heading text-xl font-black text-[#E50914]">94 dB Avg</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 aspect-[4/3] overflow-hidden border border-[#2A2F3E] card-rim">
            <img
              src="/stadium_atmosphere_1790354254462.jpg"
              alt="The Crypt Arena"
              className="w-full h-full object-cover filter contrast-125 hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Core Values / Creed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono text-[#E50914] uppercase tracking-widest block font-bold">
            THE CODE
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-white tracking-wide">
            THE GHOST FC CREED
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="p-6 bg-[#0C0E14] border border-[#1E222E] space-y-3 card-rim">
                <Icon className="w-6 h-6 text-[#E50914]" />
                <h4 className="font-heading text-base font-black text-white tracking-wider">
                  {v.title}
                </h4>
                <p className="text-xs text-[#8E93A3] leading-relaxed">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
