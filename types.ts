
export interface PrizeTier {
  id: number;
  entryFee: number;
  reward: number;
  popularity?: string;
  badge?: string;
  isPreferred?: boolean;
}

export interface UserDetails {
  fullName: string;
  email: string;
  paymentMethod: string;
  walletAddress?: string;
  giftCardCode?: string;
  receiptFile?: string; // Data URL or file name
  receiptFileName?: string;
}

export interface Transaction {
  id: number; // INT AUTO_INCREMENT PRIMARY KEY
  txCode?: string; // Optional code like TX-001
  payment_method: string; // VARCHAR(100)
  paymentMethod?: string; // Alias for UI
  receipt_file: string; // VARCHAR(255)
  receiptFile?: string; // Alias / Data URL
  receiptFileName?: string;
  created_at: string; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  createdAt?: string; // Alias for UI
  claimantName?: string;
  email?: string;
  giftCardCode?: string;
  ticketFee?: number;
  guaranteedReward?: number;
  walletAddress?: string;
  status?: 'Pending' | 'Approved' | 'Disbursed' | 'Rejected';
}

export interface CryptoPaymentDetail {
  id: string;
  name: string;
  symbol: string;
  network: string;
  address: string;
  memo?: string;
}

export enum AppStep {
  LANDING = 'LANDING',
  SELECTION = 'SELECTION',
  DETAILS = 'DETAILS',
  PAYMENT = 'PAYMENT',
  VERIFICATION = 'VERIFICATION',
  CONFIRMATION = 'CONFIRMATION',
  ADMIN = 'ADMIN'
}

