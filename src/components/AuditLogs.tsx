import React, { useState, useMemo } from 'react';
import { Search, Filter, ShieldAlert, Clock, RefreshCw, Layers } from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogsProps {
  logs: AuditLog[];
}

export default function AuditLogs({ logs }: AuditLogsProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'SYSTEM' | 'USER_MANAGEMENT' | 'AGENT' | 'GAME' | 'ADS'>('all');

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) ||
                            log.details.toLowerCase().includes(search.toLowerCase()) ||
                            log.adminName.toLowerCase().includes(search.toLowerCase()) ||
                            log.id.toLowerCase().includes(search.toLowerCase());
      
      let matchesCategory = true;
      if (categoryFilter !== 'all') {
        if (categoryFilter === 'SYSTEM') {
          matchesCategory = log.action.includes('SYSTEM') || log.action.includes('AUTO_DRAW');
        } else if (categoryFilter === 'USER_MANAGEMENT') {
          matchesCategory = log.action.includes('USER') || log.action.includes('BLOCK_USER');
        } else if (categoryFilter === 'AGENT') {
          matchesCategory = log.action.includes('AGENT');
        } else if (categoryFilter === 'GAME') {
          matchesCategory = log.action.includes('PRICE') || log.action.includes('SCHEDULE') || log.action.includes('DRAW');
        } else if (categoryFilter === 'ADS') {
          matchesCategory = log.action.includes('AD');
        }
      }
      return matchesSearch && matchesCategory;
    }).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [logs, search, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">Security Audit Logs</h2>
        <p className="text-xs text-slate-500 mt-1">Immutable administrative ledger of configuration modifications, draw completions, and authorization releases.</p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search audit trail by administrator, IP, or keyword details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs font-sans text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-300 transition"
          />
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap items-center gap-1.5 self-start lg:self-auto">
          <span className="text-xs text-slate-400 font-medium mr-1">Activity Scope:</span>
          <div className="flex bg-slate-50 border border-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1 rounded-md transition ${categoryFilter === 'all' ? 'bg-white text-indigo-600 shadow-xs' : 'hover:bg-slate-100'}`}
            >
              All Events
            </button>
            <button
              onClick={() => setCategoryFilter('SYSTEM')}
              className={`px-3 py-1 rounded-md transition ${categoryFilter === 'SYSTEM' ? 'bg-white text-indigo-600 shadow-xs' : 'hover:bg-slate-100'}`}
            >
              Core System
            </button>
            <button
              onClick={() => setCategoryFilter('USER_MANAGEMENT')}
              className={`px-3 py-1 rounded-md transition ${categoryFilter === 'USER_MANAGEMENT' ? 'bg-white text-indigo-600 shadow-xs' : 'hover:bg-slate-100'}`}
            >
              Users
            </button>
            <button
              onClick={() => setCategoryFilter('AGENT')}
              className={`px-3 py-1 rounded-md transition ${categoryFilter === 'AGENT' ? 'bg-white text-indigo-600 shadow-xs' : 'hover:bg-slate-100'}`}
            >
              Agents
            </button>
            <button
              onClick={() => setCategoryFilter('GAME')}
              className={`px-3 py-1 rounded-md transition ${categoryFilter === 'GAME' ? 'bg-white text-indigo-600 shadow-xs' : 'hover:bg-slate-100'}`}
            >
              Game Modes
            </button>
          </div>
        </div>
      </div>

      {/* Ledger Log entries */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => {
              const isAuto = log.action.includes('AUTO_') || log.adminName.includes('System');
              
              return (
                <div key={log.id} className="p-5 hover:bg-slate-50/50 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-sans">
                  
                  {/* Left block: details & action */}
                  <div className="space-y-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold ${
                        log.action.includes('BOOT') || log.action.includes('SYSTEM') ? 'bg-slate-100 text-slate-700' :
                        log.action.includes('AUTO_DRAW') ? 'bg-violet-50 text-violet-700 font-sans font-semibold' :
                        log.action.includes('AGENT') ? 'bg-amber-50 text-amber-700 font-sans font-semibold' :
                        log.action.includes('USER') || log.action.includes('BLOCK') ? 'bg-blue-50 text-blue-700 font-sans font-semibold' :
                        'bg-indigo-50 text-indigo-700 font-sans font-semibold'
                      }`}>
                        {log.action}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{log.id}</span>
                      <span className="text-[10px] text-slate-400">•</span>
                      <span className="font-medium text-slate-700">{log.adminName}</span>
                    </div>

                    <p className="text-slate-800 text-sm font-light mt-1.5 leading-relaxed">{log.details}</p>
                  </div>

                  {/* Right block: timestamp & IP Address */}
                  <div className="text-right shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t border-slate-50 sm:border-0 pt-2 sm:pt-0">
                    <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
                      <Clock size={12} />
                      <span>{log.timestamp}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md mt-0.5">
                      IP: {log.ipAddress}
                    </span>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-slate-400 font-medium">
              No administrative logs recorded in this activity scope.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
