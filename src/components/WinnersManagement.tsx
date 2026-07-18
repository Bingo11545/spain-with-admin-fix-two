import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Award, Check, Search, Filter, Sparkles, AlertCircle } from 'lucide-react';
import { Winner } from '../types';

interface WinnersManagementProps {
  winners: Winner[];
  onToggleClaimed: (winnerId: string) => void;
}

const CATEGORY_COLORS = {
  'Mega Spin': '#6366f1', // Indigo
  'Classic Wheel': '#10b981', // Emerald
  'Lucky Draw': '#f59e0b', // Amber
  'VIP Wheel': '#8b5cf6', // Violet
  'Dice Roll': '#ec4899'  // Pink
};

export default function WinnersManagement({
  winners,
  onToggleClaimed
}: WinnersManagementProps) {
  // Search & Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [claimFilter, setClaimFilter] = useState<'all' | 'claimed' | 'unclaimed'>('all');

  // Compute distribution data for the recharts chart
  const distributionData = useMemo(() => {
    const categories = ['Mega Spin', 'Classic Wheel', 'Lucky Draw', 'VIP Wheel', 'Dice Roll'];
    
    return categories.map(cat => {
      const catWinners = winners.filter(w => w.gameCategory === cat || w.gameName.includes(cat));
      const totalAmount = catWinners.reduce((sum, w) => sum + w.amount, 0);
      
      return {
        categoryName: cat,
        frequency: catWinners.length,
        totalPayout: totalAmount
      };
    });
  }, [winners]);

  // Filtered winners table list
  const filteredWinners = useMemo(() => {
    return winners.filter(w => {
      const matchesSearch = w.userName.toLowerCase().includes(search.toLowerCase()) ||
                            w.id.toLowerCase().includes(search.toLowerCase()) ||
                            w.ticketId.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || 
                              w.gameCategory === categoryFilter || 
                              w.gameName.includes(categoryFilter);
      
      const matchesClaim = claimFilter === 'all' || 
                           (claimFilter === 'claimed' && w.claimed) || 
                           (claimFilter === 'unclaimed' && !w.claimed);
      
      return matchesSearch && matchesCategory && matchesClaim;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [winners, search, categoryFilter, claimFilter]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">Prize Winners & Payout Distribution</h2>
        <p className="text-xs text-slate-500 mt-1">
          Monitor lucky players, track payout disbursements, and analyze game-by-game reward frequencies.
        </p>
      </div>

      {/* RECHARTS PRIZE PAYOUTS DISTRIBUTION CHART */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 id="winners-distribution-title" className="font-display text-base font-bold text-slate-950">
              Prize Payouts Frequency & Value by Category
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Frequency counts (bar height) alongside aggregate payout values ($) awarded to players in each draw category.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-[10px] font-mono">
            {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
              <div key={cat} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                <span className="text-slate-600">{cat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={distributionData}
              margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
              <XAxis 
                dataKey="categoryName" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter' }} 
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                tickFormatter={(v) => `${v} wins`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-4 border border-slate-100 rounded-xl shadow-lg text-xs space-y-1.5">
                        <p className="font-bold text-slate-900 font-display">{data.categoryName}</p>
                        <p className="text-slate-500 flex justify-between gap-6">
                          <span>Total Rounds Won:</span> 
                          <span className="font-mono font-bold text-slate-900">{data.frequency}</span>
                        </p>
                        <p className="text-slate-500 flex justify-between gap-6">
                          <span>Cumulative Payout:</span> 
                          <span className="font-mono font-bold text-emerald-600">{formatCurrency(data.totalPayout)}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="frequency" 
                radius={[6, 6, 0, 0]}
                maxBarSize={55}
              >
                {distributionData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CATEGORY_COLORS[entry.categoryName as keyof typeof CATEGORY_COLORS] || '#6366f1'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLE FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search winners by player name, ID, or ticket code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs font-sans text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-300 transition"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <Filter size={14} className="text-slate-400" />
            <span className="text-slate-400 font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-100 p-1.5 rounded-lg text-slate-600 font-semibold focus:outline-none"
            >
              <option value="all">All Spin Games</option>
              <option value="Mega Spin">Mega Spin</option>
              <option value="Classic Wheel">Classic Golden Wheel</option>
              <option value="Lucky Draw">Lucky Draw Extravaganza</option>
              <option value="VIP Wheel">VIP Elite Wheel</option>
              <option value="Dice Roll">Dice Roll</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Status:</span>
            <div className="flex bg-slate-50 border border-slate-100 p-0.5 rounded-lg font-semibold text-slate-600">
              <button
                onClick={() => setClaimFilter('all')}
                className={`px-2.5 py-1 rounded-md transition ${claimFilter === 'all' ? 'bg-white text-indigo-600 shadow-xs' : 'hover:bg-slate-100'}`}
              >
                All
              </button>
              <button
                onClick={() => setClaimFilter('claimed')}
                className={`px-2.5 py-1 rounded-md transition ${claimFilter === 'claimed' ? 'bg-white text-emerald-600 shadow-xs' : 'hover:bg-slate-100'}`}
              >
                Claimed
              </button>
              <button
                onClick={() => setClaimFilter('unclaimed')}
                className={`px-2.5 py-1 rounded-md transition ${claimFilter === 'unclaimed' ? 'bg-white text-amber-600 shadow-xs' : 'hover:bg-slate-100'}`}
              >
                Unclaimed
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* WINNERS LEDGER TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Winner ID / Ticket</th>
                <th className="px-6 py-4">Player</th>
                <th className="px-6 py-4">Game & Payout Pool</th>
                <th className="px-6 py-4 text-right">Prize Amount</th>
                <th className="px-6 py-4">Draw Timestamp</th>
                <th className="px-6 py-4 text-center">Disbursed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredWinners.length > 0 ? (
                filteredWinners.map((winner) => (
                  <tr key={winner.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{winner.id}</span>
                        <span className="text-[10px] text-slate-400">Code: {winner.ticketId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                          {winner.userName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-950">{winner.userName}</span>
                          <span className="text-[9px] font-mono text-slate-400">{winner.userId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">{winner.gameName}</span>
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono mt-0.5">
                          <span className="px-1 bg-slate-100 text-slate-500 rounded font-sans">{winner.gameCategory}</span>
                          <span>•</span>
                          <span>{winner.prizeName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-extrabold text-emerald-600 text-sm">
                      {formatCurrency(winner.amount)}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {winner.date}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onToggleClaimed(winner.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-bold transition-colors ${
                          winner.claimed 
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                        title={winner.claimed ? 'Mark as Unclaimed' : 'Disburse Prize to Wallet'}
                      >
                        {winner.claimed ? (
                          <>
                            <Check size={12} className="stroke-[3px]" />
                            <span>Wallet Credited</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle size={12} />
                            <span>Claim Pending</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No prize winners recorded inside this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
