import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, User, ShieldCheck, CheckCheck, Clock, MessageSquare, ArrowLeft, RefreshCw } from 'lucide-react';
import { ChatSession, SupportMessage } from '../types';
import { INCOMING_SUPPORT_TEMPLATES } from '../data/mockData';

interface SupportManagementProps {
  chatSessions: ChatSession[];
  onAddMessage: (sessionId: string, message: Omit<SupportMessage, 'id' | 'timestamp'>) => void;
  onClearUnread: (sessionId: string) => void;
}

export default function SupportManagement({
  chatSessions,
  onAddMessage,
  onClearUnread
}: SupportManagementProps) {
  const [activeTab, setActiveTab] = useState<'user' | 'agent'>('user');
  const [search, setSearch] = useState('');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  // Simulated auto-reply timeout tracking
  const [isSimulatingTyping, setIsSimulatingTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Group or filter sessions by type
  const userSessions = chatSessions.filter(s => s.entityType === 'user');
  const agentSessions = chatSessions.filter(s => s.entityType === 'agent');

  const getSessionsList = () => {
    return activeTab === 'user' ? userSessions : agentSessions;
  };

  const filteredSessions = getSessionsList().filter(s => {
    return s.entityName.toLowerCase().includes(search.toLowerCase()) ||
           s.id.toLowerCase().includes(search.toLowerCase()) ||
           s.entityId.toLowerCase().includes(search.toLowerCase());
  });

  const activeSession = chatSessions.find(s => s.id === activeSessionId);

  // Clear unread count when opening a session
  useEffect(() => {
    if (activeSessionId) {
      onClearUnread(activeSessionId);
    }
  }, [activeSessionId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSession?.messages, isSimulatingTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeSessionId) return;

    const sessionObj = activeSession;
    if (!sessionObj) return;

    // Post administrator's message
    onAddMessage(activeSessionId, {
      sender: 'admin',
      senderName: 'Platform Administrator',
      text: replyText.trim()
    });

    const userQuery = replyText.trim();
    setReplyText('');

    // Trigger realistic simulator response from User/Agent
    setIsSimulatingTyping(true);

    setTimeout(() => {
      setIsSimulatingTyping(false);
      
      // Get random support template
      const randomText = INCOMING_SUPPORT_TEMPLATES[Math.floor(Math.random() * INCOMING_SUPPORT_TEMPLATES.length)];
      
      onAddMessage(activeSessionId, {
        sender: sessionObj.entityType,
        senderName: sessionObj.entityName,
        text: `[Simulated] ${randomText}`
      });
    }, 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs h-[calc(100vh-14rem)] flex flex-col md:flex-row">
      
      {/* Contact selector Rail */}
      <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col justify-between ${activeSessionId ? 'hidden md:flex' : 'flex'}`}>
        <div>
          {/* Header */}
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MessageSquare size={16} className="text-indigo-600" />
              <span>Direct Support Desks</span>
            </h3>

            {/* Independent Tabs */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
              <button
                onClick={() => {
                  setActiveTab('user');
                  setSearch('');
                  setActiveSessionId(null);
                }}
                className={`flex-1 py-1 rounded-md transition ${activeTab === 'user' ? 'bg-white text-indigo-600 shadow-3xs' : 'hover:bg-slate-50'}`}
              >
                Players Chat
              </button>
              <button
                onClick={() => {
                  setActiveTab('agent');
                  setSearch('');
                  setActiveSessionId(null);
                }}
                className={`flex-1 py-1 rounded-md transition ${activeTab === 'agent' ? 'bg-white text-indigo-600 shadow-3xs' : 'hover:bg-slate-50'}`}
              >
                Agents Desk
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="p-3 border-b border-slate-100 relative">
            <Search className="absolute left-6 top-5 text-slate-400" size={14} />
            <input
              type="text"
              placeholder={`Search active ${activeTab}s...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-lg py-1.5 pl-8 pr-3 text-xs focus:outline-none"
            />
          </div>

          {/* Contact list */}
          <div className="divide-y divide-slate-50 overflow-y-auto max-h-[calc(100vh-25rem)]">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => {
                const lastMsg = session.messages[session.messages.length - 1];
                const isActive = session.id === activeSessionId;
                
                return (
                  <div
                    key={session.id}
                    onClick={() => setActiveSessionId(session.id)}
                    className={`p-4 cursor-pointer transition flex items-start gap-3 hover:bg-slate-50 ${
                      isActive ? 'bg-indigo-50/50 hover:bg-indigo-50/50 border-l-4 border-indigo-600 pl-3' : ''
                    }`}
                  >
                    <div className="relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        session.entityType === 'agent' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {session.entityName.split(' ').map(n => n[0]).join('')}
                      </div>
                      {session.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-950 truncate block">{session.entityName}</span>
                        {session.unreadCount > 0 && (
                          <span className="bg-red-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-full animate-pulse font-mono">
                            {session.unreadCount}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{session.entityId}</span>
                      <p className="text-[11px] text-slate-500 truncate mt-1">
                        {lastMsg ? lastMsg.text : 'No messages'}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400 font-medium text-xs">
                No active chat logs found.
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-50 bg-slate-50 text-[10px] text-slate-400 font-medium font-mono text-center">
          AUTO-RESPOND SIMULATOR ACTIVE
        </div>
      </div>

      {/* Direct Chat Portal window */}
      {activeSession ? (
        <div className="flex-1 flex flex-col justify-between h-full bg-slate-50">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveSessionId(null)}
                className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <ArrowLeft size={16} />
              </button>
              
              <div className="relative">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                  activeSession.entityType === 'agent' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {activeSession.entityName.split(' ').map(n => n[0]).join('')}
                </div>
                {activeSession.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-xs text-slate-900 leading-tight flex items-center gap-1">
                  <span>{activeSession.entityName}</span>
                  {activeSession.entityType === 'agent' ? (
                    <span className="text-[9px] bg-amber-50 text-amber-800 font-bold px-1.5 py-0.2 rounded">Agent Partner</span>
                  ) : (
                    <span className="text-[9px] bg-blue-50 text-blue-800 font-bold px-1.5 py-0.2 rounded">Player Client</span>
                  )}
                </h4>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono mt-0.5">
                  <span>{activeSession.entityId}</span>
                  <span>•</span>
                  <span>{activeSession.isOnline ? 'Online now' : 'Away'}</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
              LOG: {activeSession.id}
            </div>
          </div>

          {/* Messages window */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[calc(100vh-27rem)]">
            {activeSession.messages.map((msg) => {
              const isAdmin = msg.sender === 'admin';
              
              return (
                <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 shadow-3xs text-xs relative ${
                    isAdmin 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}>
                    <span className="block text-[9px] opacity-75 font-bold mb-1 uppercase tracking-wider">
                      {msg.senderName}
                    </span>
                    <p className="font-light leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <span className="block text-[9px] opacity-60 font-mono text-right mt-2">
                      {msg.timestamp.split(' ')[1]}
                    </span>
                  </div>
                </div>
              );
            })}

            {isSimulatingTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl p-3 shadow-3xs text-xs border border-slate-100 rounded-tl-none flex items-center gap-1">
                  <span className="text-[10px] text-slate-400 italic">Typing</span>
                  <div className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={scrollRef} />
          </div>

          {/* Form */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-3">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={isSimulatingTyping}
              placeholder={`Write text to ${activeSession.entityName}...`}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-xs text-slate-700 focus:outline-none focus:border-indigo-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSimulatingTyping || !replyText.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition duration-150 disabled:opacity-40 flex items-center justify-center"
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 text-slate-400">
          <MessageSquare size={36} className="text-slate-300 stroke-1 mb-3" />
          <p className="text-xs font-semibold">Select a contact conversation log from the support roster.</p>
          <p className="text-[10px] text-slate-400 mt-1">Direct support text channel is fully configured independently for users and agents.</p>
        </div>
      )}

    </div>
  );
}
