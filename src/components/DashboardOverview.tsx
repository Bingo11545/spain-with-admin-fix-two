import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Line, ComposedChart } from 'recharts';
import { DollarSign, Users, Ticket, Gamepad2, UserCheck, TrendingUp, ArrowUpRight, Clock, ShieldAlert } from 'lucide-react';
import { User, Agent, Game, Transaction, PerformanceDay } from '../types';

interface DashboardOverviewProps {
  users: User[];
  agents: Agent[];
  games: Game[];
  transactions: Transaction[];
  performanceData: PerformanceDay[];
  onNavigate: (tab: string) => void;
}

export default function DashboardOverview({
  users,
  agents,
  games,
  transactions,
  performanceData,
  onNavigate
}: DashboardOverviewProps) {
  
  // Calculate high-level stats
  const activeUsersCount = users.filter(u => u.status === 'active').length;
  const approvedAgentsCount = agents.filter(a => a.status === 'approved').length;
  const pendingAgentsCount = agents.filter(a => a.status === 'pending').length;
  const activeGamesCount = games.filter(g => g.status === 'active').length;

  // Calculate Revenue Metrics
  const ticketSalesAmount = transactions
    .filter(t => t.type === 'ticket_purchase' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDeposits = transactions
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const agentCommissions = transactions
    .filter(t => t.type === 'agent_commission' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPrizePayouts = transactions
    .filter(t => t.type === 'prize_payout' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  // Profit calculation: Ticket Sales - Agent Commissions - Prize Payouts (simplified platform revenue model)
  const netPlatformProfit = ticketSalesAmount - agentCommissions;

  // Get last 5 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 5);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Administrative Control Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time telemetry, transaction metrics, and universal gaming operations.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-xs font-mono text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SYSTEM ONLINE (UTC -07:00)</span>
        </div>
      </div>

      {/* Top Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Gross Platform Sales</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
              {formatCurrency(ticketSalesAmount)}
            </h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp size={12} className="text-emerald-500" />
              <span className="text-emerald-600 font-semibold">+18.4%</span> vs last week
            </p>
          </div>
        </div>

        {/* Card 2: Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Ticket Holders</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
              {activeUsersCount} <span className="text-xs text-slate-400 font-normal">/ {users.length} total</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {users.filter(u => u.ticketsBought > 50).length} high-frequency spin players
            </p>
          </div>
        </div>

        {/* Card 3: Agents Queue */}
        <div 
          onClick={() => onNavigate('agents')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between cursor-pointer hover:border-amber-200 hover:shadow-md transition duration-200 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Game Agent Queue</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${pendingAgentsCount > 0 ? 'bg-amber-50 text-amber-600 animate-pulse' : 'bg-slate-50 text-slate-500'}`}>
              {pendingAgentsCount > 0 ? <ShieldAlert size={18} /> : <UserCheck size={18} />}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-display text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {pendingAgentsCount} <span className="text-xs font-display font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Pending Approval</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 group-hover:text-amber-600 transition">
              <span>{approvedAgentsCount} approved agents network</span>
              <ArrowUpRight size={12} />
            </p>
          </div>
        </div>

        {/* Card 4: Games Config */}
        <div 
          onClick={() => onNavigate('games')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between cursor-pointer hover:border-violet-200 hover:shadow-md transition duration-200 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Gaming Ecosystem</span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Gamepad2 size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
              {activeGamesCount} <span className="text-xs text-slate-400 font-normal">/ {games.length} games</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 group-hover:text-violet-600 transition">
              <span>Universal draw schedules active</span>
              <ArrowUpRight size={12} />
            </p>
          </div>
        </div>
      </div>

      {/* RECHARTS PERFORMANCE METRICS CARD (Visualizes ticket volume and revenue trends over last 7 days) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 id="perf-metrics-title" className="font-display text-lg font-bold text-slate-950">
              Performance Metrics (Last 7 Days)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dual-axis visualizer representing daily ticket purchasing volume alongside total gross revenue trends.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-500"></span>
              <span className="text-slate-600">Revenue ($)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500"></span>
              <span className="text-slate-600">Tickets Sold</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={performanceData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="ticketGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }} 
              />
              <YAxis 
                yAxisId="left"
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                tickFormatter={(v) => `$${v}`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  fontSize: '12px'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}
              />
              <Legend verticalAlign="top" height={36} content={() => null} />
              
              {/* Area for Revenue */}
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                name="Gross Revenue ($)" 
                stroke="#6366f1" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#revenueGrad)" 
              />
              
              {/* Bar for Ticket Volume */}
              <Bar 
                yAxisId="right"
                dataKey="ticketVolume" 
                name="Tickets Sold" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
                maxBarSize={45}
                fillOpacity={0.8}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lower Section: Revenue Analytics & Recent Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Financial Flow Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900 mb-1">Financial Reconciliation</h3>
            <p className="text-xs text-slate-500">Breakdown of gross ticket sales, agent commission payouts, and net reserves.</p>
          </div>

          <div className="my-6 space-y-4">
            {/* Sales */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                <span className="text-sm font-medium text-slate-600">Gross Ticket Sales</span>
              </div>
              <span className="font-mono text-sm font-semibold text-slate-900">{formatCurrency(ticketSalesAmount)}</span>
            </div>

            {/* Commissions */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <span className="text-sm font-medium text-slate-600">Agent Commission Payouts</span>
              </div>
              <span className="font-mono text-sm font-semibold text-amber-600">-{formatCurrency(agentCommissions)}</span>
            </div>

            {/* Prize Payouts */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-slate-600">Prize Payouts (Winners)</span>
              </div>
              <span className="font-mono text-sm font-semibold text-red-600">-{formatCurrency(totalPrizePayouts)}</span>
            </div>

            {/* Profit margin */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-bold text-slate-900">Net Platform Profit</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-base font-bold text-emerald-600">{formatCurrency(netPlatformProfit)}</span>
                <p className="text-[10px] text-slate-400">Excluding winner payouts reserves</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('reports')}
            className="w-full text-center py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition duration-150 flex items-center justify-center gap-2"
          >
            <span>View Comprehensive Reports & Exports</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Recent Ledger Entries */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display text-lg font-bold text-slate-900">Recent Ledger Transactions</h3>
              <button 
                onClick={() => onNavigate('users')}
                className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center gap-1"
              >
                <span>Full Ledger</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
            <p className="text-xs text-slate-500">Audit trail of final financial transactions and commission releases.</p>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium">
                  <th className="py-2.5">TX ID</th>
                  <th className="py-2.5">Type</th>
                  <th className="py-2.5">Parties</th>
                  <th className="py-2.5 text-right">Amount</th>
                  <th className="py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="text-slate-700 hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-mono text-slate-400">{tx.id}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium font-sans ${
                        tx.type === 'ticket_purchase' ? 'bg-blue-50 text-blue-700' :
                        tx.type === 'prize_payout' ? 'bg-emerald-50 text-emerald-700' :
                        tx.type === 'agent_commission' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {tx.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">{tx.senderName}</span>
                        <span className="text-[10px] text-slate-400">→ {tx.receiverName}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-mono font-medium text-slate-900">
                      {tx.type === 'withdrawal' || tx.type === 'prize_payout' || tx.type === 'agent_commission' ? '-' : ''}
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                        tx.status === 'completed' ? 'text-emerald-600' :
                        tx.status === 'pending' ? 'text-amber-500 animate-pulse' :
                        'text-red-500'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
