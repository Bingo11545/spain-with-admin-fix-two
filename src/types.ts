export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  ticketsBought: number;
  status: 'active' | 'blocked';
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  mobile: string;
  region: string;
  balance: number;
  revenueShare: number; // Percentage, e.g., 15
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Game {
  id: string;
  name: string;
  category: 'Mega Spin' | 'Classic Wheel' | 'Lucky Draw' | 'VIP Wheel' | 'Dice Roll';
  ticketPrice: number;
  status: 'active' | 'inactive';
  universalStart: string; // e.g., "08:00"
  universalEnd: string; // e.g., "22:00"
  intervalMinutes: number;
  prizeRules: { rank: number; name: string; percentage: number }[];
  lastDrawTime: string;
  nextDrawTime: string;
}

export interface Transaction {
  id: string;
  type: 'ticket_purchase' | 'agent_commission' | 'deposit' | 'withdrawal' | 'prize_payout';
  amount: number;
  senderName: string;
  receiverName: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  referenceId: string;
}

export interface Winner {
  id: string;
  userName: string;
  userId: string;
  gameName: string;
  gameCategory: string;
  prizeName: string;
  amount: number;
  ticketId: string;
  date: string;
  claimed: boolean;
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  bannerBg: string; // Tailwind class, e.g., "from-emerald-500 to-teal-600"
  imageUrl?: string;
  link: string;
  position: 'home' | 'game_screen' | 'sidebar';
  status: 'active' | 'inactive';
  impressions: number;
  clicks: number;
  createdAt: string;
}

export interface SupportMessage {
  id: string;
  sender: 'admin' | 'user' | 'agent';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  entityId: string; // ID of the User or Agent
  entityName: string;
  entityType: 'user' | 'agent';
  unreadCount: number;
  messages: SupportMessage[];
  lastUpdated: string;
  isOnline: boolean;
}

export interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface PerformanceDay {
  date: string; // e.g., "Mon", "Tue"
  ticketVolume: number;
  revenue: number;
  commission: number;
}
