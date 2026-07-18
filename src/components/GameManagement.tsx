import React, { useState } from 'react';
import { Game } from '../types';
import { Gamepad2, Play, Clock, Edit3, Settings, DollarSign, Award, Plus, Trash2, Calendar, RefreshCw, CheckCircle2 } from 'lucide-react';

interface GameManagementProps {
  games: Game[];
  onUpdateGame: (gameId: string, updates: Partial<Game>) => void;
  onForceDraw: (gameId: string) => void;
  onAddGame: (game: Omit<Game, 'id'>) => void;
}

export default function GameManagement({
  games,
  onUpdateGame,
  onForceDraw,
  onAddGame
}: GameManagementProps) {
  // Solo editing states
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  
  // Universal scheduler state
  const [universalStart, setUniversalStart] = useState('08:00');
  const [universalEnd, setUniversalEnd] = useState('23:00');
  const [universalInterval, setUniversalInterval] = useState(15);
  const [universalPrice, setUniversalPrice] = useState(5.00);
  const [showUniversalToast, setShowUniversalToast] = useState(false);

  // New Game Builder
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<Game['category']>('Mega Spin');
  const [newPrice, setNewPrice] = useState(2.00);
  const [newInterval, setNewInterval] = useState(15);
  const [newStart, setNewStart] = useState('09:00');
  const [newEnd, setNewEnd] = useState('21:00');

  // Apply universal scheduler to all active games
  const handleApplyUniversalSettings = () => {
    games.forEach(g => {
      onUpdateGame(g.id, {
        universalStart,
        universalEnd,
        intervalMinutes: Number(universalInterval),
        ticketPrice: Number(universalPrice)
      });
    });
    setShowUniversalToast(true);
    setTimeout(() => setShowUniversalToast(false), 4000);
  };

  const handleEditGameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame) return;
    onUpdateGame(editingGame.id, {
      name: editingGame.name,
      ticketPrice: Number(editingGame.ticketPrice),
      status: editingGame.status,
      universalStart: editingGame.universalStart,
      universalEnd: editingGame.universalEnd,
      intervalMinutes: Number(editingGame.intervalMinutes),
      prizeRules: editingGame.prizeRules
    });
    setEditingGame(null);
  };

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    onAddGame({
      name: newName,
      category: newCategory,
      ticketPrice: Number(newPrice),
      status: 'active',
      universalStart: newStart,
      universalEnd: newEnd,
      intervalMinutes: Number(newInterval),
      prizeRules: [
        { rank: 1, name: 'Jackpot', percentage: 70 },
        { rank: 2, name: 'Runner Up', percentage: 30 }
      ],
      lastDrawTime: '--:--',
      nextDrawTime: newStart
    });
    setNewName('');
    setNewPrice(2.00);
    setNewInterval(15);
    setIsAddOpen(false);
  };

  // Add a prize rule during editing
  const handleAddPrizeRule = () => {
    if (!editingGame) return;
    const nextRank = editingGame.prizeRules.length + 1;
    const updatedRules = [
      ...editingGame.prizeRules,
      { rank: nextRank, name: `Tier ${nextRank} Prize`, percentage: 10 }
    ];
    setEditingGame({ ...editingGame, prizeRules: updatedRules });
  };

  // Delete a prize rule during editing
  const handleRemovePrizeRule = (index: number) => {
    if (!editingGame) return;
    const updatedRules = editingGame.prizeRules.filter((_, idx) => idx !== index)
      .map((rule, idx) => ({ ...rule, rank: idx + 1 }));
    setEditingGame({ ...editingGame, prizeRules: updatedRules });
  };

  // Update specific prize rule details
  const handleUpdatePrizeRule = (index: number, key: 'name' | 'percentage', value: any) => {
    if (!editingGame) return;
    const updatedRules = [...editingGame.prizeRules];
    updatedRules[index] = {
      ...updatedRules[index],
      [key]: key === 'percentage' ? Number(value) : value
    };
    setEditingGame({ ...editingGame, prizeRules: updatedRules });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">Game Controls & Schedules</h2>
          <p className="text-xs text-slate-500 mt-1">Configure individual ticket prices, prize distribution matrices, and global chronometers.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition duration-150 flex items-center justify-center gap-2 self-start"
        >
          <Plus size={16} />
          <span>Provision New Spin Game</span>
        </button>
      </div>

      {/* UNIVERSAL GAME TIME MANAGEMENT & PRICE PANEL */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50/30 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-2 mb-4">
          <Settings size={18} className="text-indigo-600" />
          <h3 className="font-display text-base font-bold text-slate-900">Universal Draw Schedulers (Global Command)</h3>
        </div>
        <p className="text-xs text-slate-500 mb-6 max-w-2xl">
          Instantly cascade start/end hours, uniform raffle intervals, and default pricing variables across the entire active fleet of games.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Clock size={12} />
              <span>Universal Start Hour</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 08:00"
              value={universalStart}
              onChange={(e) => setUniversalStart(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-300 rounded-xl py-2 px-3 text-xs font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Clock size={12} />
              <span>Universal End Hour</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 23:00"
              value={universalEnd}
              onChange={(e) => setUniversalEnd(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-300 rounded-xl py-2 px-3 text-xs font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <RefreshCw size={12} />
              <span>Universal Draw Cadence (Min)</span>
            </label>
            <input
              type="number"
              min="1"
              value={universalInterval}
              onChange={(e) => setUniversalInterval(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-300 rounded-xl py-2 px-3 text-xs font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <DollarSign size={12} />
              <span>Universal Ticket Price ($)</span>
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={universalPrice}
              onChange={(e) => setUniversalPrice(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-300 rounded-xl py-2 px-3 text-xs font-mono focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleApplyUniversalSettings}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition duration-150 flex items-center gap-2"
          >
            <RefreshCw size={14} />
            <span>Cascade Schedules & Price to All Games</span>
          </button>

          {showUniversalToast && (
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 px-3.5 py-1.5 rounded-xl text-xs font-semibold animate-fade-in animate-pulse">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Universal settings successfully cascaded across all games!</span>
            </div>
          )}
        </div>
      </div>

      {/* INDIVIDUAL GAMES DIRECTORY (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => (
          <div key={game.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between">
            <div className="p-6 border-b border-slate-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <Gamepad2 size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{game.category}</span>
                    <h4 className="font-display text-base font-bold text-slate-900 leading-tight">{game.name}</h4>
                  </div>
                </div>
                <button
                  onClick={() => onUpdateGame(game.id, { status: game.status === 'active' ? 'inactive' : 'active' })}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                    game.status === 'active' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {game.status === 'active' ? '● Active' : '○ Inactive'}
                </button>
              </div>

              {/* Grid properties */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-50 my-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block mb-0.5">Ticket Price</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{formatCurrency(game.ticketPrice)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block mb-0.5">Schedule Slot</span>
                  <span className="font-mono text-slate-700">{game.universalStart} - {game.universalEnd}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block mb-0.5">Interval Time</span>
                  <span className="font-mono text-slate-700">{game.intervalMinutes} mins</span>
                </div>
              </div>

              {/* Prize matrix summary */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Payout Rules</span>
                <div className="flex flex-wrap gap-2">
                  {game.prizeRules.map((rule, idx) => (
                    <span key={idx} className="bg-slate-50 border border-slate-100 text-slate-600 rounded-lg px-2 py-1 text-[10px] font-medium flex items-center gap-1.5 font-sans">
                      <Award size={10} className="text-amber-500" />
                      <span>{rule.name}:</span>
                      <strong className="text-slate-950 font-mono">{rule.percentage}%</strong>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-between gap-4">
              <button
                onClick={() => setEditingGame(game)}
                className="text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Edit3 size={14} />
                <span>Configure Solo</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(`Do you want to manually force immediate spin draw for "${game.name}"? This generates simulated winners and deposits payouts.`)) {
                    onForceDraw(game.id);
                  }
                }}
                disabled={game.status !== 'active'}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition duration-150 ${
                  game.status === 'active' 
                    ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Play size={12} fill="currentColor" />
                <span>Force Draw Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SOLO GAME BUILDER MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-display text-lg font-bold text-slate-900">Provision New Spin Game Model</h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400">
                <Clock size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateGame} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1">Game Display Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mega Fortune Spin"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1">Spin Category</label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                >
                  <option value="Mega Spin">Mega Spin</option>
                  <option value="Classic Wheel">Classic Golden Wheel</option>
                  <option value="Lucky Draw">Lucky Draw</option>
                  <option value="VIP Wheel">VIP Elite Wheel</option>
                  <option value="Dice Roll">Dice Roll</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Ticket Entry Cost ($)</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.01"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Interval Duration (Min)</label>
                  <input
                    type="number"
                    min="1"
                    value={newInterval}
                    onChange={(e) => setNewInterval(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Schedule Start</label>
                  <input
                    type="text"
                    required
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Schedule End</label>
                  <input
                    type="text"
                    required
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
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
                  Build Game Mode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SOLO DETAILED EDITING SLIDE-OUT MODAL */}
      {editingGame && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">Configure Solo: {editingGame.name}</h3>
                <p className="text-[10px] text-slate-400 uppercase font-mono">Game ID: {editingGame.id}</p>
              </div>
              <button 
                onClick={() => setEditingGame(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 transition"
              >
                <Settings size={18} />
              </button>
            </div>

            <form onSubmit={handleEditGameSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Basic configuration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Game Display Title</label>
                  <input
                    type="text"
                    required
                    value={editingGame.name}
                    onChange={(e) => setEditingGame({ ...editingGame, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Status Status</label>
                  <select
                    value={editingGame.status}
                    onChange={(e: any) => setEditingGame({ ...editingGame, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700 text-slate-700 font-semibold"
                  >
                    <option value="active">Active (On Schedule)</option>
                    <option value="inactive">Inactive (Suspended)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Price ($)</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.01"
                    value={editingGame.ticketPrice}
                    onChange={(e) => setEditingGame({ ...editingGame, ticketPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Interval (Min)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingGame.intervalMinutes}
                    onChange={(e) => setEditingGame({ ...editingGame, intervalMinutes: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Draws Left Time</label>
                  <input
                    type="text"
                    disabled
                    value={editingGame.nextDrawTime}
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Active Hour Start</label>
                  <input
                    type="text"
                    required
                    value={editingGame.universalStart}
                    onChange={(e) => setEditingGame({ ...editingGame, universalStart: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Active Hour End</label>
                  <input
                    type="text"
                    required
                    value={editingGame.universalEnd}
                    onChange={(e) => setEditingGame({ ...editingGame, universalEnd: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                  />
                </div>
              </div>

              {/* PRIZE RULES MATRIX */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Award size={14} className="text-indigo-600" />
                    <span>Configure Prize Pool Allocation</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddPrizeRule}
                    className="text-indigo-600 hover:text-indigo-800 text-[10px] font-bold flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>Add Tier</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mb-4">
                  Define reward shares of the generated round prize pool. Percentages should ideally total 100%.
                </p>

                <div className="space-y-3">
                  {editingGame.prizeRules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="w-5 h-5 rounded bg-slate-200 flex items-center justify-center font-mono text-[10px] font-bold text-slate-600">
                        #{rule.rank}
                      </div>
                      <input
                        type="text"
                        required
                        value={rule.name}
                        placeholder="Prize Tier Name"
                        onChange={(e) => handleUpdatePrizeRule(idx, 'name', e.target.value)}
                        className="flex-1 bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs focus:outline-none text-slate-700"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          required
                          min="1"
                          max="100"
                          value={rule.percentage}
                          placeholder="%"
                          onChange={(e) => handleUpdatePrizeRule(idx, 'percentage', e.target.value)}
                          className="w-14 bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs text-right font-mono focus:outline-none text-slate-700"
                        />
                        <span className="text-xs text-slate-400">%</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePrizeRule(idx)}
                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-3.5 flex items-center justify-between text-xs text-slate-500 font-mono font-semibold bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-50">
                  <span>Cumulative Split Ratio:</span>
                  <span className={editingGame.prizeRules.reduce((s, r) => s + r.percentage, 0) === 100 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                    {editingGame.prizeRules.reduce((s, r) => s + r.percentage, 0)}%
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingGame(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition"
                >
                  Save solo edits
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
