
import { PrizeTier, CryptoPaymentDetail } from './types';

export const PREFERRED_CLAIM_TIERS: PrizeTier[] = [
  { id: 1, entryFee: 50, reward: 5000, popularity: 'Starter', isPreferred: true },
  { id: 2, entryFee: 100, reward: 10000, popularity: 'Common', isPreferred: true },
  { id: 3, entryFee: 150, reward: 15000, popularity: 'Bronze', isPreferred: true },
  { id: 4, entryFee: 200, reward: 20000, popularity: 'Silver', isPreferred: true },
  { id: 5, entryFee: 300, reward: 30000, popularity: 'Gold', isPreferred: true },
  { id: 6, entryFee: 400, reward: 40000, popularity: 'Platinum', isPreferred: true },
  { id: 7, entryFee: 500, reward: 50000, popularity: 'Popular', isPreferred: true },
  { id: 8, entryFee: 1000, reward: 100000, popularity: 'Most Popular', isPreferred: true },
  { id: 9, entryFee: 1500, reward: 150000, popularity: 'Diamond', isPreferred: true },
  { id: 10, entryFee: 2000, reward: 200000, popularity: 'High Roller', isPreferred: true },
  { id: 11, entryFee: 3000, reward: 250000, popularity: 'Elite', isPreferred: true },
  { id: 12, entryFee: 5000, reward: 350000, popularity: 'VIP Master', isPreferred: true },
  { id: 13, entryFee: 10000, reward: 420000, popularity: 'Ultimate', isPreferred: true },
];

export const PRIZE_TIERS = PREFERRED_CLAIM_TIERS;

export const APP_NAME = "Michael Wiersky Giveaway";

export const CRYPTO_PAYMENTS: CryptoPaymentDetail[] = [
  {
    id: 'BTC',
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'Bitcoin Native (SegWit)',
    address: 'bc1qk3seq4ae09fq7mj4hdsnhqeaukcssshyg4rpsa',
  },
  {
    id: 'USDT_BEP20',
    name: 'Tether USD (BEP20)',
    symbol: 'USDT',
    network: 'BNB Smart Chain (BEP20)',
    address: '0x5017a0E5Bb242908c8b11577726fDEaD333b3853',
  },
  {
    id: 'ETH_ERC20',
    name: 'Ethereum (ERC20)',
    symbol: 'ETH',
    network: 'Ethereum Mainnet (ERC20)',
    address: '0x5017a0E5Bb242908c8b11577726fDEaD333b3853',
  },
  {
    id: 'USDT_TRON',
    name: 'Tether USD (TRON TRC20)',
    symbol: 'USDT',
    network: 'TRON (TRC20)',
    address: 'TVhsqw55M6cDNastjZmqBEd6ngqXQmpAEz',
  },
];

export const GIFT_CARDS = [
  { id: 'Apple Gift Card', name: 'Apple Gift Card', icon: '🍎', description: 'App Store, iTunes & Apple Store Cards' },
  { id: 'Razer Gift Card', name: 'Razer Gift Card', icon: '⚡', description: 'Razer Gold & Razer Hardware Cards' },
  { id: 'Steam Gift Card', name: 'Steam Gift Card', icon: '🎮', description: 'Steam Wallet Codes & Global Cards' },
  { id: 'Xbox Gift Card', name: 'Xbox Gift Card', icon: '🎯', description: 'Xbox Live & Microsoft Store Gift Cards' },
  { id: 'Sephora Gift Card', name: 'Sephora Gift Card', icon: '✨', description: 'Sephora Online & In-Store Cards' },
];

export const PAYMENT_METHODS_OPTIONS = [
  { value: 'BTC', label: 'BTC (Bitcoin)', category: 'crypto' },
  { value: 'USDT_BEP20', label: 'USDT (BEP20 - BNB Chain)', category: 'crypto' },
  { value: 'ETH_ERC20', label: 'ETH (ERC20 - Ethereum)', category: 'crypto' },
  { value: 'USDT_TRON', label: 'USDT (TRON TRC20)', category: 'crypto' },
  { value: 'Apple Gift Card', label: 'Apple Gift Card', category: 'giftcard' },
  { value: 'Razer Gift Card', label: 'Razer Gift Card', category: 'giftcard' },
  { value: 'Steam Gift Card', label: 'Steam Gift Card', category: 'giftcard' },
  { value: 'Xbox Gift Card', label: 'Xbox Gift Card', category: 'giftcard' },
  { value: 'Sephora Gift Card', label: 'Sephora Gift Card', category: 'giftcard' },
];

export const DEFAULT_ADMIN_PASSWORD = "MySecretPass123";

