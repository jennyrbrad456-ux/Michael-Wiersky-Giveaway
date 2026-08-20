import React, { useState } from 'react';
import { PrizeTier } from '../types';
import { PREFERRED_CLAIM_TIERS } from '../constants';

interface PreferClaimSectionProps {
  onSelectTier: (tier: PrizeTier, autoProceed?: boolean) => void;
  selectedTierId?: number | null;
}

export const PreferClaimSection: React.FC<PreferClaimSectionProps> = ({
  onSelectTier,
  selectedTierId,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'ENTRY' | 'VIP'>('ALL');

  const filteredTiers = PREFERRED_CLAIM_TIERS.filter((tier) => {
    if (filter === 'ENTRY') return tier.entryFee <= 500;
    if (filter === 'VIP') return tier.entryFee > 500;
    return true;
  });

  return (
    <section className="w-full max-w-7xl mx-auto py-12 px-4" id="prefer-claim-section">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest mb-3">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
          Official Prefer Claim Schedule
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Prefer Claim Tiers & Guaranteed Payouts
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Lock in your preferred ticket tier below. Every ticket is backed by the Michael Wiersky verified distribution pool with direct multi-tier returns.
        </p>
      </div>

      {/* Filter Tabs & Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'ALL'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            All Prefer Claims (13)
          </button>
          <button
            onClick={() => setFilter('ENTRY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'ENTRY'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Starter & Mid ($50 - $500)
          </button>
          <button
            onClick={() => setFilter('VIP')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'VIP'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            High Roller ($1,000 - $10,000)
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            100% Guaranteed Payouts
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-blue-400 font-bold">Up to 100x Value</span>
        </div>
      </div>

      {/* Desktop/Tablet Table View */}
      <div className="hidden md:block overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl shadow-2xl mb-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-black uppercase tracking-widest text-slate-400">
              <th className="py-4 px-6">Ticket Level</th>
              <th className="py-4 px-6">Prefer Ticket Fee</th>
              <th className="py-4 px-6">Guaranteed Claim Reward</th>
              <th className="py-4 px-6">Multiplier Return</th>
              <th className="py-4 px-6">Status / Tier</th>
              <th className="py-4 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-sm">
            {filteredTiers.map((tier) => {
              const isSelected = selectedTierId === tier.id;
              const multiplier = Math.round((tier.reward / tier.entryFee) * 10) / 10;
              const isHighRoller = tier.entryFee >= 1000;

              return (
                <tr
                  key={tier.id}
                  onClick={() => onSelectTier(tier, false)}
                  className={`cursor-pointer transition-colors duration-200 group ${
                    isSelected
                      ? 'bg-blue-600/20 text-white'
                      : 'hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <td className="py-4 px-6 font-sans font-bold flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                        isSelected
                          ? 'bg-blue-500 text-white'
                          : isHighRoller
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tier.id}
                    </span>
                    <span className="font-semibold text-slate-200">
                      ${tier.entryFee} Ticket
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <span className="font-extrabold text-white text-base">
                      ${tier.entryFee.toLocaleString()}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-lg text-emerald-400 group-hover:text-emerald-300 transition-colors">
                        ${tier.reward.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold ${
                        multiplier >= 100
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {multiplier}X Return
                    </span>
                  </td>

                  <td className="py-4 px-6 font-sans">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        tier.popularity === 'Most Popular'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : tier.popularity === 'Ultimate'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-slate-800/80 text-slate-400'
                      }`}
                    >
                      {tier.popularity || 'Verified'}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right font-sans">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTier(tier, true);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-slate-800 group-hover:bg-blue-600 text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Claim Now'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden mb-8">
        {filteredTiers.map((tier) => {
          const isSelected = selectedTierId === tier.id;
          const multiplier = Math.round((tier.reward / tier.entryFee) * 10) / 10;

          return (
            <div
              key={tier.id}
              onClick={() => onSelectTier(tier, false)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                  ${tier.entryFee} Ticket
                </span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {multiplier}X Return
                </span>
              </div>

              <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                Guaranteed Payout
              </p>
              <p className="text-2xl font-black text-white tracking-tight my-1">
                ${tier.reward.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  {tier.popularity || 'Standard Tier'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTier(tier, true);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Claim'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
