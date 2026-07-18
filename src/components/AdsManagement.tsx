import React, { useState } from 'react';
import { Megaphone, Plus, Trash2, Edit2, Link, Globe, Layout, CheckCircle, HelpCircle, X, BarChart3 } from 'lucide-react';
import { Advertisement } from '../types';

interface AdsManagementProps {
  advertisements: Advertisement[];
  onAddAd: (ad: Omit<Advertisement, 'id' | 'impressions' | 'clicks' | 'createdAt'>) => void;
  onUpdateAd: (adId: string, updates: Partial<Advertisement>) => void;
  onDeleteAd: (adId: string) => void;
}

const PRESET_BGS = [
  { value: 'from-amber-500 to-orange-600', label: 'Warm Orange Gradient' },
  { value: 'from-blue-600 to-indigo-700', label: 'Tech Indigo Gradient' },
  { value: 'from-purple-600 to-fuchsia-800', label: 'VIP Purple Gradient' },
  { value: 'from-emerald-500 to-teal-600', label: 'Success Teal Gradient' },
  { value: 'from-rose-500 to-pink-600', label: 'Bold Rose Gradient' }
];

export default function AdsManagement({
  advertisements,
  onAddAd,
  onUpdateAd,
  onDeleteAd
}: AdsManagementProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bannerBg, setBannerBg] = useState('from-blue-600 to-indigo-700');
  const [link, setLink] = useState('https://spingame.com/promo');
  const [position, setPosition] = useState<Advertisement['position']>('home');

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    onAddAd({
      title,
      description,
      bannerBg,
      link,
      position,
      status: 'active'
    });
    setTitle('');
    setDescription('');
    setLink('https://spingame.com/promo');
    setBannerBg('from-blue-600 to-indigo-700');
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAd) return;
    onUpdateAd(editingAd.id, {
      title: editingAd.title,
      description: editingAd.description,
      bannerBg: editingAd.bannerBg,
      link: editingAd.link,
      position: editingAd.position,
      status: editingAd.status
    });
    setEditingAd(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">Advertisement Center</h2>
          <p className="text-xs text-slate-500 mt-1">Post, edit, and target promotions on users dashboard margins and main spin layouts.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition duration-150 flex items-center justify-center gap-2 self-start"
        >
          <Plus size={16} />
          <span>Post New Promotion</span>
        </button>
      </div>

      {/* Directory of Advertisements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {advertisements.map((ad) => {
          const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : '0.0';
          
          return (
            <div key={ad.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between">
              
              {/* Actual Banner Rendering preview */}
              <div className={`p-6 bg-gradient-to-r ${ad.bannerBg} text-white relative`}>
                <div className="absolute right-3 top-3 bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold">
                  {ad.position} banner
                </div>
                
                <div className="max-w-[80%]">
                  <span className="text-[10px] font-bold tracking-widest uppercase opacity-75">SPONSORED PROMO</span>
                  <h3 className="font-display text-lg font-bold mt-1.5 leading-snug">{ad.title}</h3>
                  <p className="text-xs mt-1.5 opacity-90 font-light line-clamp-2">{ad.description}</p>
                </div>

                <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold opacity-95">
                  <Link size={12} />
                  <a href={ad.link} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">
                    {ad.link.replace('https://', '')}
                  </a>
                </div>
              </div>

              {/* Analytics & Configuration Bar */}
              <div className="p-5 space-y-4">
                {/* Performance stats */}
                <div className="grid grid-cols-3 gap-2 text-xs border-b border-slate-50 pb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Total Impressions</span>
                    <span className="font-mono font-bold text-slate-900">{ad.impressions.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Ad Clickthroughs</span>
                    <span className="font-mono font-bold text-slate-900">{ad.clicks.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Performance Rate</span>
                    <span className="font-mono font-bold text-emerald-600 flex items-center gap-0.5">
                      <BarChart3 size={11} />
                      <span>{ctr}% CTR</span>
                    </span>
                  </div>
                </div>

                {/* Status Toggle & Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-medium">Status:</span>
                    <button
                      onClick={() => onUpdateAd(ad.id, { status: ad.status === 'active' ? 'inactive' : 'active' })}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        ad.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {ad.status === 'active' ? '● Active' : '○ Disabled'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingAd(ad)}
                      className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-950 transition"
                      title="Edit Promotional Copy & Style"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Permanently delete this advertisement copy?')) {
                          onDeleteAd(ad.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-50 text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                      title="Delete Campaign"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* NEW PROMOTION CREATION MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-display text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <Megaphone size={18} className="text-indigo-600" />
                <span>Post Promotional Campaign</span>
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1.5 rounded-lg text-slate-400">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmitNew} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1">Headline Banner Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Weekend Triple Multiplier!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1">Short Campaign Copy Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Keep it compelling, highlighting jackpots, signups, or bonus rates..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1">Action Link URL</label>
                <input
                  type="url"
                  required
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Display Placement</label>
                  <select
                    value={position}
                    onChange={(e: any) => setPosition(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                  >
                    <option value="home">Dashboard Home Banner</option>
                    <option value="game_screen">Game Canvas Margin</option>
                    <option value="sidebar">Right Navigation Rail</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Aesthetic Palette</label>
                  <select
                    value={bannerBg}
                    onChange={(e) => setBannerBg(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                  >
                    {PRESET_BGS.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
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
                  Post & Activate Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CAMPAIGN MODAL */}
      {editingAd && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-display text-lg font-bold text-slate-900">Modify Campaign Copy</h3>
              <button onClick={() => setEditingAd(null)} className="p-1.5 rounded-lg text-slate-400">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1">Headline Banner Title</label>
                <input
                  type="text"
                  required
                  value={editingAd.title}
                  onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1">Campaign Description Copy</label>
                <textarea
                  required
                  rows={2}
                  value={editingAd.description}
                  onChange={(e) => setEditingAd({ ...editingAd, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 font-medium mb-1">Action Link URL</label>
                <input
                  type="url"
                  required
                  value={editingAd.link}
                  onChange={(e) => setEditingAd({ ...editingAd, link: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-indigo-400 text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Display Placement</label>
                  <select
                    value={editingAd.position}
                    onChange={(e: any) => setEditingAd({ ...editingAd, position: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                  >
                    <option value="home">Dashboard Home Banner</option>
                    <option value="game_screen">Game Canvas Margin</option>
                    <option value="sidebar">Right Navigation Rail</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 font-medium mb-1">Aesthetic Palette</label>
                  <select
                    value={editingAd.bannerBg}
                    onChange={(e) => setEditingAd({ ...editingAd, bannerBg: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-400 text-slate-700"
                  >
                    {PRESET_BGS.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingAd(null)}
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
