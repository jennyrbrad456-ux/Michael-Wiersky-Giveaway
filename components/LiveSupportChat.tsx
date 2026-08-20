import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  Headphones,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronDown,
  ArrowRight,
  HelpCircle,
  Clock,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { AppStep, PrizeTier } from '../types';

interface Message {
  id: string;
  sender: 'agent' | 'user' | 'system';
  text: string;
  timestamp: string;
  action?: {
    label: string;
    targetStep: AppStep;
  };
  quickSuggestions?: string[];
}

interface LiveSupportChatProps {
  currentStep: AppStep;
  selectedTier: PrizeTier | null;
  onNavigateToStep: (step: AppStep) => void;
}

const PRESET_TOPICS = [
  {
    topic: 'How to claim',
    label: '🎁 How do I claim my reward?',
    keywords: ['how', 'claim', 'start', 'begin', 'process', 'steps'],
    response: (tier: PrizeTier | null) =>
      `Claiming is simple and automated in 4 steps:\n` +
      `1. **Select a Prize Tier** (from $5,000 up to $500,000 guaranteed payout).\n` +
      `2. **Enter Claimant Details** (name, email, Cash App tag, or crypto wallet address).\n` +
      `3. **Submit Entry Ticket Fee** via Crypto (BTC, USDT, ETH, BNB) or Gift Card (Apple, Steam, Razer Gold).\n` +
      `4. **Upload Proof of Settlement** to initiate automated verification & instant payout!`,
    action: { label: 'Go to Prize Selection', targetStep: AppStep.SELECTION },
    followUps: ['What payment methods are supported?', 'How long does verification take?'],
  },
  {
    topic: 'Payment methods',
    label: '💳 What payment methods are accepted?',
    keywords: ['payment', 'method', 'methods', 'crypto', 'gift', 'card', 'btc', 'usdt', 'apple', 'steam', 'razer', 'pay', 'deposit'],
    response: () =>
      `We support multiple instant settlement methods:\n\n` +
      `• **Cryptocurrency (Recommended)**: Bitcoin (BTC), USDT (BEP-20, TRC-20, ERC-20), Ethereum (ETH), BNB Chain.\n` +
      `• **Prepaid Gift Cards**: Apple Gift Card, Steam Wallet, Razer Gold, Vanilla Visa/Mastercard.\n\n` +
      `All transactions are recorded directly in the audited ledger with 0% processing fees for claimants.`,
    action: { label: 'Go to Deposit & Payment Form', targetStep: AppStep.PAYMENT },
    followUps: ['How do I upload my receipt?', 'Why is a ticket fee required?'],
  },
  {
    topic: 'Ticket fee explanation',
    label: '🎟️ Why is there an entry ticket fee?',
    keywords: ['fee', 'ticket', 'cost', 'why pay', 'charge', 'money', 'entry'],
    response: (tier: PrizeTier | null) =>
      `The ticket fee (starting at $50 for a $5,000 guaranteed payout) serves two critical functions:\n\n` +
      `1. **Sybil & Bot Protection**: Prevents automated scripts from draining the Michael Wiersky $273M escrow fund.\n` +
      `2. **Audited Blockchain Settlement**: Funds the cryptographic smart-contract gas and reserve allocation on the public ledger.\n\n` +
      `Every verified claimant receives their full multiplier reward upon instant receipt clearance.`,
    action: { label: 'Select Tier & View Multipliers', targetStep: AppStep.SELECTION },
    followUps: ['How long does verification take?', 'Is my receipt uploaded securely?'],
  },
  {
    topic: 'Verification time',
    label: '⏱️ How long does payout verification take?',
    keywords: ['time', 'how long', 'duration', 'fast', 'instant', 'wait', 'speed', 'when'],
    response: () =>
      `Verification is ultra-fast:\n\n` +
      `• **Automated Mempool & Optical Check**: Typically takes **30 to 90 seconds** after receipt upload.\n` +
      `• **Payout Disbursement**: Initiated immediately to your designated Cash App tag or crypto wallet upon ledger confirmation.\n\n` +
      `You can track real-time progress on the Live System Log screen!`,
    action: { label: 'Check Payment Form', targetStep: AppStep.PAYMENT },
    followUps: ['How do I upload my receipt?', 'What if my gift card PIN has an issue?'],
  },
  {
    topic: 'Receipt upload',
    label: '📸 How do I upload my receipt/proof?',
    keywords: ['receipt', 'upload', 'file', 'image', 'proof', 'screenshot', 'photo', 'hash', 'txid'],
    response: () =>
      `Receipt upload is **COMPULSORY** for automated ledger validation:\n\n` +
      `• **For Cryptocurrency**: Upload your transaction screenshot showing TxID/Hash, destination wallet, and sent amount.\n` +
      `• **For Gift Cards**: Upload a photo of the **physical gift card (front & scratched PIN back)** AND the **retail purchase receipt**.\n\n` +
      `Drag & drop or browse your file (JPG, PNG, PDF) on the form, then click submit to verify your claim.`,
    action: { label: 'Open Payment Section', targetStep: AppStep.PAYMENT },
    followUps: ['What if my gift card PIN has an issue?', 'Is my receipt uploaded securely?'],
  },
  {
    topic: 'Gift card pin issue',
    label: '⚠️ Gift Card Code / PIN troubleshooting',
    keywords: ['pin', 'code', 'error', 'invalid', 'card error', 'redeem', 'failed', 'problem'],
    response: () =>
      `If you experience an issue with your Gift Card Code:\n\n` +
      `• Double check all characters (avoid confusing '0' and 'O', or '1' and 'I').\n` +
      `• Ensure the physical card was fully activated at the retail register.\n` +
      `• Upload a clear photo of the back of the card showing the card number and scratched PIN.\n` +
      `• Our ledger administration team will manually verify and release your disbursement if auto-validation needs manual review.`,
    action: { label: 'Submit Card in Payment Form', targetStep: AppStep.PAYMENT },
    followUps: ['What payment methods are accepted?', 'How long does verification take?'],
  },
  {
    topic: 'Legitimacy & Escrow',
    label: '🔒 Is this verified and authentic?',
    keywords: ['real', 'legit', 'scam', 'authentic', 'michael', 'wiersky', 'lottery', 'trust', 'safe', 'secure'],
    response: () =>
      `Yes! This giveaway is directly authorized from the **Michael Wiersky NJ Mega Millions $273,000,000 Philanthropic Trust Fund**.\n\n` +
      `• Regulated reserve distribution.\n` +
      `• Transparent SHA-256 ledger transactions visible in real-time.\n` +
      `• Over $14,800,000+ already disbursed to verified applicants worldwide.`,
    action: { label: 'View Available Reward Tiers', targetStep: AppStep.SELECTION },
    followUps: ['How do I claim my reward?', 'Why is there an entry ticket fee?'],
  },
];

