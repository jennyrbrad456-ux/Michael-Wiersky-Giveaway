
import React, { useState } from 'react';
import { PrizeTier } from '../types';

interface PrizeCardProps {
  tier: PrizeTier;
  isSelected: boolean;
  onSelect: (tier: PrizeTier) => void;
}

export const PrizeCard: React.FC<PrizeCardProps> = ({ tier, isSelected, onSelect }) => {
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);
  const isMostPopular = tier.popularity === 'Most Popular';
  const multiplier = Math.round((tier.reward / tier.entryFee) * 10) / 10;

  const getTooltipContent = (popularity?: string) => {
    switch (popularity) {
      case 'Most Popular':
        return 'Highest participation rate: $1,000 ticket for guaranteed $100,000.00 payout (100x return).';
      case 'Popular':
        return 'High demand tier: $500 ticket for guaranteed $50,000.00 payout.';
      case 'Starter':
        return 'Accessible starter ticket: $50 ticket to claim $5,000.00 guaranteed prize.';
      case 'Common':
        return '$100 ticket to receive $10,000.00 in verified funds.';
      case 'Bronze':
        return '$150 ticket claiming $15,000.00 payout.';
      case 'Silver':
        return '$200 ticket claiming $20,000.00 payout.';
      case 'Gold':
        return '$300 ticket claiming $30,000.00 payout.';
      case 'Platinum':
        return '$400 ticket claiming $40,000.00 payout.';
      case 'Diamond':
        return 'Premium claim: $1,500 ticket claiming $150,000.00 payout.';
      case 'High Roller':
        return 'High Roller tier: $2,000 ticket claiming $200,000.00 payout.';
      case 'Elite':
        return 'Elite tier: $3,000 ticket claiming $250,000.00 payout.';
      case 'VIP Master':
        return 'VIP tier: $5,000 ticket claiming $350,000.00 payout.';
      case 'Ultimate':
        return 'Max tier: $10,000 ticket claiming $420,000.00 payout.';
      default:
        return 'Verified prefer claim tier in the Michael Wiersky Giveaway distribution system.';
    }
  };

  const handleSelect = () => {
    onSelect(tier);
  };

  const handleCopyDetails = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const details = `Michael Wiersky Giveaway - Prefer Claim: $${tier.entryFee.toLocaleString()} ticket get $${tier.reward.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    try {
      await navigator.clipboard.writeText(details);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: 'Michael Wiersky Giveaway Program',
      text: `🚀 I'm claiming my $${tier.reward.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} reward with a $${tier.entryFee.toLocaleString()} ticket in the Michael Wiersky Prefer Claim Program!`,
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareFeedback('Shared!');
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setShareFeedback('Link Copied!');
      }
      
      setTimeout(() => {
        setShareFeedback(null);
      }, 3000);
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div
      onClick={handleSelect}
      role="button"
      aria-pressed={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect();
        }
      }}
      className={`relative group p-6 rounded-2xl border transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] text-left overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-400 active:scale-[0.96] ${
        isSelected 
          ? 'bg-blue-600 border-blue-300 shadow-[0_0_50px_rgba(37,99,235,0.6),inset_0_0_20px_rgba(255,255,255,0.2)] scale-[1.05] z-10' 
          : isMostPopular
            ? 'bg-slate-800/80 border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.1)] hover:border-amber-400 hover:scale-[1.04] hover:shadow-[0_0_40px_rgba(245,158,11,0.25)]'
            : 'bg-slate-800/50 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/80 hover:scale-[1.04] hover:shadow-[0_0_35px_rgba(37,99,235,0.2)]'
      }`}
    >
      {/* Dynamic Background Patterns */}
      <div className={`absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full blur-3xl transition-opacity duration-700 ${isSelected ? 'bg-white/20 opacity-100' : 'bg-blue-500/10 opacity-0 group-hover:opacity-100'}`} />

      {/* Selected State Shimmer */}
      {isSelected && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/10 to-transparent" />
          <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-[35deg] animate-[shimmer_2s_infinite] transition-transform" 
               style={{
                 backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                 animation: 'shimmer 2.5s infinite linear'
               }}
          />
        </div>
      )}

      {/* Animated Floating Badge for Most Popular */}
      {isMostPopular && (
        <div className={`absolute top-3 left-3 z-30 transition-transform duration-500 ${isSelected ? 'scale-110 translate-y-[-2px]' : 'group-hover:translate-y-[-4px]'}`}>
          <div className="relative">
            <div className={`absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-20 scale-150 duration-1000 ${isSelected ? 'hidden' : ''}`} />
            <div className={`relative bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-amber-950 text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 uppercase tracking-tighter ring-1 ring-amber-400/50 shadow-amber-500/30`}>
              <span className="text-xs animate-bounce" style={{ animationDuration: '2s' }}>⚡</span>
              Best Value
            </div>
          </div>
        </div>
      )}

      {/* Interactive Tooltip Section */}
      {tier.popularity && (
        <div className="absolute top-0 right-0 z-20 group/tooltip" onClick={(e) => e.stopPropagation()}>
          <span className={`inline-block px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-bl-xl cursor-help transition-all duration-300 ${
            isSelected 
              ? 'bg-white/30 text-white backdrop-blur-md' 
              : isMostPopular 
                ? 'bg-amber-500 text-amber-950 shadow-[0_4px_10px_rgba(245,158,11,0.3)]' 
                : 'bg-blue-600/30 text-blue-300 group-hover/tooltip:bg-blue-500 group-hover/tooltip:text-white'
          }`}>
            {tier.popularity}
          </span>
          
          <div className="absolute top-full right-2 mt-2 w-64 p-4 bg-slate-900/95 backdrop-blur-xl text-[11px] leading-relaxed text-slate-300 rounded-2xl border border-slate-700/50 shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 transform translate-y-2 group-hover/tooltip:translate-y-0 z-50 pointer-events-none">
            <div className="absolute -top-1 right-5 w-3 h-3 bg-slate-900 border-t border-l border-slate-700/50 rotate-45" />
            <div className="flex items-center gap-2.5 mb-2">
               <div className={`w-2 h-2 rounded-full ${isMostPopular ? 'bg-amber-400 animate-pulse' : 'bg-blue-400'}`}></div>
               <p className={`font-black uppercase tracking-widest ${isMostPopular ? 'text-amber-400' : 'text-blue-400'}`}>
                 {tier.popularity} Insights
               </p>
            </div>
            <p className="font-medium text-slate-400">
              {getTooltipContent(tier.popularity)}
            </p>
          </div>
        </div>
      )}
      
      {/* Content Section */}
      <div className={`relative z-10 flex flex-col gap-1 transition-all duration-500 ${isMostPopular ? 'pt-10' : ''} ${isSelected ? 'translate-x-1' : 'group-hover:translate-x-2'}`}>
        <div className="flex items-center justify-between">
          <p className={`text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
            Prefer Claim Ticket
          </p>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
            ${tier.entryFee} Ticket
          </span>
        </div>
        <p className={`text-3xl font-black tracking-tight transition-all duration-500 origin-left ${isSelected ? 'text-white scale-105' : 'text-slate-100 group-hover:text-white group-hover:scale-105'}`}>
          ${tier.entryFee.toLocaleString()}
        </p>
      </div>

      <div className={`relative z-10 my-5 h-px w-full transition-all duration-700 ${
        isSelected 
          ? 'bg-white/30 scale-x-105' 
          : isMostPopular ? 'bg-amber-500/20 group-hover:bg-amber-500/50 group-hover:scale-x-105' : 'bg-slate-700 group-hover:bg-blue-500/30 group-hover:scale-x-105'
      }`} />

      <div className={`relative z-10 flex flex-col gap-1 pr-10 transition-all duration-500 ${isSelected ? 'translate-x-1' : 'group-hover:translate-x-2'}`}>
        <p className={`text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
          Guaranteed Claim Value
        </p>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <p className={`text-3xl sm:text-4xl font-black tracking-tighter transition-all duration-500 origin-left ${
            isSelected 
              ? 'text-white drop-shadow-lg scale-105' 
              : isMostPopular ? 'text-amber-400 group-hover:scale-105 origin-left' : 'text-blue-400 group-hover:text-blue-300 group-hover:scale-105 origin-left'
          }`}>
            ${tier.reward.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded transition-opacity duration-500 ${isSelected ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
            {multiplier}X Multiplier
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className={`relative z-10 mt-8 flex items-center justify-between transition-all duration-300 ${isSelected ? 'translate-y-0' : 'translate-y-1 group-hover:translate-y-0'}`}>
        <div className={`inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
          isSelected 
            ? 'text-white' 
            : isMostPopular ? 'text-amber-400' : 'text-blue-400'
        }`}>
          <span className="relative py-1">
            {isSelected ? 'Active Selection' : 'Unlock This Tier'}
            <div className={`absolute bottom-0 left-0 w-full h-0.5 transition-transform duration-500 origin-left ${
              isSelected ? 'bg-white scale-x-100' : 'bg-current scale-x-0 group-hover:scale-x-100'
            }`} />
          </span>
          <svg className={`w-4 h-4 transition-transform duration-500 ${isSelected ? 'animate-[bounceX_1s_infinite]' : 'group-hover:translate-x-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={isSelected ? "M5 13l4 4L19 7" : "M13 7l5 5m0 0l-5 5m5-5H6"} />
          </svg>
        </div>

        {/* Buttons Group */}
        <div className="flex items-center gap-2 relative">
          {/* Copy Button */}
          <div className="flex flex-col items-center">
            {copyFeedback && (
              <div className="absolute bottom-full mb-3 px-3 py-1.5 bg-blue-500 text-white text-[10px] font-black rounded-xl whitespace-nowrap animate-[springUp_0.4s_ease-out] shadow-xl shadow-blue-500/30">
                Details Copied!
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-blue-500" />
              </div>
            )}
            <button
              onClick={handleCopyDetails}
              title="Copy Prize Details"
              className={`p-2.5 rounded-2xl transition-all duration-300 ${
                isSelected 
                  ? 'bg-white/20 text-white hover:bg-white/40 ring-1 ring-white/30' 
                  : 'bg-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-600 ring-1 ring-slate-600/50'
              } backdrop-blur-md hover:scale-110 active:scale-90 shadow-lg`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </button>
          </div>

          {/* Share Button */}
          <div className="flex flex-col items-center">
            {shareFeedback && (
              <div className="absolute bottom-full mb-3 px-3 py-1.5 bg-green-500 text-white text-[10px] font-black rounded-xl whitespace-nowrap animate-[springUp_0.4s_ease-out] shadow-xl shadow-green-500/30">
                {shareFeedback}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-green-500" />
              </div>
            )}
            <button
              onClick={handleShare}
              className={`p-2.5 rounded-2xl transition-all duration-300 ${
                isSelected 
                  ? 'bg-white/20 text-white hover:bg-white/40 ring-1 ring-white/30' 
                  : 'bg-slate-700/50 text-slate-300 hover:text-white hover:bg-blue-600 ring-1 ring-slate-600/50 hover:ring-blue-400'
              } backdrop-blur-md hover:scale-110 active:scale-90 shadow-lg`}
            >
              {shareFeedback ? (
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                 </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) rotate(35deg); }
          100% { transform: translateX(150%) rotate(35deg); }
        }
        @keyframes bounceX {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        @keyframes springUp {
          0% { transform: translateY(10px) scale(0.8); opacity: 0; }
          70% { transform: translateY(-2px) scale(1.05); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
