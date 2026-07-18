import React, { useState } from 'react';
import { FileSpreadsheet, Download, FileText, ChevronRight, PieChart, Landmark, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { User, Agent, Game, Transaction, Winner } from '../types';

interface ReportsSectionProps {
  users: User[];
  agents: Agent[];
  games: Game[];
  transactions: Transaction[];
  winners: Winner[];
}

export default function ReportsSection({
  users,
  agents,
  games,
  transactions,
  winners
}: ReportsSectionProps) {
  const [exportType, setExportType] = useState<'csv' | 'pdf'>('csv');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Computations
  const ticketSalesAmount = transactions
    .filter(t => t.type === 'ticket_purchase' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const agentCommissions = transactions
    .filter(t => t.type === 'agent_commission' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPrizePayouts = winners
    .reduce((sum, w) => sum + w.amount, 0);

  const netPlatformProfit = ticketSalesAmount - agentCommissions;

  // Calculate game popularity metrics
  const gameStats = games.map(game => {
    // Tickets bought count
    const tcksCount = transactions.filter(t => t.type === 'ticket_purchase' && t.receiverName === game.name).length;
    const grossRev = tcksCount * game.ticketPrice;
    const gameWinners = winners.filter(w => w.gameName === game.name);
    const payoutPool = gameWinners.reduce((sum, w) => sum + w.amount, 0);

    return {
      name: game.name,
      category: game.category,
      payoutRate: grossRev > 0 ? ((payoutPool / grossRev) * 100).toFixed(1) : '0.0',
      totalTicketsSold: tcksCount,
      revenueGenerated: grossRev,
      payoutPool: payoutPool
    };
  }).sort((a, b) => b.revenueGenerated - a.revenueGenerated);

  // Download simulation
  const handleDownload = (type: 'revenue' | 'games' | 'agents' | 'winners', format: 'csv' | 'txt') => {
    let content = '';
    let filename = '';

    if (type === 'revenue') {
      filename = `spingame_financials_report.${format}`;
      if (format === 'csv') {
        content = `Metric,Value ($)\n`;
        content += `Gross Ticket Sales,${ticketSalesAmount}\n`;
        content += `Agent Commissions Disbursed,${agentCommissions}\n`;
        content += `Platform Prize Payouts,${totalPrizePayouts}\n`;
        content += `Net Platform Profit,${netPlatformProfit}\n`;
        content += `Active Players,${users.length}\n`;
        content += `Approved Agents,${agents.filter(a => a.status === 'approved').length}\n`;
      } else {
        content = `SPINGAME FINANCIAL TELEMETRY SUMMARY REPORT\n`;
        content += `=========================================\n\n`;
        content += `Gross Ticket Sales: $${ticketSalesAmount.toFixed(2)}\n`;
        content += `Agent Commissions Disbursed: $${agentCommissions.toFixed(2)}\n`;
        content += `Platform Prize Payouts: $${totalPrizePayouts.toFixed(2)}\n`;
        content += `Net Platform Profit: $${netPlatformProfit.toFixed(2)}\n\n`;
        content += `Platform Player Density: ${users.length} active players\n`;
      }
    } else if (type === 'games') {
      filename = `spingame_modes_statistics.${format}`;
      content = `Game Name,Category,Tickets Sold,Revenue ($),Payout pool ($),Payout Rate (%)\n`;
      gameStats.forEach(g => {
        content += `"${g.name}",${g.category},${g.totalTicketsSold},${g.revenueGenerated},${g.payoutPool},${g.payoutRate}%\n`;
      });
    } else if (type === 'agents') {
      filename = `spingame_agents_yield.${format}`;
      content = `Agent ID,Name,Region,Wallet Balance ($),Split Rate (%)\n`;
      agents.forEach(a => {
        content += `${a.id},"${a.name}",${a.region},${a.balance},${a.revenueShare}%\n`;
      });
    } else {
      filename = `spingame_prizes_ledger.${format}`;
      content = `Winner ID,Player Name,Game Category,Prize Pool,Disbursed Amount ($),Claimed\n`;
      winners.forEach(w => {
        content += `${w.id},"${w.userName}",${w.gameCategory},"${w.prizeName}",${w.amount},${w.claimed}\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMsg(`Successfully generated and downloaded ${filename}!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">Analytical Telemetry & Reports</h2>
        <p className="text-xs text-slate-500 mt-1">Generate multi-dimensional business reports, inspect game payout percentages, and audit regional agent yield.</p>
      </div>

      {/* Top breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-start gap-4 shadow-3xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Landmark size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Aggregate Ledger Volume</span>
            <h4 className="font-display text-xl font-bold text-slate-950 mt-1">{formatCurrency(ticketSalesAmount + agentCommissions)}</h4>
            <p className="text-[10px] text-slate-500 mt-1">Sum of combined tickets bought & agent splits credited</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-start gap-4 shadow-3xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Platform Profit Ratio</span>
            <h4 className="font-display text-xl font-bold text-slate-950 mt-1">
              {ticketSalesAmount > 0 ? ((netPlatformProfit / ticketSalesAmount) * 100).toFixed(1) : '0.0'}%
            </h4>
            <p className="text-[10px] text-slate-500 mt-1">Excluding prize payout reserves</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-start gap-4 shadow-3xs">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <PieChart size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Prize Disbursed</span>
            <h4 className="font-display text-xl font-bold text-slate-950 mt-1">{formatCurrency(totalPrizePayouts)}</h4>
            <p className="text-[10px] text-slate-500 mt-1">Total value claimable by lucky ticket holders</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Game popularity list & Report Downloaders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Game Mode telemetry popularity list */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs lg:col-span-8">
          <h3 className="font-display text-base font-bold text-slate-950 mb-1">Game Performance Indicators (RTP Telemetry)</h3>
          <p className="text-xs text-slate-500 mb-4">RTP (Return To Player) rates, ticket conversions, and draw ratios calculated on final transactions.</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium">
                  <th className="py-2.5">Game Name</th>
                  <th className="py-2.5 text-right">Tickets Sold</th>
                  <th className="py-2.5 text-right">Gross Receipts</th>
                  <th className="py-2.5 text-right">Total Prizes</th>
                  <th className="py-2.5 text-right">RTP (Payout Rate)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {gameStats.map((game, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-semibold text-slate-900">{game.name}</td>
                    <td className="py-3 text-right font-mono text-slate-600">{game.totalTicketsSold} tickets</td>
                    <td className="py-3 text-right font-mono text-slate-900">{formatCurrency(game.revenueGenerated)}</td>
                    <td className="py-3 text-right font-mono text-slate-900">{formatCurrency(game.payoutPool)}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        Number(game.payoutRate) > 75 ? 'bg-amber-50 text-amber-700' :
                        Number(game.payoutRate) > 0 ? 'bg-emerald-50 text-emerald-700' :
                        'bg-slate-50 text-slate-400'
                      }`}>
                        {game.payoutRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action downloads card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-slate-950 mb-1">On-Demand Ledger Export</h3>
            <p className="text-xs text-slate-500">Choose a register dataset and instantly generate a real CSV or Text document containing the live simulated state.</p>
          </div>

          <div className="my-6 space-y-3.5">
            <button
              onClick={() => handleDownload('revenue', 'csv')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-300 hover:bg-slate-50 text-slate-700 hover:text-slate-950 transition text-xs font-semibold text-left group"
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet size={16} className="text-emerald-500" />
                <div>
                  <span>Full Financial Ledger</span>
                  <span className="block text-[10px] text-slate-400 font-light font-sans mt-0.5">Wallet audits, profit summaries</span>
                </div>
              </div>
              <Download size={14} className="text-slate-400 group-hover:text-indigo-600 transition" />
            </button>

            <button
              onClick={() => handleDownload('games', 'csv')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-300 hover:bg-slate-50 text-slate-700 hover:text-slate-950 transition text-xs font-semibold text-left group"
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet size={16} className="text-indigo-500" />
                <div>
                  <span>Game RTP Conversion Logs</span>
                  <span className="block text-[10px] text-slate-400 font-light font-sans mt-0.5">Game-by-game ticket sales, payout rates</span>
                </div>
              </div>
              <Download size={14} className="text-slate-400 group-hover:text-indigo-600 transition" />
            </button>

            <button
              onClick={() => handleDownload('agents', 'csv')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-300 hover:bg-slate-50 text-slate-700 hover:text-slate-950 transition text-xs font-semibold text-left group"
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet size={16} className="text-amber-500" />
                <div>
                  <span>Agent Network Commission Splits</span>
                  <span className="block text-[10px] text-slate-400 font-light font-sans mt-0.5">Approved agents, balances, regional rates</span>
                </div>
              </div>
              <Download size={14} className="text-slate-400 group-hover:text-indigo-600 transition" />
            </button>

            <button
              onClick={() => handleDownload('winners', 'csv')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-300 hover:bg-slate-50 text-slate-700 hover:text-slate-950 transition text-xs font-semibold text-left group"
            >
              <div className="flex items-center gap-2.5">
                <FileText size={16} className="text-violet-500" />
                <div>
                  <span>Prize Winners Audit Register</span>
                  <span className="block text-[10px] text-slate-400 font-light font-sans mt-0.5">Usernames, amounts, claim status codes</span>
                </div>
              </div>
              <Download size={14} className="text-slate-400 group-hover:text-indigo-600 transition" />
            </button>
          </div>

          {showToast && (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-100 p-3 rounded-xl text-xs font-semibold animate-fade-in mb-3">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-[10px] text-slate-400 font-medium font-mono text-center">
            REPORTS RECONCILED WITH CLIENT STATE
          </div>
        </div>

      </div>
    </div>
  );
}