export const LiveSupportChat: React.FC<LiveSupportChatProps> = ({
  currentStep,
  selectedTier,
  onNavigateToStep,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initialWelcomeText = selectedTier
    ? `👋 Hello! I am Officer Sarah from the Michael Wiersky Verification Desk. I see you are claiming the **${selectedTier.name} ($${selectedTier.reward.toLocaleString()} Payout)**! How can I assist with your ticket or payout today?`
    : `👋 Hello! Welcome to the 24/7 Michael Wiersky Live Support Center. I am Officer Sarah. How can I assist you with your prize claim, payment options, or verification today?`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome-1',
      sender: 'agent',
      text: initialWelcomeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickSuggestions: [
        'How do I claim my reward?',
        'What payment methods are accepted?',
        'How long does verification take?',
        'Is this verified and authentic?',
      ],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  const playChime = (type: 'received' | 'sent') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'received') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.1);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch {
      // Ignore audio errors gracefully
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
    if (!hasOpenedOnce) {
      setHasOpenedOnce(true);
    }
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleToggleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'msg-reset-' + Date.now(),
        sender: 'system',
        text: '🧹 Conversation history has been cleared.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: 'msg-welcome-new-' + Date.now(),
        sender: 'agent',
        text: `How else can I assist your claim today? Feel free to ask any question about tickets, payments, or payout statuses.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickSuggestions: [
          'How do I claim my reward?',
          'What payment methods are accepted?',
          'Why is there an entry ticket fee?',
        ],
      },
    ]);
  };

  const findBestResponse = (query: string): { text: string; action?: { label: string; targetStep: AppStep }; followUps?: string[] } => {
    const q = query.toLowerCase().trim();

    // Check matching topics
    for (const item of PRESET_TOPICS) {
      const matches = item.keywords.some((kw) => q.includes(kw));
      if (matches) {
        return {
          text: item.response(selectedTier),
          action: item.action,
          followUps: item.followUps,
        };
      }
    }

    // Context-aware step responses
    if (q.includes('step') || q.includes('where am i') || q.includes('status')) {
      return {
        text: `You are currently on **Step: ${currentStep.toUpperCase()}**.\n` +
          `• If you haven't picked a prize tier, proceed to **Prize Selection**.\n` +
          `• If you are ready to settle your ticket fee, navigate to the **Payment Form**.\n` +
          `• Need administrative verification? Check the **Ledger Admin** portal.`,
        action: { label: 'Go to Current Action', targetStep: currentStep === AppStep.LANDING ? AppStep.SELECTION : currentStep },
        followUps: ['How do I claim my reward?', 'What payment methods are accepted?'],
      };
    }

    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return {
        text: `Hello! I'm here 24/7 to assist you. Are you ready to select your prize tier or submit payment proof for instant disbursement?`,
        action: { label: 'View Prize Tiers', targetStep: AppStep.SELECTION },
        followUps: ['How do I claim my reward?', 'What payment methods are accepted?'],
      };
    }

    if (q.includes('human') || q.includes('agent') || q.includes('operator') || q.includes('talk')) {
      return {
        text: `You are currently connected to **Officer Sarah (ID: #MW-8841)** with direct ledger authority. All automated and manual verifications are synchronized in real-time. Please let me know what specific issue or ticket you need help with!`,
        followUps: ['How long does verification take?', 'Gift Card Code / PIN troubleshooting'],
      };
    }

    // Default helpful fallback
    return {
      text: `Thank you for your question. Here is key guidance for your claim journey:\n\n` +
        `• **Select a Prize Tier** to lock in your payout multiplier (up to $500,000).\n` +
        `• **Submit your Ticket Fee** via Crypto (BTC/USDT/ETH) or Gift Card (Apple/Steam/Razer).\n` +
        `• **Upload your receipt** for instant verification on the blockchain ledger.\n\n` +
        `Would you like to proceed directly to the payment form or choose another topic below?`,
      action: { label: 'Go to Payment Section', targetStep: AppStep.PAYMENT },
      followUps: [
        'How do I claim my reward?',
        'What payment methods are accepted?',
        'How long does verification take?',
      ],
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const rawText = textToSend || inputText;
    const text = rawText.trim();
    if (!text) return;

    playChime('sent');

    const userMessage: Message = {
      id: 'msg-user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate natural response delay (600-1100ms)
    const delay = Math.floor(Math.random() * 500) + 600;
    setTimeout(() => {
      const match = findBestResponse(text);
      const agentResponse: Message = {
        id: 'msg-agent-' + Date.now(),
        sender: 'agent',
        text: match.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: match.action,
        quickSuggestions: match.followUps,
      };

      setMessages((prev) => [...prev, agentResponse]);
      setIsTyping(false);
      playChime('received');
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Step name badge helper
  const getStepBadge = () => {
    switch (currentStep) {
      case AppStep.LANDING:
        return 'Welcome Portal';
      case AppStep.SELECTION:
        return 'Tier Selection';
      case AppStep.DETAILS:
        return 'Claimant Info';
      case AppStep.PAYMENT:
        return 'Settlement & Deposit';
      case AppStep.VERIFICATION:
        return 'Ledger Verification';
      case AppStep.CONFIRMATION:
        return 'Payout Approved';
      case AppStep.ADMIN:
        return 'Admin Dashboard';
      default:
        return 'Claim Portal';
    }
  };

  return (
    <>
      {/* Floating Trigger Bubble */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
          {/* Pulsing Helper Pill on First Visit */}
          {!hasOpenedOnce && (
            <div
              onClick={handleOpen}
              className="hidden sm:flex items-center gap-2 bg-slate-900/90 text-white text-xs font-semibold px-3 py-2 rounded-2xl border border-blue-500/30 shadow-2xl backdrop-blur-md cursor-pointer hover:border-blue-400 transition-all animate-bounce"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Need help with your claim? Chat live</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
            </div>
          )}

          <button
            id="live-support-bubble-btn"
            onClick={handleOpen}
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full shadow-[0_10px_30px_rgba(37,99,235,0.4)] border border-blue-400/40 hover:scale-105 active:scale-95 transition-all duration-200"
            aria-label="Open 24/7 Live Support Chat"
          >
            <div className="relative">
              <Headphones className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-blue-600 animate-pulse" />
            </div>

            <span className="font-extrabold text-xs tracking-wide hidden sm:inline">
              Live Support
            </span>

            {/* Unread Counter Badge */}
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-slate-950">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Expanded Support Chat Modal / Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-out ${
            isMinimized
              ? 'bottom-5 right-5 w-80 h-14'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[410px] h-[580px] max-h-[88vh]'
          } bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col overflow-hidden`}
        >
          {/* Chat Window Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between select-none">
            <div className="flex items-center gap-3 min-w-0">
              {/* Agent Avatar */}
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-inner flex-shrink-0 border border-blue-400/30">
                <Headphones className="w-5 h-5 text-blue-100" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-white truncate">
                    Live Support Desk
                  </h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-bold">Online</span>
                  <span>• Officer Sarah (ID: #8841)</span>
                </div>
              </div>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-blue-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 transition-colors"
                title="Clear Chat History"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleToggleMinimize}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                title={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
              </button>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800/60 transition-colors"
                title="Close Live Support"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Section when not minimized */}
          {!isMinimized && (
            <>
              {/* Journey Stage Status Banner */}
              <div className="px-4 py-1.5 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5 truncate">
                  <Zap className="w-3 h-3 text-amber-400 flex-shrink-0" />
                  <span>Stage:</span>
                  <span className="font-bold text-slate-200 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
                    {getStepBadge()}
                  </span>
                </div>
                {selectedTier && (
                  <span className="text-emerald-400 font-extrabold truncate ml-2">
                    ${selectedTier.reward.toLocaleString()} Goal
                  </span>
                )}
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-700">
                {messages.map((msg) => {
                  const isAgent = msg.sender === 'agent';
                  const isUser = msg.sender === 'user';
                  const isSystem = msg.sender === 'system';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="text-center my-2">
                        <span className="text-[10px] font-mono bg-slate-950/80 text-slate-400 px-3 py-1 rounded-full border border-slate-800">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-end gap-2 max-w-[88%]">
                        {isAgent && (
                          <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-[10px] font-bold text-blue-300 flex-shrink-0 mb-1">
                            S
                          </div>
                        )}

                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isUser
                              ? 'bg-blue-600 text-white rounded-br-none shadow-[0_4px_15px_rgba(37,99,235,0.25)]'
                              : 'bg-slate-950/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-md'
                          }`}
                        >
                          {/* Markdown-style parser for bold and linebreaks */}
                          <div className="whitespace-pre-wrap space-y-1">
                            {msg.text.split('\n').map((line, i) => (
                              <p key={i}>
                                {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                                  if (part.startsWith('**') && part.endsWith('**')) {
                                    return (
                                      <strong key={j} className="font-extrabold text-white">
                                        {part.slice(2, -2)}
                                      </strong>
                                    );
                                  }
                                  return part;
                                })}
                              </p>
                            ))}
                          </div>

                          {/* Quick Action Navigation Button attached to message */}
                          {msg.action && (
                            <button
                              onClick={() => {
                                onNavigateToStep(msg.action!.targetStep);
                                setIsOpen(false);
                              }}
                              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white font-bold rounded-xl border border-blue-400/30 transition-all text-[11px]"
                            >
                              <span>{msg.action.label}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Timestamp */}
                      <span className="text-[9px] text-slate-500 mt-1 px-1">
                        {msg.timestamp}
                      </span>

                      {/* Quick Suggestion Chips on latest agent message */}
                      {isAgent && msg.quickSuggestions && msg.quickSuggestions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                          {msg.quickSuggestions.map((promptText, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(promptText)}
                              className="text-[10px] font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-blue-600/30 border border-slate-700/80 hover:border-blue-500/40 px-2.5 py-1 rounded-xl transition-all text-left"
                            >
                              💬 {promptText}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Animated Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 max-w-[85%]">
                    <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-[10px] font-bold text-blue-300 flex-shrink-0">
                      S
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-bl-none px-4 py-2.5 flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 mr-1 font-medium">
                        Officer Sarah is typing
                      </span>
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Topic Chips Bar */}
              <div className="px-3 py-1.5 bg-slate-950/90 border-t border-slate-800 overflow-x-auto scrollbar-none flex items-center gap-1.5 text-[11px] whitespace-nowrap">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-blue-400" />
                  Quick:
                </span>
                {PRESET_TOPICS.slice(0, 4).map((item) => (
                  <button
                    key={item.topic}
                    onClick={() => handleSendMessage(item.label)}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors text-[10px]"
                  >
                    {item.topic}
                  </button>
                ))}
              </div>

              {/* Chat Input Field & Send Button */}
              <div className="p-3 bg-slate-950 border-t border-slate-800">
                <div className="relative flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type your question (e.g. payout, receipt)..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-slate-900 border border-slate-700/90 rounded-2xl pl-3.5 pr-11 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim() || isTyping}
                    className={`absolute right-1.5 p-2 rounded-xl text-white transition-all ${
                      inputText.trim() && !isTyping
                        ? 'bg-blue-600 hover:bg-blue-500 shadow-md scale-100'
                        : 'bg-slate-800 text-slate-600 scale-90 cursor-not-allowed'
                    }`}
                    title="Send Message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-[9px] text-slate-500 mt-1.5 px-1">
                  <span>Michael Wiersky Philanthropic Escrow</span>
                  <span>Instant Automated Response</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
