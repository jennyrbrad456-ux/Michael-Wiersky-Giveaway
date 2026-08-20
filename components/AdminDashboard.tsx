import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { DEFAULT_ADMIN_PASSWORD } from '../constants';
import { ReceiptModal } from './ReceiptModal';
import {
  TRANSACTIONS_TABLE_SQL,
  TRANSACTIONS_SCHEMA_COLUMNS,
  generateSqlDump,
} from '../utils/schema';
import {
  Lock,
  Unlock,
  LogOut,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Trash2,
  Download,
  Eye,
  RefreshCw,
  PlusCircle,
  FileText,
  Shield,
  Layers,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Database,
  Code,
  Copy,
  Check,
  Table,
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToApp?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);
  const [viewMode, setViewMode] = useState<'standard' | 'sql_raw'>('standard');
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // Check login state on mount
  useEffect(() => {
    const adminSession = sessionStorage.getItem('mw_is_admin');
    if (adminSession === 'true') {
      setIsAdmin(true);
    }
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    try {
      const stored = localStorage.getItem('mw_transactions');
      if (stored) {
        setTransactions(JSON.parse(stored));
      } else {
        // Pre-populate with sample transactions matching INT AUTO_INCREMENT and schema fields
        const sampleTransactions: Transaction[] = [
          {
            id: 1,
            txCode: 'TX-0001',
            claimantName: 'Marcus Vance',
            email: 'marcus.v@example.com',
            payment_method: 'BTC',
            paymentMethod: 'BTC',
            receipt_file: '1723639102_btc_blockchain_receipt.jpg',
            receiptFileName: '1723639102_btc_blockchain_receipt.jpg',
            ticketFee: 500,
            guaranteedReward: 50000,
            walletAddress: 'bc1q9v837m4y098f983h74yhd9843h7398hf48',
            created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
            status: 'Approved',
          },
          {
            id: 2,
            txCode: 'TX-0002',
            claimantName: 'Elena Rostova',
            email: 'elena.rostova@icloud.com',
            payment_method: 'Apple Gift Card',
            paymentMethod: 'Apple Gift Card',
            receipt_file: '1723641200_apple_giftcard_pin.jpg',
            receiptFileName: '1723641200_apple_giftcard_pin.jpg',
            giftCardCode: 'X839-4421-9901-8374',
            ticketFee: 1000,
            guaranteedReward: 100000,
            walletAddress: '$ElenaRostovaWinner',
            created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
            createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
            status: 'Pending',
          },
          {
            id: 3,
            txCode: 'TX-0003',
            claimantName: 'David Chen',
            email: 'david.chen@gmail.com',
            payment_method: 'USDT_TRON',
            paymentMethod: 'USDT_TRON',
            receipt_file: '1723644910_tron_tx_hash.png',
            receiptFileName: '1723644910_tron_tx_hash.png',
            ticketFee: 2000,
            guaranteedReward: 200000,
            walletAddress: 'TVhsqw55M6cDNastjZmqBEd6ngqXQmpAEz',
            created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
            createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
            status: 'Disbursed',
          },
        ];
        setTransactions(sampleTransactions);
        localStorage.setItem('mw_transactions', JSON.stringify(sampleTransactions));
      }
    } catch (e) {
      console.error('Error loading transactions', e);
    }
  };

  const saveTransactions = (updated: Transaction[]) => {
    setTransactions(updated);
    localStorage.setItem('mw_transactions', JSON.stringify(updated));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === DEFAULT_ADMIN_PASSWORD) {
      setIsAdmin(true);
      sessionStorage.setItem('mw_is_admin', 'true');
      setLoginError('');
      setPasswordInput('');
    } else {
      setLoginError('Invalid admin password. Default is MySecretPass123');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('mw_is_admin');
  };

  const handleStatusChange = (id: number | string, newStatus: Transaction['status']) => {
    const updated = transactions.map((tx) =>
      tx.id === id ? { ...tx, status: newStatus } : tx
    );
    saveTransactions(updated);
  };

  const handleDelete = (id: number | string) => {
    if (window.confirm('Are you sure you want to delete this transaction record?')) {
      const updated = transactions.filter((tx) => tx.id !== id);
      saveTransactions(updated);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Warning: This will clear all transactions from local database.')) {
      saveTransactions([]);
    }
  };

  const handleAddSampleTx = () => {
    const randomMethods = ['BTC', 'USDT_BEP20', 'ETH_ERC20', 'USDT_TRON', 'Apple Gift Card', 'Razer Gift Card', 'Steam Gift Card'];
    const randomMethod = randomMethods[Math.floor(Math.random() * randomMethods.length)];
    const fee = [50, 100, 200, 500, 1000, 2000, 5000][Math.floor(Math.random() * 7)];
    const reward = fee * 100;
    
    const maxId = transactions.reduce((max, tx) => {
      const num = typeof tx.id === 'number' ? tx.id : parseInt(String(tx.id).replace(/\D/g, ''), 10) || 0;
      return num > max ? num : max;
    }, 0);
    const nextId = maxId + 1;
    const nowIso = new Date().toISOString();
    const fileName = `${Date.now()}_receipt_${randomMethod.toLowerCase().replace(/\s+/g, '_')}.jpg`;

    const newTx: Transaction = {
      id: nextId,
      txCode: `TX-${String(nextId).padStart(4, '0')}`,
      claimantName: 'Applicant #' + nextId,
      email: `user${nextId}@portal.net`,
      payment_method: randomMethod,
      paymentMethod: randomMethod,
      receipt_file: fileName,
      receiptFileName: fileName,
      ticketFee: fee,
      guaranteedReward: reward,
      walletAddress: '0x' + Math.random().toString(16).substring(2, 34),
      created_at: nowIso,
      createdAt: nowIso,
      status: 'Pending',
    };
    saveTransactions([newTx, ...transactions]);
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      alert('No transactions to export.');
      return;
    }
    const headers = ['id', 'payment_method', 'receipt_file', 'created_at', 'claimant_name', 'email', 'ticket_fee', 'guaranteed_reward', 'status'];
    const rows = transactions.map((t) => [
      t.id,
      `"${t.payment_method || t.paymentMethod || ''}"`,
      `"${t.receipt_file || t.receiptFileName || ''}"`,
      `"${t.created_at || t.createdAt || ''}"`,
      `"${t.claimantName || ''}"`,
      t.email || '',
      t.ticketFee || 0,
      t.guaranteedReward || 0,
      t.status || 'Pending',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transactions_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportSQL = () => {
    const sqlDump = generateSqlDump(transactions);
    const blob = new Blob([sqlDump], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_schema_dump_${Date.now()}.sql`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySql = () => {
    const sqlDump = generateSqlDump(transactions);
    navigator.clipboard.writeText(sqlDump).then(() => {
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    });
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter((tx) => {
    const idStr = String(tx.id);
    const methodStr = tx.payment_method || tx.paymentMethod || '';
    const nameStr = tx.claimantName || '';
    const emailStr = tx.email || '';
    const walletStr = tx.walletAddress || '';
    const giftStr = tx.giftCardCode || '';

    const matchesSearch =
      idStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      methodStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nameStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emailStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      walletStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      giftStr.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMethod = methodFilter === 'ALL' || methodStr === methodFilter;
    const matchesStatus = statusFilter === 'ALL' || tx.status === statusFilter;

    return matchesSearch && matchesMethod && matchesStatus;
  });

  // Calculate statistics
  const totalSubmissions = transactions.length;
  const totalTicketFees = transactions.reduce((sum, tx) => sum + (tx.ticketFee || 0), 0);
  const totalRewardsClaimed = transactions.reduce((sum, tx) => sum + (tx.guaranteedReward || 0), 0);
  const pendingCount = transactions.filter((tx) => tx.status === 'Pending').length;
  const approvedCount = transactions.filter((tx) => tx.status === 'Approved' || tx.status === 'Disbursed').length;

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4">
      {/* Top Breadcrumb & Return button */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Ledger Administration Portal
            </h2>
            <p className="text-xs text-slate-400">
              Verified Michael Wiersky Distribution & Transactions Database
            </p>
          </div>
        </div>

        {onBackToApp && (
          <button
            onClick={onBackToApp}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700 flex items-center gap-2"
          >
            <span>Return to User Dashboard</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Admin Login View */}
      {!isAdmin ? (
        <div className="max-w-md mx-auto my-12 p-8 bg-slate-900/80 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400">
            <Lock className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black text-white text-center mb-2">Admin Authentication</h3>
          <p className="text-xs text-slate-400 text-center mb-6 leading-relaxed">
            Enter the authorized administrator password to manage transactions and receipts.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Admin Master Password
              </label>
              <input
                type="password"
                name="adminPassword"
                id="adminPassword"
                required
                placeholder="Enter admin password (e.g. MySecretPass123)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              name="adminLogin"
              id="adminLogin"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Login to Dashboard</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500 font-mono">
              Default password: <span className="text-blue-400 font-bold">MySecretPass123</span>
            </p>
          </div>
        </div>
      ) : (
        /* Authenticated Admin Dashboard */
        <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
          {/* Top Admin Controls & Logout */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Admin Session Active
                </span>
                <p className="text-sm font-bold text-white">Database & Transactions Management</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowSqlModal(true)}
                className="px-3.5 py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold rounded-xl transition-all border border-blue-500/30 flex items-center gap-1.5"
                title="View SQL DDL and Inserts"
              >
                <Database className="w-3.5 h-3.5" />
                <span>SQL Schema & Queries</span>
              </button>

              <button
                onClick={handleExportSQL}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700 flex items-center gap-1.5"
                title="Download MySQL/PostgreSQL Dump"
              >
                <Code className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dump .SQL</span>
              </button>

              <button
                onClick={handleAddSampleTx}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700 flex items-center gap-1.5"
                title="Add Test Entry"
              >
                <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>Add Test Entry</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700 flex items-center gap-1.5"
                title="Export transactions table as CSV"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleLogout}
                name="adminLogout"
                id="adminLogout"
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white text-xs font-bold rounded-xl transition-all border border-red-500/30 flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Stats Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Entries</span>
                <Layers className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">{totalSubmissions}</p>
              <p className="text-[11px] text-slate-500 mt-1">Logged SQL transaction rows</p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Ticket Fees Collected</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">
                ${totalTicketFees.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Verified entry contributions</p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Claims Value</span>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">
                ${totalRewardsClaimed.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Guaranteed disbursement pool</p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Pending Review</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-amber-400">{pendingCount}</p>
              <p className="text-[11px] text-slate-500 mt-1">{approvedCount} approved & verified</p>
            </div>
          </div>

          {/* Search, Filter & View Toggle */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID, method, file, claimant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* View Mode Toggle & Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('standard')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                    viewMode === 'standard'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Standard View</span>
                </button>
                <button
                  onClick={() => setViewMode('sql_raw')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                    viewMode === 'sql_raw'
                      ? 'bg-cyan-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Strict SQL Schema View</span>
                </button>
              </div>

              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-blue-500 focus:outline-none"
              >
                <option value="ALL">All Payment Methods</option>
                <option value="BTC">BTC (Bitcoin)</option>
                <option value="USDT_BEP20">USDT (BEP20)</option>
                <option value="ETH_ERC20">ETH (ERC20)</option>
                <option value="USDT_TRON">USDT (TRON TRC20)</option>
                <option value="Apple Gift Card">Apple Gift Card</option>
                <option value="Razer Gift Card">Razer Gift Card</option>
                <option value="Steam Gift Card">Steam Gift Card</option>
                <option value="Xbox Gift Card">Xbox Gift Card</option>
                <option value="Sephora Gift Card">Sephora Gift Card</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-blue-500 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Disbursed">Disbursed</option>
                <option value="Rejected">Rejected</option>
              </select>

              <button
                onClick={loadTransactions}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Refresh Table"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <h4 className="text-base font-black text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-400" />
                  Table: <span className="font-mono text-cyan-400">transactions</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    {filteredTransactions.length} rows
                  </span>
                </h4>
              </div>

              <div className="flex items-center gap-3">
                {transactions.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Table
                  </button>
                )}
              </div>
            </div>

            {viewMode === 'sql_raw' ? (
              /* Strict SQL Schema View (id, payment_method, receipt_file, created_at) */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/90 text-[11px] font-black uppercase tracking-wider text-cyan-400">
                      <th className="py-3.5 px-4">id (INT)</th>
                      <th className="py-3.5 px-4">payment_method (VARCHAR 100)</th>
                      <th className="py-3.5 px-4">receipt_file (VARCHAR 255)</th>
                      <th className="py-3.5 px-4">created_at (TIMESTAMP)</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-500 font-sans">
                          No transaction rows in table `transactions`.
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-amber-400">{tx.id}</td>
                          <td className="py-3.5 px-4 text-emerald-400">
                            '{tx.payment_method || tx.paymentMethod || 'UNKNOWN'}'
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              onClick={() => setSelectedReceiptTx(tx)}
                              className="text-blue-400 hover:text-blue-300 cursor-pointer underline decoration-dotted"
                            >
                              '{tx.receipt_file || tx.receiptFileName || 'receipt.jpg'}'
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">
                            {tx.created_at || tx.createdAt || new Date().toISOString()}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleDelete(tx.id)}
                              className="p-1 rounded bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                              title="DELETE FROM transactions WHERE id = ..."
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Standard Rich View */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">ID</th>
                      <th className="py-3.5 px-4">Payment Method</th>
                      <th className="py-3.5 px-4">Receipt File</th>
                      <th className="py-3.5 px-4">Claimant & Payout Info</th>
                      <th className="py-3.5 px-4">Ticket & Reward</th>
                      <th className="py-3.5 px-4">Date / Time</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500 font-sans">
                          <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                          <p className="text-sm font-medium">No transactions found matching criteria.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((tx) => {
                        const isPending = tx.status === 'Pending';
                        const isApproved = tx.status === 'Approved' || tx.status === 'Disbursed';
                        const isRejected = tx.status === 'Rejected';
                        const method = tx.payment_method || tx.paymentMethod || 'BTC';
                        const fileName = tx.receipt_file || tx.receiptFileName || 'receipt.jpg';
                        const createdDate = tx.created_at || tx.createdAt || new Date().toISOString();

                        return (
                          <tr
                            key={tx.id}
                            className="hover:bg-slate-800/40 transition-colors group text-slate-300"
                          >
                            {/* ID */}
                            <td className="py-3.5 px-4 font-bold text-white">
                              <span className="text-cyan-400">#{tx.id}</span>
                              {tx.txCode && (
                                <span className="block text-[10px] text-slate-500">{tx.txCode}</span>
                              )}
                            </td>

                            {/* Payment Method */}
                            <td className="py-3.5 px-4 font-sans">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold text-[11px]">
                                {method}
                              </span>
                              {tx.giftCardCode && (
                                <p className="text-[10px] font-mono text-amber-300 mt-1">
                                  PIN: {tx.giftCardCode}
                                </p>
                              )}
                            </td>

                            {/* Receipt File */}
                            <td className="py-3.5 px-4 font-sans">
                              {tx.receiptFile ? (
                                <button
                                  onClick={() => setSelectedReceiptTx(tx)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white transition-all text-xs font-semibold"
                                >
                                  <Eye className="w-3 h-3 text-blue-400" />
                                  <span className="truncate max-w-[120px]">
                                    {fileName}
                                  </span>
                                </button>
                              ) : (
                                <span
                                  onClick={() => setSelectedReceiptTx(tx)}
                                  className="inline-flex items-center gap-1 text-slate-400 hover:text-blue-400 cursor-pointer underline underline-offset-2"
                                >
                                  <FileText className="w-3 h-3" />
                                  <span className="truncate max-w-[120px]">{fileName}</span>
                                </span>
                              )}
                            </td>

                            {/* Claimant Info */}
                            <td className="py-3.5 px-4 font-sans">
                              <p className="font-bold text-white text-xs">{tx.claimantName || 'Anonymous'}</p>
                              <p className="text-[11px] text-slate-400">{tx.email || 'N/A'}</p>
                              {tx.walletAddress && (
                                <p className="text-[10px] font-mono text-slate-500 truncate max-w-[150px] mt-0.5">
                                  {tx.walletAddress}
                                </p>
                              )}
                            </td>

                            {/* Ticket & Guaranteed Reward */}
                            <td className="py-3.5 px-4 font-sans">
                              <p className="font-bold text-white text-xs">
                                ${tx.ticketFee ? tx.ticketFee.toLocaleString() : '50'} Ticket
                              </p>
                              <p className="text-emerald-400 font-extrabold text-xs">
                                ${tx.guaranteedReward ? tx.guaranteedReward.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '5,000.00'}
                              </p>
                            </td>

                            {/* Date / Time */}
                            <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                              {new Date(createdDate).toLocaleDateString()}{' '}
                              <span className="text-[10px] text-slate-500">
                                {new Date(createdDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4 font-sans">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                  isApproved
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    : isRejected
                                    ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isApproved
                                      ? 'bg-emerald-400'
                                      : isRejected
                                      ? 'bg-red-400'
                                      : 'bg-amber-400 animate-pulse'
                                  }`}
                                />
                                {tx.status || 'Pending'}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right font-sans">
                              <div className="flex items-center justify-end gap-1.5">
                                {isPending && (
                                  <>
                                    <button
                                      onClick={() => handleStatusChange(tx.id, 'Approved')}
                                      className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition-colors"
                                      title="Approve Transaction"
                                    >
                                      <CheckCircle className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(tx.id, 'Rejected')}
                                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-colors"
                                      title="Reject Transaction"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}

                                {tx.status === 'Approved' && (
                                  <button
                                    onClick={() => handleStatusChange(tx.id, 'Disbursed')}
                                    className="px-2 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 text-[10px] font-bold border border-purple-500/30 transition-colors"
                                    title="Mark Funds as Disbursed"
                                  >
                                    Disburse
                                  </button>
                                )}

                                <button
                                  onClick={() => handleDelete(tx.id)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                                  title="Delete Transaction"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SQL Schema Inspector Card */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Relational Database Schema (MySQL / PostgreSQL)</h4>
                  <p className="text-xs text-slate-400">DDL definition for table `transactions`</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700 flex items-center gap-1.5"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL'}</span>
                </button>
                <button
                  onClick={handleExportSQL}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .sql</span>
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 text-xs font-mono overflow-x-auto leading-relaxed">
              {TRANSACTIONS_TABLE_SQL}
            </pre>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
              {TRANSACTIONS_SCHEMA_COLUMNS.map((col) => (
                <div key={col.name} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-amber-400">{col.name}</span>
                    <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-800/50">
                      {col.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mb-1">{col.constraints}</p>
                  <p className="text-[11px] text-slate-400 leading-snug">{col.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SQL Queries Full Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Database SQL Schema & Data Export</h3>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Complete SQL Script (DDL + INSERT DML)
                </label>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 text-xs font-mono overflow-x-auto max-h-96 leading-relaxed whitespace-pre-wrap">
                  {generateSqlDump(transactions)}
                </pre>
              </div>
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-3">
              <button
                onClick={handleCopySql}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-slate-700"
              >
                {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                <span>{copiedSql ? 'Copied to Clipboard' : 'Copy All SQL'}</span>
              </button>
              <button
                onClick={handleExportSQL}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download .sql File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal for Zoomed Viewing */}
      {selectedReceiptTx && (
        <ReceiptModal
          isOpen={Boolean(selectedReceiptTx)}
          onClose={() => setSelectedReceiptTx(null)}
          receiptSrc={selectedReceiptTx.receiptFile}
          receiptName={selectedReceiptTx.receipt_file || selectedReceiptTx.receiptFileName || `${selectedReceiptTx.id}_receipt.jpg`}
          txId={selectedReceiptTx.id}
          claimantName={selectedReceiptTx.claimantName}
          paymentMethod={selectedReceiptTx.payment_method || selectedReceiptTx.paymentMethod}
        />
      )}
    </div>
  );
};
