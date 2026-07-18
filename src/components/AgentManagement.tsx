import React, { useState } from 'react';
import { Search, UserPlus, Check, X, ShieldAlert, Edit2, Trash2, History, Percent, Phone, MapPin, DollarSign } from 'lucide-react';
import { Agent, Transaction } from '../types';

interface AgentManagementProps {
  agents: Agent[];
  transactions: Transaction[];
  onAddAgent: (agent: Omit<Agent, 'id' | 'createdAt'>) => void;
  onUpdateAgent: (agentId: string, updates: Partial<Agent>) => void;
  onDeleteAgent: (agentId: string) => void;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'timestamp'>) => void;
}

export default function AgentManagement({
  agents,
  transactions,
  onAddAgent,
  onUpdateAgent,
  onDeleteAgent,
  onAddTransaction
}: AgentManagementProps) {
  // Navigation tabs within Agent Management
  const [activeTab, setActiveTab] = useState<'network' | 'pending' | 'rejected'>('network');
  const [search, setSearch] = useState('');

  // Modals & Drawers
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [viewingTransactionsAgent, setViewingTransactionsAgent] = useState<Agent | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [region, setRegion] = useState('');
  const [revenueShare, setRevenueShare] = useState(15);
  const [initialBalance, setInitialBalance] = useState(0);

  // Agent Transaction simulation
  const [simTxType, setSimTxType] = useState<'deposit' | 'withdrawal' | 'agent_commission'>('agent_commission');
  const [simTxAmount, setSimTxAmount] = useState(25);
  const [simTxRef, setSimTxRef] = useState('');

  // Filtered lists
  const pendingQueue = agents.filter(a => a.status === 'pending');
  const activeNetwork = agents.filter(a => a.status === 'approved');
  const rejectedIndex = agents.filter(a => a.status === 'rejected');

  const getActiveList = () => {
    switch (activeTab) {
      case 'pending': return pendingQueue;
      case 'rejected': return rejectedIndex;
      default: return activeNetwork;
    }
  };

  const filteredAgents = getActiveList().filter(agent => {
    return agent.name.toLowerCase().includes(search.toLowerCase()) || 
           agent.email.toLowerCase().includes(search.toLowerCase()) ||
           agent.region.toLowerCase().includes(search.toLowerCase()) ||
           agent.id.toLowerCase().includes(search.toLowerCase());
  });

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !region) return;
    onAddAgent({
      name,
      email,
      mobile,
      region,
      balance: Number(initialBalance),
      revenueShare: Number(revenueShare),
      status: 'approved' // Direct additions from admin are auto-approved
    });
    setName('');
    setEmail('');
    setMobile('');
    setRegion('');
    setRevenueShare(15);
    setInitialBalance(0);
    setIsAddOpen(false);
  };

  const handleEditAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgent) return;
    onUpdateAgent(editingAgent.id, {
      name: editingAgent.name,
      email: editingAgent.email,
      mobile: editingAgent.mobile,
      region: editingAgent.region,
      revenueShare: Number(editingAgent.revenueShare),
      balance: Number(editingAgent.balance)
    });
    setEditingAgent(null);
  };

  const handleSimulateAgentTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingTransactionsAgent) return;

    const ref = simTxRef || `SIM-AGT-${Math.floor(100000 + Math.random() * 900000)}`;
    const txAmount = Number(simTxAmount);

    let sender = 'Platform Reserve';
    let receiver = viewingTransactionsAgent.name;

    if (simTxType === 'withdrawal') {
      sender = viewingTransactionsAgent.name;
      receiver = 'Agent Bank Vault';
      if (viewingTransactionsAgent.balance < txAmount) {
        alert('Agent has insufficient balance to simulate withdrawal!');
        return;
      }
      onUpdateAgent(viewingTransactionsAgent.id, {
        balance: Number((viewingTransactionsAgent.balance - txAmount).toFixed(2))
      });
    } else { // deposit or commission
      onUpdateAgent(viewingTransactionsAgent.id, {
        balance: Number((viewingTransactionsAgent.balance + txAmount).toFixed(2))
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
    setSimTxAmount(25);
  };

  // Get agent transactions
  const getAgentTransactions = (agent: Agent) => {
    return transactions.filter(t => 
      t.senderName === agent.name || 
      t.receiverName === agent.name ||
      t.senderName.includes(agent.name) ||
      t.receiverName.includes(agent.name)
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
          <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">Game Agent Network</h2>
          <p className="text-xs text-slate-500 mt-1">Onboard and manage authorized spin game agents, edit commission rates, and review payout requests.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition duration-150 flex items-center justify-center gap-2 self-start"
        >
          <UserPlus size={16} />
          <span>Onboard Verified Agent</span>
        </button>
      </div>

      {/* Segment Tabs and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-slate-50 border border-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('network')}
            className={`px-4 py-1.5 rounded-md transition flex items-center gap-1.5 ${activeTab === 'network' ? 'bg-white text-indigo-600 shadow-xs' : 'hover:bg-slate-100'}`}
          >
            <span>Authorized Network</span>
            <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.5 rounded-full font-mono">{activeNetwork.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-1.5 rounded-md transition flex items-center gap-1.5 ${activeTab === 'pending' ? 'bg-white text-amber-600 shadow-xs' : 'hover:bg-slate-100'}`}
          >
            <span>Approval Queue</span>
            {pendingQueue.length > 0 ? (
              <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded-full font-mono animate-bounce">{pendingQueue.length}</span>
            ) : (
              <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.5 rounded-full font-mono">{pendingQueue.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-1.5 rounded-md transition flex items-center gap-1.5 ${activeTab === 'rejected' ? 'bg-white text-red-600 shadow-xs' : 'hover:bg-slate-100'}`}
          >
            <span>Rejected Queue</span>
            <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.5 rounded-full font-mono">{rejectedIndex.length}</span>
          </button>
        </div>

        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search agents by name, email, region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs font-sans text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-300 transition"
          />
        </div>
      </div>

      {/* Agents Table / Queue Display */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Agent Credentials</th>
                <th className="px-6 py-4">Operational Area</th>
                <th className="px-6 py-4">Contact info</th>
                <th className="px-6 py-4 text-center">Revenue Split</th>
                <th className="px-6 py-4 text-right">Withdrawable Commissions</th>
                <th className="px-6 py-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAgents.length > 0 ? (
                filteredAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-display font-bold">
                          {agent.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-950 text-sm">{agent.name}</h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[10px] text-slate-400">{agent.id}</span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-[10px] text-slate-400">{agent.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin size={13} className="text-slate-400" />
                        <span className="font-medium">{agent.region}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Phone size={13} className="text-slate-400" />
                        <span className="font-mono">{agent.mobile || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-0.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-mono font-bold text-xs">
                        <Percent size={11} />
                        <span>{agent.revenueShare}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-950 text-sm">
                      {formatCurrency(agent.balance)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {agent.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              onUpdateAgent(agent.id, { status: 'approved' });
                              // Add simulated success transaction and audit logs
                            }}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                          >
                            <Check size={14} />
                            <span>Approve Agent</span>
                          </button>
                          <button
                            onClick={() => onUpdateAgent(agent.id, { status: 'rejected' })}
                            className="bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                          >
                            <X size={14} />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {/* Transactions Shortcode */}
                          <button
                            onClick={() => setViewingTransactionsAgent(agent)}
                            title="Review Commission Ledger & Withdrawals"
                            className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition"
                          >
                            <History size={14} />
                          </button>

                          {/* Edit details */}
                          <button
                            onClick={() => setEditingAgent(agent)}
                            title="Edit Agent Profile & Split Share"
                            className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                          >
                            <Edit2 size={14} />
                          </button>

                          {/* Delete agent */}
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete Agent ${agent.name}?`)) {
                                onDeleteAgent(agent.id);
                              }
                            }}
                            title="Delete Agent Credentials"
                            className="p-1.5 rounded-lg bg-slate-50 text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No agents registered in this category queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. VIEW AGENT TRANSACTION LEDGER & DIRECT SIMULATOR DRAWER */}
      {viewingTransactionsAgent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50">
          <div className="bg-white w-full max-w-xl h-full flex flex-col shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">Commission Ledger: {viewingTransactionsAgent.name}</h3>
                <p className="text-[10px] font-mono text-slate-400">{viewingTransactionsAgent.id} • Balance: {formatCurrency(viewingTransactionsAgent.balance)}</p>
              </div>
              <button 
                onClick={() => setViewingTransactionsAgent(null)}
                className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Simulating Agent Credit or Debits */}
            <div className="bg-slate-50 p-5 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <DollarSign size={13} className="text-indigo-600" />
                <span>Simulate Agent Commission Event</span>
              </h4>
              <form onSubmit={handleSimulateAgentTx} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">TX Type</label>
                  <select
                    value={simTxType}
                    onChange={(e: any) => setSimTxType(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                  >
                    <option value="agent_commission">Commission Credit</option>
                    <option value="withdrawal">Commission Cash-out</option>
                    <option value="deposit">Vault Deposit</option>
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
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">Ref Code / Ticket ID</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. TCK-99212"
                      value={simTxRef}
                      onChange={(e) => setSimTxRef(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-1.5 px-3 rounded-lg flex items-center justify-center transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Agent Transactions History */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Transaction History</h4>
              {getAgentTransactions(viewingTransactionsAgent).length > 0 ? (
                <div className="space-y-3">
                  {getAgentTransactions(viewingTransactionsAgent).map((tx) => (
                    <div key={tx.id} className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-3xs flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            tx.type === 'agent_commission' ? 'bg-amber-50 text-amber-700' :
                            tx.type === 'withdrawal' ? 'bg-red-50 text-red-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {tx.type.replace('_', ' ')}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">{tx.id}</span>
                        </div>
                        <p className="text-xs text-slate-700 mt-1.5">
                          <span className="text-slate-400">To:</span> {tx.receiverName}
                        </p>
                        <span className="font-mono text-[9px] text-slate-400 block mt-1">{tx.timestamp}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-sm font-bold text-slate-900">
                          {tx.type === 'withdrawal' ? '-' : ''}{formatCurrency(tx.amount)}
                        </span>
                        <span className="text-[9px] text-slate-400 block font-mono">Ref: {tx.referenceId}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 font-medium">
                  No transaction logs found for this agent.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. ONBOARD NEW AGENT MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-display text-lg font-bold text-slate-900">Onboard Verified Spin Game Agent</h3>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateAgent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ada Lovelace"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1">Contact Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g., ada@analytical-engine.co.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    placeholder="e.g., +44 7123 4567"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Operational Region</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Midlands"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Revenue Split (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={revenueShare}
                    onChange={(e) => setRevenueShare(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Initial Reserve Wallet ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(Number(e.target.value))}
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
                  Onboard & Approve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. EDIT AGENT MODAL */}
      {editingAgent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-display text-lg font-bold text-slate-900">Modify Agent Profile</h3>
              <button 
                onClick={() => setEditingAgent(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditAgentSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={editingAgent.name}
                  onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1">Contact Email</label>
                <input
                  type="email"
                  required
                  value={editingAgent.email}
                  onChange={(e) => setEditingAgent({ ...editingAgent, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    value={editingAgent.mobile}
                    onChange={(e) => setEditingAgent({ ...editingAgent, mobile: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Operational Region</label>
                  <input
                    type="text"
                    required
                    value={editingAgent.region}
                    onChange={(e) => setEditingAgent({ ...editingAgent, region: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Revenue Split (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={editingAgent.revenueShare}
                    onChange={(e) => setEditingAgent({ ...editingAgent, revenueShare: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Wallet Reserve ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingAgent.balance}
                    onChange={(e) => setEditingAgent({ ...editingAgent, balance: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingAgent(null)}
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
