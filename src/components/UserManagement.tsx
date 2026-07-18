import React, { useState } from 'react';
import { Search, UserPlus, Shield, ShieldAlert, Edit2, Trash2, ArrowUpRight, History, X, DollarSign, Ticket } from 'lucide-react';
import { User, Transaction } from '../types';

interface UserManagementProps {
  users: User[];
  transactions: Transaction[];
  onAddUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'timestamp'>) => void;
}

export default function UserManagement({
  users,
  transactions,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onAddTransaction
}: UserManagementProps) {
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'blocked'>('all');
  
  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingTransactionsUser, setViewingTransactionsUser] = useState<User | null>(null);

  // Form States
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newBalance, setNewBalance] = useState(100);
  const [newTickets, setNewTickets] = useState(0);

  // Transaction Sim Form States
  const [simTxType, setSimTxType] = useState<'deposit' | 'ticket_purchase' | 'prize_payout'>('deposit');
  const [simTxAmount, setSimTxAmount] = useState(10);
  const [simTxRef, setSimTxRef] = useState('');

  // Filtered Users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                          user.email.toLowerCase().includes(search.toLowerCase()) ||
                          user.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || user.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    onAddUser({
      name: newName,
      email: newEmail,
      balance: Number(newBalance),
      ticketsBought: Number(newTickets),
      status: 'active'
    });
    setNewName('');
    setNewEmail('');
    setNewBalance(100);
    setNewTickets(0);
    setIsAddOpen(false);
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    onUpdateUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      balance: Number(editingUser.balance),
      ticketsBought: Number(editingUser.ticketsBought)
    });
    setEditingUser(null);
  };

  const handleSimulateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingTransactionsUser) return;

    const ref = simTxRef || `SIM-${Math.floor(100000 + Math.random() * 900000)}`;
    const txAmount = Number(simTxAmount);

    let sender = 'Platform Bank';
    let receiver = viewingTransactionsUser.name;

    if (simTxType === 'ticket_purchase') {
      sender = viewingTransactionsUser.name;
      receiver = 'Mega Spin Blitz';
      if (viewingTransactionsUser.balance < txAmount) {
        alert('Insufficient wallet balance to simulate ticket purchase!');
        return;
      }
      onUpdateUser(viewingTransactionsUser.id, {
        balance: Number((viewingTransactionsUser.balance - txAmount).toFixed(2)),
        ticketsBought: viewingTransactionsUser.ticketsBought + 1
      });
    } else if (simTxType === 'deposit') {
      onUpdateUser(viewingTransactionsUser.id, {
        balance: Number((viewingTransactionsUser.balance + txAmount).toFixed(2))
      });
    } else if (simTxType === 'prize_payout') {
      sender = 'Platform Reserve';
      onUpdateUser(viewingTransactionsUser.id, {
        balance: Number((viewingTransactionsUser.balance + txAmount).toFixed(2))
      });
    }

    onAddTransaction({
      type: simTxType,
      amount: txAmount,
      senderName: sender,
      receiverName: receiver,
      status: 'completed',
      referenceId: ref
    });

    setSimTxRef('');
    setSimTxAmount(10);
  };

  // Get specific transactions for a user
  const getUserTransactions = (user: User) => {
    return transactions.filter(t => 
      t.senderName === user.name || 
      t.receiverName === user.name ||
      t.senderName.includes(user.name) ||
      t.receiverName.includes(user.name)
    ).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">User Directory</h2>
          <p className="text-xs text-slate-500 mt-1">Manage players, wallets, ticket logs, and credit customized balances.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition duration-150 flex items-center justify-center gap-2 self-start"
        >
          <UserPlus size={16} />
          <span>Provision New Player</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search players by ID, Name, or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-xs font-sans text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-300 transition"
          />
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs text-slate-400 font-medium mr-1">Status:</span>
          <div className="flex bg-slate-50 border border-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md transition ${filter === 'all' ? 'bg-white text-indigo-600 shadow-xs' : 'hover:bg-slate-100'}`}
            >
              All Players
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1 rounded-md transition ${filter === 'active' ? 'bg-white text-emerald-600 shadow-xs' : 'hover:bg-slate-100'}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('blocked')}
              className={`px-3 py-1 rounded-md transition ${filter === 'blocked' ? 'bg-white text-red-600 shadow-xs' : 'hover:bg-slate-100'}`}
            >
              Suspended
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Player Details</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Wallet Balance</th>
                <th className="px-6 py-4 text-right">Tickets Purchased</th>
                <th className="px-6 py-4">Registered Date</th>
                <th className="px-6 py-4 text-right">Action Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-display font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-950 font-sans text-sm">{user.name}</h4>
                          <span className="font-mono text-[10px] text-slate-400">{user.id}</span>
                          <span className="text-[10px] text-slate-400 ml-2">({user.email})</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        user.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        {user.status === 'active' ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-950 text-sm">
                      {formatCurrency(user.balance)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium text-slate-600">
                      {user.ticketsBought} tickets
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {user.createdAt}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Transaction history shortcut */}
                        <button
                          onClick={() => setViewingTransactionsUser(user)}
                          title="Ledger / Direct Transaction"
                          className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition"
                        >
                          <History size={14} />
                        </button>
                        
                        {/* Edit button */}
                        <button
                          onClick={() => setEditingUser(user)}
                          title="Edit Wallet or Info"
                          className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                        >
                          <Edit2 size={14} />
                        </button>

                        {/* Block / Unblock toggle */}
                        <button
                          onClick={() => onUpdateUser(user.id, { status: user.status === 'active' ? 'blocked' : 'active' })}
                          title={user.status === 'active' ? 'Suspend Player' : 'Activate Player'}
                          className={`p-1.5 rounded-lg bg-slate-50 transition ${
                            user.status === 'active' ? 'text-red-400 hover:bg-red-50 hover:text-red-600' : 'text-emerald-400 hover:bg-emerald-50 hover:text-emerald-600'
                          }`}
                        >
                          {user.status === 'active' ? <ShieldAlert size={14} /> : <Shield size={14} />}
                        </button>

                        {/* Delete player */}
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to permanently delete user ${user.name}?`)) {
                              onDeleteUser(user.id);
                            }
                          }}
                          title="Delete Player Record"
                          className="p-1.5 rounded-lg bg-slate-50 text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No players found matching current filter query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. VIEW TRANSACTION LEDGER & DIRECT SIMULATOR DRAWER */}
      {viewingTransactionsUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50">
          <div className="bg-white w-full max-w-xl h-full flex flex-col shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">Ledger: {viewingTransactionsUser.name}</h3>
                <p className="text-[10px] font-mono text-slate-400">{viewingTransactionsUser.id} • Wallet: {formatCurrency(viewingTransactionsUser.balance)}</p>
              </div>
              <button 
                onClick={() => setViewingTransactionsUser(null)}
                className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Simulated Transaction Generator Section */}
            <div className="bg-slate-50 p-5 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <DollarSign size={13} className="text-indigo-600" />
                <span>Simulate Wallet Transaction</span>
              </h4>
              <form onSubmit={handleSimulateTransaction} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">TX Type</label>
                  <select
                    value={simTxType}
                    onChange={(e: any) => setSimTxType(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                  >
                    <option value="deposit">Deposit (Cash-in)</option>
                    <option value="ticket_purchase">Ticket Purchase</option>
                    <option value="prize_payout">Prize Win Payout</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">Amount ($)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={simTxAmount}
                    onChange={(e) => setSimTxAmount(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">Ref / Code (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Auto"
                      value={simTxRef}
                      onChange={(e) => setSimTxRef(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-1.5 px-3 rounded-lg flex items-center justify-center transition"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Transactions History */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ledger Logs</h4>
              {getUserTransactions(viewingTransactionsUser).length > 0 ? (
                <div className="space-y-3">
                  {getUserTransactions(viewingTransactionsUser).map((tx) => (
                    <div key={tx.id} className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-3xs flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            tx.type === 'deposit' ? 'bg-emerald-50 text-emerald-700' :
                            tx.type === 'ticket_purchase' ? 'bg-blue-50 text-blue-700' :
                            'bg-violet-50 text-violet-700'
                          }`}>
                            {tx.type.replace('_', ' ')}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">{tx.id}</span>
                        </div>
                        <p className="text-xs text-slate-700 mt-1.5">
                          <span className="text-slate-400">From:</span> {tx.senderName} <span className="text-slate-400">→</span> {tx.receiverName}
                        </p>
                        <span className="font-mono text-[9px] text-slate-400 block mt-1">{tx.timestamp}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-sm font-bold text-slate-900">
                          {tx.type === 'ticket_purchase' ? '-' : ''}{formatCurrency(tx.amount)}
                        </span>
                        <span className="text-[9px] text-slate-400 block font-mono">Ref: {tx.referenceId}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 font-medium">
                  No transaction ledger logs found for this user.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. PROVISION NEW PLAYER MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-display text-lg font-bold text-slate-900">Provision New Player Record</h3>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Charles Babbage"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g., charles@difference-engine.org"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Initial Balance ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newBalance}
                    onChange={(e) => setNewBalance(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Mock Tickets Bought</label>
                  <input
                    type="number"
                    min="0"
                    value={newTickets}
                    onChange={(e) => setNewTickets(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition"
                >
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. EDIT PLAYER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-display text-lg font-bold text-slate-900">Modify Player Info & Wallet</h3>
              <button 
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditUserSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Wallet Balance ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingUser.balance}
                    onChange={(e) => setEditingUser({ ...editingUser, balance: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Total Tickets Bought</label>
                  <input
                    type="number"
                    min="0"
                    value={editingUser.ticketsBought}
                    onChange={(e) => setEditingUser({ ...editingUser, ticketsBought: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
