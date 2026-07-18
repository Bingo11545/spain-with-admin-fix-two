import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  ShieldAlert, 
  Gamepad2, 
  Award, 
  Megaphone, 
  MessageSquare, 
  BarChart3, 
  Layers, 
  LogOut, 
  Settings, 
  Bell, 
  CheckCircle2, 
  ShieldCheck,
  Clock
} from 'lucide-react';

import { 
  User, 
  Agent, 
  Game, 
  Transaction, 
  Winner, 
  Advertisement, 
  ChatSession, 
  AuditLog, 
  PerformanceDay, 
  SupportMessage 
} from './types';

import { 
  INITIAL_USERS, 
  INITIAL_AGENTS, 
  INITIAL_GAMES, 
  INITIAL_WINNERS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_ADS, 
  INITIAL_CHATS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_PERFORMANCE 
} from './data/mockData';

// Import our sub-components
import DashboardOverview from './components/DashboardOverview';
import UserManagement from './components/UserManagement';
import AgentManagement from './components/AgentManagement';
import GameManagement from './components/GameManagement';
import WinnersManagement from './components/WinnersManagement';
import AdsManagement from './components/AdsManagement';
import SupportManagement from './components/SupportManagement';
import ReportsSection from './components/ReportsSection';
import AuditLogs from './components/AuditLogs';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Core Data States
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('spin_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [agents, setAgents] = useState<Agent[]>(() => {
    const saved = localStorage.getItem('spin_agents');
    return saved ? JSON.parse(saved) : INITIAL_AGENTS;
  });

  const [games, setGames] = useState<Game[]>(() => {
    const saved = localStorage.getItem('spin_games');
    return saved ? JSON.parse(saved) : INITIAL_GAMES;
  });

  const [winners, setWinners] = useState<Winner[]>(() => {
    const saved = localStorage.getItem('spin_winners');
    return saved ? JSON.parse(saved) : INITIAL_WINNERS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('spin_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [advertisements, setAdvertisements] = useState<Advertisement[]>(() => {
    const saved = localStorage.getItem('spin_ads');
    return saved ? JSON.parse(saved) : INITIAL_ADS;
  });

  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('spin_chats');
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('spin_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [performanceData, setPerformanceData] = useState<PerformanceDay[]>(() => {
    const saved = localStorage.getItem('spin_performance');
    return saved ? JSON.parse(saved) : INITIAL_PERFORMANCE;
  });

  // Persist states to LocalStorage
  useEffect(() => {
    localStorage.setItem('spin_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('spin_agents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('spin_games', JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem('spin_winners', JSON.stringify(winners));
  }, [winners]);

  useEffect(() => {
    localStorage.setItem('spin_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('spin_ads', JSON.stringify(advertisements));
  }, [advertisements]);

  useEffect(() => {
    localStorage.setItem('spin_chats', JSON.stringify(chatSessions));
  }, [chatSessions]);

  useEffect(() => {
    localStorage.setItem('spin_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('spin_performance', JSON.stringify(performanceData));
  }, [performanceData]);

  // Global Helpers
  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      adminName: 'SuperAdmin (hailetadilo@gmail.com)',
      action,
      details,
      ipAddress: '192.168.1.104',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // State Mutators: Users
  const handleAddUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newId = `USR-${111 + users.length}`;
    const newUser: User = {
      ...user,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
    addAuditLog('USER_PROVISIONED', `Provisioned new player profile: ${user.name} (${user.email}) with initial wallet balance of $${user.balance}.`);
  };

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const merged = { ...u, ...updates };
        if (updates.status && updates.status !== u.status) {
          addAuditLog(updates.status === 'blocked' ? 'BLOCK_USER' : 'ACTIVATE_USER', `${updates.status === 'blocked' ? 'Blocked' : 'Activated'} player ${u.name} (${u.id}).`);
        } else {
          addAuditLog('USER_MUTATED', `Modified details/balance for player ${u.name} (${u.id}).`);
        }
        return merged;
      }
      return u;
    }));
  };

  const handleDeleteUser = (userId: string) => {
    const userObj = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    addAuditLog('USER_DELETED', `Deleted player record for ${userObj?.name || userId}.`);
  };

  // State Mutators: Agents
  const handleAddAgent = (agent: Omit<Agent, 'id' | 'createdAt'>) => {
    const newId = `AGT-${207 + agents.length}`;
    const newAgent: Agent = {
      ...agent,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAgents(prev => [...prev, newAgent]);
    addAuditLog('AGENT_ONBOARDED', `Onboarded new verified game agent: ${agent.name} (${agent.region}) at ${agent.revenueShare}% commission share.`);
  };

  const handleUpdateAgent = (agentId: string, updates: Partial<Agent>) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        const merged = { ...a, ...updates };
        if (updates.status && updates.status !== a.status) {
          addAuditLog(updates.status === 'approved' ? 'APPROVE_AGENT' : 'REJECT_AGENT', `${updates.status === 'approved' ? 'Approved' : 'Rejected'} Game Agent credentials for ${a.name} in region ${a.region}.`);
        } else {
          addAuditLog('AGENT_MUTATED', `Modified credentials or commission share for Agent ${a.name} (${a.id}).`);
        }
        return merged;
      }
      return a;
    }));
  };

  const handleDeleteAgent = (agentId: string) => {
    const agentObj = agents.find(a => a.id === agentId);
    setAgents(prev => prev.filter(a => a.id !== agentId));
    addAuditLog('AGENT_DELETED', `Revoked credentials and deleted Game Agent profile: ${agentObj?.name || agentId}.`);
  };

  // State Mutators: Games
  const handleAddGame = (game: Omit<Game, 'id'>) => {
    const newId = `GM-00${games.length + 1}`;
    const newGame: Game = {
      ...game,
      id: newId
    };
    setGames(prev => [...prev, newGame]);
    addAuditLog('GAME_CONFIG_CREATED', `Provisioned new spin game mode: "${game.name}" with base price $${game.ticketPrice}.`);
  };

  const handleUpdateGame = (gameId: string, updates: Partial<Game>) => {
    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        addAuditLog('GAME_CONFIG_UPDATED', `Modified configuration/schedule parameters for Game: "${g.name}" (${g.id}).`);
        return { ...g, ...updates };
      }
      return g;
    }));
  };

  // State Mutators: Transactions
  const handleAddTransaction = (tx: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newId = `TX-${4011 + transactions.length}`;
    const newTx: Transaction = {
      ...tx,
      id: newId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setTransactions(prev => [newTx, ...prev]);
    addAuditLog('LEDGER_POSTED', `Posted transaction entry ${newId}: $${tx.amount} (${tx.type}) credited/debited.`);

    // If it's a ticket purchase, update the last day in performance metrics trends!
    if (tx.type === 'ticket_purchase') {
      setPerformanceData(prev => {
        const copy = [...prev];
        if (copy.length > 0) {
          const lastIdx = copy.length - 1;
          copy[lastIdx] = {
            ...copy[lastIdx],
            ticketVolume: copy[lastIdx].ticketVolume + 1,
            revenue: copy[lastIdx].revenue + tx.amount
          };
        }
        return copy;
      });
    }
  };

  // Force Game Draw Simulator (Generates random winner, credits user, credits agent commission splits)
  const handleForceDraw = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    // Pick active user as winner
    const activeUsers = users.filter(u => u.status === 'active');
    if (activeUsers.length === 0) {
      alert('Cannot force draw: No active users exist to qualify as round winners!');
      return;
    }
    const chosenUser = activeUsers[Math.floor(Math.random() * activeUsers.length)];

    // Pick random prize rule from the game
    const ruleIndex = Math.floor(Math.random() * game.prizeRules.length);
    const rule = game.prizeRules[ruleIndex];

    // Compute randomized prize payout: ticket price * factor
    const baseMult = rule.rank === 1 ? 250 : rule.rank === 2 ? 100 : 50;
    const payoutAmount = game.ticketPrice * baseMult;

    // Build Winner record
    const winnerId = `WIN-${String(winners.length + 1).padStart(3, '0')}`;
    const newWinner: Winner = {
      id: winnerId,
      userId: chosenUser.id,
      userName: chosenUser.name,
      gameName: game.name,
      gameCategory: game.category,
      prizeName: rule.name,
      amount: payoutAmount,
      ticketId: `TCK-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      claimed: false // Unclaimed initially, admin will credit in the Winners tab
    };

    // Credit Agent Commission split simulation
    const approvedAgents = agents.filter(a => a.status === 'approved');
    let agentLogText = '';
    if (approvedAgents.length > 0) {
      const chosenAgent = approvedAgents[Math.floor(Math.random() * approvedAgents.length)];
      const commissionAmount = Number(((game.ticketPrice) * (chosenAgent.revenueShare / 100)).toFixed(2));
      
      // Update Agent wallet
      setAgents(prev => prev.map(a => {
        if (a.id === chosenAgent.id) {
          return { ...a, balance: Number((a.balance + commissionAmount).toFixed(2)) };
        }
        return a;
      }));

      // Generate Agent commission transaction entry
      const agentTxId = `TX-${4011 + transactions.length + 1}`;
      const agentTx: Transaction = {
        id: agentTxId,
        type: 'agent_commission',
        amount: commissionAmount,
        senderName: 'Platform Reserve',
        receiverName: chosenAgent.name,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'completed',
        referenceId: newWinner.ticketId
      };
      
      setTransactions(prev => [agentTx, ...prev]);
      agentLogText = ` Released agent split of $${commissionAmount} to ${chosenAgent.name} in region ${chosenAgent.region}.`;
    }

    setWinners(prev => [newWinner, ...prev]);

    // Update Game draw timestamps
    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        return {
          ...g,
          lastDrawTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          nextDrawTime: new Date(Date.now() + g.intervalMinutes * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return g;
    }));

    addAuditLog('AUTO_DRAW', `Forced draw completed for Game: "${game.name}". Chosen winner: ${chosenUser.name} (${rule.name} - $${payoutAmount}). Ticket Ref: ${newWinner.ticketId}.${agentLogText}`);
    
    alert(`Success! Handled forced draw for "${game.name}". Lucky player: ${chosenUser.name} won ${rule.name} worth $${payoutAmount}! Checked ticket ref: ${newWinner.ticketId}`);
  };

  const handleToggleWinnerClaimed = (winnerId: string) => {
    setWinners(prev => prev.map(w => {
      if (w.id === winnerId) {
        const nextClaimState = !w.claimed;
        
        // If transitioning to Claimed, credit user wallet balance!
        if (nextClaimState) {
          setUsers(prevUsers => prevUsers.map(u => {
            if (u.id === w.userId) {
              return { ...u, balance: Number((u.balance + w.amount).toFixed(2)) };
            }
            return u;
          }));

          // Generate prize payout transaction
          const prizeTxId = `TX-${4011 + transactions.length}`;
          const prizeTx: Transaction = {
            id: prizeTxId,
            type: 'prize_payout',
            amount: w.amount,
            senderName: 'Platform Reserve',
            receiverName: w.userName,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            status: 'completed',
            referenceId: w.id
          };
          setTransactions(prevT => [prizeTx, ...prevT]);
          addAuditLog('PRIZE_DISBURSED', `Directly disbursed draw prize of $${w.amount} to Player ${w.userName}'s wallet balance.`);
        }
        
        return { ...w, claimed: nextClaimState };
      }
      return w;
    }));
  };

  // State Mutators: Ads
  const handleAddAd = (ad: Omit<Advertisement, 'id' | 'impressions' | 'clicks' | 'createdAt'>) => {
    const newId = `AD-${304 + advertisements.length}`;
    const newAd: Advertisement = {
      ...ad,
      id: newId,
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAdvertisements(prev => [...prev, newAd]);
    addAuditLog('AD_POSTED', `Posted new campaign banner: "${ad.title}" targeted for position placement: "${ad.position}".`);
  };

  const handleUpdateAd = (adId: string, updates: Partial<Advertisement>) => {
    setAdvertisements(prev => prev.map(ad => {
      if (ad.id === adId) {
        addAuditLog('AD_MUTATED', `Modified campaign copy parameters for Ad campaign "${ad.title}" (${ad.id}).`);
        return { ...ad, ...updates };
      }
      return ad;
    }));
  };

  const handleDeleteAd = (adId: string) => {
    const adObj = advertisements.find(a => a.id === adId);
    setAdvertisements(prev => prev.filter(a => a.id !== adId));
    addAuditLog('AD_DELETED', `Deleted Ad promotion campaign banner: "${adObj?.title || adId}".`);
  };

  // State Mutators: Chats & Support
  const handleAddMessage = (sessionId: string, msg: Omit<SupportMessage, 'id' | 'timestamp'>) => {
    setChatSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        const newMsg: SupportMessage = {
          ...msg,
          id: `MSG-${100 + session.messages.length + 1}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        
        return {
          ...session,
          unreadCount: msg.sender !== 'admin' ? session.unreadCount + 1 : 0,
          messages: [...session.messages, newMsg],
          lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return session;
    }));
  };

  const handleClearUnread = (sessionId: string) => {
    setChatSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return { ...s, unreadCount: 0 };
      }
      return s;
    }));
  };

  // Total global unreads
  const totalUnreadSupport = chatSessions.reduce((sum, s) => sum + s.unreadCount, 0);

  // Active view router
  const renderActiveView = () => {
    switch (activeTab) {
      case 'users':
        return (
          <UserManagement 
            users={users} 
            transactions={transactions}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onAddTransaction={handleAddTransaction}
          />
        );
      case 'agents':
        return (
          <AgentManagement 
            agents={agents} 
            transactions={transactions}
            onAddAgent={handleAddAgent}
            onUpdateAgent={handleUpdateAgent}
            onDeleteAgent={handleDeleteAgent}
            onAddTransaction={handleAddTransaction}
          />
        );
      case 'games':
        return (
          <GameManagement 
            games={games} 
            onUpdateGame={handleUpdateGame}
            onForceDraw={handleForceDraw}
            onAddGame={handleAddGame}
          />
        );
      case 'winners':
        return (
          <WinnersManagement 
            winners={winners} 
            onToggleClaimed={handleToggleWinnerClaimed}
          />
        );
      case 'ads':
        return (
          <AdsManagement 
            advertisements={advertisements} 
            onAddAd={handleAddAd}
            onUpdateAd={handleUpdateAd}
            onDeleteAd={handleDeleteAd}
          />
        );
      case 'support':
        return (
          <SupportManagement 
            chatSessions={chatSessions} 
            onAddMessage={handleAddMessage}
            onClearUnread={handleClearUnread}
          />
        );
      case 'reports':
        return (
          <ReportsSection 
            users={users} 
            agents={agents} 
            games={games} 
            transactions={transactions}
            winners={winners}
          />
        );
      case 'audit':
        return <AuditLogs logs={auditLogs} />;
      default:
        return (
          <DashboardOverview 
            users={users} 
            agents={agents} 
            games={games} 
            transactions={transactions}
            performanceData={performanceData}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* 1. SWISS SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between hidden lg:flex shrink-0">
        <div className="flex flex-col flex-1">
          {/* Logo Brand Heading */}
          <div className="p-6 border-b border-slate-50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-display font-bold text-lg shadow-sm">
              S
            </div>
            <div>
              <h1 className="font-display font-bold text-slate-900 tracking-tight text-sm">SpinGame</h1>
              <span className="text-[10px] font-mono text-slate-400 font-medium">ADMIN v1.42.0</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto flex-1">
            
            {/* Dashboard Link */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition duration-150 ${
                activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard size={16} />
                <span>Overview Telemetry</span>
              </div>
            </button>

            {/* Players Link */}
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition duration-150 ${
                activeTab === 'users' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users size={16} />
                <span>Player Accounts</span>
              </div>
            </button>

            {/* Agents Link */}
            <button
              onClick={() => setActiveTab('agents')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition duration-150 ${
                activeTab === 'agents' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert size={16} />
                <span>Verified Agents</span>
              </div>
              {agents.filter(a => a.status === 'pending').length > 0 && (
                <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">
                  {agents.filter(a => a.status === 'pending').length}
                </span>
              )}
            </button>

            {/* Games Link */}
            <button
              onClick={() => setActiveTab('games')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition duration-150 ${
                activeTab === 'games' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Gamepad2 size={16} />
                <span>Games & Schedule</span>
              </div>
            </button>

            {/* Winners Link */}
            <button
              onClick={() => setActiveTab('winners')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition duration-150 ${
                activeTab === 'winners' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Award size={16} />
                <span>Prize Winners</span>
              </div>
            </button>

            {/* Advertisements Link */}
            <button
              onClick={() => setActiveTab('ads')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition duration-150 ${
                activeTab === 'ads' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Megaphone size={16} />
                <span>Ad Campaigns</span>
              </div>
            </button>

            {/* Support Chats Link */}
            <button
              onClick={() => setActiveTab('support')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition duration-150 ${
                activeTab === 'support' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare size={16} />
                <span>Direct Support</span>
              </div>
              {totalUnreadSupport > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold animate-pulse">
                  {totalUnreadSupport}
                </span>
              )}
            </button>

            {/* Analytical Reports Link */}
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition duration-150 ${
                activeTab === 'reports' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 size={16} />
                <span>Ledger & RTP Reports</span>
              </div>
            </button>

            {/* Audit Logs Link */}
            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition duration-150 ${
                activeTab === 'audit' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers size={16} />
                <span>Audit Logs Ledger</span>
              </div>
            </button>

          </nav>
        </div>

        {/* User Info Foot block */}
        <div className="p-4 border-t border-slate-50 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold font-display text-xs">
              SA
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-slate-900 text-xs block truncate">SuperAdmin</span>
              <span className="text-[10px] text-slate-400 block truncate font-mono">hailetadilo@gmail.com</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN APPLICATION CONTENT COLUMN */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Upper Header Bar */}
        <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between shrink-0">
          
          {/* Mobile Tab Switcher */}
          <div className="flex items-center lg:hidden gap-2">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="dashboard">Overview Telemetry</option>
              <option value="users">Player Accounts</option>
              <option value="agents">Verified Agents</option>
              <option value="games">Games & Schedule</option>
              <option value="winners">Prize Winners</option>
              <option value="ads">Ad Campaigns</option>
              <option value="support">Direct Support</option>
              <option value="reports">Ledger & RTP Reports</option>
              <option value="audit">Audit Logs Ledger</option>
            </select>
          </div>

          {/* Breadcrumb - Desktop */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Control Panel</span>
            <span>/</span>
            <span className="text-slate-800 capitalize">{activeTab.replace('dashboard', 'Overview').replace('audit', 'Audit Logs')}</span>
          </div>

          {/* Right quick controls */}
          <div className="flex items-center gap-4">
            {/* Quick Draw Alert badge */}
            <div className="flex items-center gap-1 text-[11px] font-mono font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              <Clock size={12} className="text-slate-400 animate-spin" style={{ animationDuration: '3s' }} />
              <span>Draw cycle sync</span>
            </div>

            {/* Profile Avatar */}
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
              H
            </div>
          </div>

        </header>

        {/* Content Container Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          
          {/* Animated Tab Switcher Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>

        </div>

      </main>

    </div>
  );
}
