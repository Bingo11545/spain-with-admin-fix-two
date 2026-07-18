import { User, Agent, Game, Transaction, Winner, Advertisement, ChatSession, AuditLog, PerformanceDay } from '../types';

export const INITIAL_USERS: User[] = [
  { id: 'USR-101', name: 'Alexander Wright', email: 'alex.wright@gmail.com', balance: 450.00, ticketsBought: 124, status: 'active', createdAt: '2026-03-12' },
  { id: 'USR-102', name: 'Sophia Martinez', email: 'sophia.m@yahoo.com', balance: 85.50, ticketsBought: 42, status: 'active', createdAt: '2026-04-05' },
  { id: 'USR-103', name: 'Marcus Chen', email: 'm.chen@outlook.com', balance: 1240.00, ticketsBought: 312, status: 'active', createdAt: '2026-02-18' },
  { id: 'USR-104', name: 'Amara Okafor', email: 'amara.okafor@gmail.com', balance: 12.00, ticketsBought: 18, status: 'blocked', createdAt: '2026-05-22' },
  { id: 'USR-105', name: 'Lucas van der Berg', email: 'lucas.vdb@gmail.com', balance: 180.20, ticketsBought: 67, status: 'active', createdAt: '2026-05-01' },
  { id: 'USR-106', name: 'Chloe Jenkins', email: 'chloe.j@hotmail.com', balance: 350.00, ticketsBought: 89, status: 'active', createdAt: '2026-06-10' },
  { id: 'USR-107', name: 'Yuki Tanaka', email: 'y.tanaka@docomo.ne.jp', balance: 50.00, ticketsBought: 15, status: 'active', createdAt: '2026-06-25' },
  { id: 'USR-108', name: 'Gabriel Silva', email: 'gabriel.silva@uol.com.br', balance: 620.00, ticketsBought: 145, status: 'active', createdAt: '2026-01-30' },
  { id: 'USR-109', name: 'Zoe Tremblay', email: 'zoe.tremblay@rogers.ca', balance: 0.00, ticketsBought: 8, status: 'active', createdAt: '2026-07-01' },
  { id: 'USR-110', name: 'David Miller', email: 'david.miller@gmail.com', balance: 95.00, ticketsBought: 34, status: 'active', createdAt: '2026-07-05' }
];

export const INITIAL_AGENTS: Agent[] = [
  { id: 'AGT-201', name: 'Michael Kojo', email: 'kojo.agents@spinmail.com', mobile: '+233 24 455 6789', region: 'Greater Accra', balance: 840.50, revenueShare: 15, status: 'approved', createdAt: '2026-01-15' },
  { id: 'AGT-202', name: 'Fatima Al-Sayed', email: 'fatima.s@agentnet.com', mobile: '+966 50 123 4567', region: 'Riyadh Province', balance: 1250.00, revenueShare: 18, status: 'approved', createdAt: '2026-02-28' },
  { id: 'AGT-203', name: 'Carlos Mendoza', email: 'carlos.m@spinagent.la', mobile: '+52 55 9876 5432', region: 'CDMX', balance: 410.20, revenueShare: 12, status: 'approved', createdAt: '2026-04-19' },
  { id: 'AGT-204', name: 'Elena Rostova', email: 'elena.ros@fastspin.ru', mobile: '+7 903 456 7890', region: 'Moscow City', balance: 0.00, revenueShare: 15, status: 'pending', createdAt: '2026-07-14' },
  { id: 'AGT-205', name: 'Rajesh Kumar', email: 'kumar.rajesh@spinindia.in', mobile: '+91 98450 12345', region: 'Karnataka', balance: 0.00, revenueShare: 14, status: 'pending', createdAt: '2026-07-15' },
  { id: 'AGT-206', name: 'Oliver Twist', email: 'oliver.agents@spin.co.uk', mobile: '+44 7911 123456', region: 'Greater London', balance: 0.00, revenueShare: 15, status: 'rejected', createdAt: '2026-05-10' }
];

export const INITIAL_GAMES: Game[] = [
  {
    id: 'GM-001',
    name: 'Mega Spin Blitz',
    category: 'Mega Spin',
    ticketPrice: 5.00,
    status: 'active',
    universalStart: '08:00',
    universalEnd: '23:59',
    intervalMinutes: 15,
    prizeRules: [
      { rank: 1, name: 'Grand Jackpot', percentage: 50 },
      { rank: 2, name: 'Mega Prize', percentage: 25 },
      { rank: 3, name: 'Minor Reward', percentage: 15 }
    ],
    lastDrawTime: '21:45',
    nextDrawTime: '22:00'
  },
  {
    id: 'GM-002',
    name: 'Classic Golden Wheel',
    category: 'Classic Wheel',
    ticketPrice: 2.00,
    status: 'active',
    universalStart: '00:00',
    universalEnd: '23:59',
    intervalMinutes: 10,
    prizeRules: [
      { rank: 1, name: 'Gold Prize', percentage: 60 },
      { rank: 2, name: 'Silver Prize', percentage: 30 },
      { rank: 3, name: 'Bronze Prize', percentage: 10 }
    ],
    lastDrawTime: '21:50',
    nextDrawTime: '22:00'
  },
  {
    id: 'GM-003',
    name: 'Lucky Draw Extravaganza',
    category: 'Lucky Draw',
    ticketPrice: 10.00,
    status: 'active',
    universalStart: '12:00',
    universalEnd: '22:00',
    intervalMinutes: 60,
    prizeRules: [
      { rank: 1, name: 'First Place', percentage: 70 },
      { rank: 2, name: 'Second Place', percentage: 20 },
      { rank: 3, name: 'Consolation Prize', percentage: 10 }
    ],
    lastDrawTime: '21:00',
    nextDrawTime: '22:00'
  },
  {
    id: 'GM-004',
    name: 'VIP Elite Wheel',
    category: 'VIP Wheel',
    ticketPrice: 50.00,
    status: 'active',
    universalStart: '18:00',
    universalEnd: '23:00',
    intervalMinutes: 120,
    prizeRules: [
      { rank: 1, name: 'Diamond Jack', percentage: 80 },
      { rank: 2, name: 'Sapphire Prize', percentage: 20 }
    ],
    lastDrawTime: '20:00',
    nextDrawTime: '22:00'
  },
  {
    id: 'GM-005',
    name: 'High Roller Dice Roll',
    category: 'Dice Roll',
    ticketPrice: 25.00,
    status: 'inactive',
    universalStart: '10:00',
    universalEnd: '20:00',
    intervalMinutes: 30,
    prizeRules: [
      { rank: 1, name: 'Lucky 666', percentage: 90 },
      { rank: 2, name: 'Lucky Doubles', percentage: 10 }
    ],
    lastDrawTime: '19:30',
    nextDrawTime: '10:00'
  }
];

export const INITIAL_WINNERS: Winner[] = [
  { id: 'WIN-001', userName: 'Marcus Chen', userId: 'USR-103', gameName: 'Mega Spin Blitz', gameCategory: 'Mega Spin', prizeName: 'Grand Jackpot', amount: 1250.00, ticketId: 'TCK-99021', date: '2026-07-17 21:45', claimed: true },
  { id: 'WIN-002', userName: 'Alexander Wright', userId: 'USR-101', gameName: 'Classic Golden Wheel', gameCategory: 'Classic Wheel', prizeName: 'Gold Prize', amount: 350.00, ticketId: 'TCK-88124', date: '2026-07-17 21:40', claimed: true },
  { id: 'WIN-003', userName: 'Chloe Jenkins', userId: 'USR-106', gameName: 'VIP Elite Wheel', gameCategory: 'VIP Wheel', prizeName: 'Diamond Jack', amount: 5000.00, ticketId: 'TCK-77119', date: '2026-07-17 20:00', claimed: true },
  { id: 'WIN-004', userName: 'Sophia Martinez', userId: 'USR-102', gameName: 'Mega Spin Blitz', gameCategory: 'Mega Spin', prizeName: 'Mega Prize', amount: 625.00, ticketId: 'TCK-99014', date: '2026-07-17 19:30', claimed: false },
  { id: 'WIN-005', userName: 'Lucas van der Berg', userId: 'USR-105', gameName: 'Lucky Draw Extravaganza', gameCategory: 'Lucky Draw', prizeName: 'First Place', amount: 840.00, ticketId: 'TCK-66442', date: '2026-07-17 18:00', claimed: true },
  { id: 'WIN-006', userName: 'Gabriel Silva', userId: 'USR-108', gameName: 'Classic Golden Wheel', gameCategory: 'Classic Wheel', prizeName: 'Silver Prize', amount: 150.00, ticketId: 'TCK-88091', date: '2026-07-17 17:30', claimed: true },
  { id: 'WIN-007', userName: 'Marcus Chen', userId: 'USR-103', gameName: 'Classic Golden Wheel', gameCategory: 'Classic Wheel', prizeName: 'Gold Prize', amount: 350.00, ticketId: 'TCK-88015', date: '2026-07-16 14:20', claimed: true },
  { id: 'WIN-008', userName: 'Amara Okafor', userId: 'USR-104', gameName: 'Mega Spin Blitz', gameCategory: 'Mega Spin', prizeName: 'Minor Reward', percentage: 15, amount: 375.00, ticketId: 'TCK-98920', date: '2026-07-16 11:15', claimed: true } as any,
  { id: 'WIN-009', userName: 'Yuki Tanaka', userId: 'USR-107', gameName: 'Lucky Draw Extravaganza', gameCategory: 'Lucky Draw', prizeName: 'Second Place', amount: 240.00, ticketId: 'TCK-66110', date: '2026-07-15 15:00', claimed: true },
  { id: 'WIN-010', userName: 'David Miller', userId: 'USR-110', gameName: 'High Roller Dice Roll', gameCategory: 'Dice Roll', prizeName: 'Lucky 666', amount: 1200.00, ticketId: 'TCK-55410', date: '2026-07-14 19:30', claimed: true }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'TX-4001', type: 'prize_payout', amount: 1250.00, senderName: 'Platform Reserve', receiverName: 'Marcus Chen', timestamp: '2026-07-17 21:46', status: 'completed', referenceId: 'WIN-001' },
  { id: 'TX-4002', type: 'ticket_purchase', amount: 5.00, senderName: 'Marcus Chen', receiverName: 'Mega Spin Blitz', timestamp: '2026-07-17 21:42', status: 'completed', referenceId: 'TCK-99021' },
  { id: 'TX-4003', type: 'agent_commission', amount: 0.75, senderName: 'Platform Reserve', receiverName: 'Michael Kojo', timestamp: '2026-07-17 21:42', status: 'completed', referenceId: 'TX-4002' },
  { id: 'TX-4004', type: 'prize_payout', amount: 350.00, senderName: 'Platform Reserve', receiverName: 'Alexander Wright', timestamp: '2026-07-17 21:41', status: 'completed', referenceId: 'WIN-002' },
  { id: 'TX-4005', type: 'ticket_purchase', amount: 2.00, senderName: 'Alexander Wright', receiverName: 'Classic Golden Wheel', timestamp: '2026-07-17 21:38', status: 'completed', referenceId: 'TCK-88124' },
  { id: 'TX-4006', type: 'agent_commission', amount: 0.30, senderName: 'Platform Reserve', receiverName: 'Michael Kojo', timestamp: '2026-07-17 21:38', status: 'completed', referenceId: 'TX-4005' },
  { id: 'TX-4007', type: 'deposit', amount: 500.00, senderName: 'Carlos Mendoza (Agent)', receiverName: 'Platform Bank', timestamp: '2026-07-17 19:15', status: 'completed', referenceId: 'DEP-88390' },
  { id: 'TX-4008', type: 'withdrawal', amount: 200.00, senderName: 'Fatima Al-Sayed (Agent)', receiverName: 'Bank Account', timestamp: '2026-07-17 18:22', status: 'completed', referenceId: 'WTH-44122' },
  { id: 'TX-4009', type: 'ticket_purchase', amount: 50.00, senderName: 'Chloe Jenkins', receiverName: 'VIP Elite Wheel', timestamp: '2026-07-17 17:55', status: 'completed', referenceId: 'TCK-77119' },
  { id: 'TX-4010', type: 'agent_commission', amount: 9.00, senderName: 'Platform Reserve', receiverName: 'Fatima Al-Sayed', timestamp: '2026-07-17 17:55', status: 'completed', referenceId: 'TX-4009' }
];

export const INITIAL_ADS: Advertisement[] = [
  { id: 'AD-301', title: 'Summer Mega Jackpot Festival', description: 'Get 20% bonus on your first spin ticket purchase this weekend. Universal draw multipliers active starting Friday.', bannerBg: 'from-amber-500 to-orange-600', link: 'https://spingame.com/summer-promo', position: 'home', status: 'active', impressions: 4210, clicks: 582, createdAt: '2026-07-10' },
  { id: 'AD-302', title: 'Become an Authorized Agent', description: 'Earn up to 18% instant revenue share and expand your network. Fast payout, real-time analytics dashboard, local bank withdrawal.', bannerBg: 'from-blue-600 to-indigo-700', link: 'https://spingame.com/agents-signup', position: 'sidebar', status: 'active', impressions: 2150, clicks: 198, createdAt: '2026-07-12' },
  { id: 'AD-303', title: 'Midnight VIP Special Edition', description: 'Exclusive entry to the VIP Wheel with a guaranteed minimum 10x return prize pool. Active from 23:00 to 01:00.', bannerBg: 'from-purple-600 to-fuchsia-800', link: 'https://spingame.com/vip-midnight', position: 'game_screen', status: 'inactive', impressions: 840, clicks: 65, createdAt: '2026-07-15' }
];

export const INITIAL_CHATS: ChatSession[] = [
  {
    id: 'CH-501',
    entityId: 'USR-101',
    entityName: 'Alexander Wright',
    entityType: 'user',
    unreadCount: 1,
    isOnline: true,
    lastUpdated: '2026-07-17 21:50',
    messages: [
      { id: 'MSG-001', sender: 'user', senderName: 'Alexander Wright', text: 'Hello, I bought a ticket for the Mega Spin Blitz and got winning confirmation, but my balance has not updated yet.', timestamp: '2026-07-17 21:40' },
      { id: 'MSG-002', sender: 'admin', senderName: 'Admin System', text: 'Hi Alexander! Let me check the ticket ledger for you. It looks like draw GM-001 completed at 21:45. Your prize should be credited. Did you receive ticket TCK-88124?', timestamp: '2026-07-17 21:42' },
      { id: 'MSG-003', sender: 'user', senderName: 'Alexander Wright', text: 'Ah, yes! I see the transaction completed now and it shows under my ticket history! Thanks for the quick support.', timestamp: '2026-07-17 21:44' },
      { id: 'MSG-004', sender: 'user', senderName: 'Alexander Wright', text: 'One more quick question - what is the minimum withdrawal limit from my wallet balance?', timestamp: '2026-07-17 21:50' }
    ]
  },
  {
    id: 'CH-502',
    entityId: 'AGT-201',
    entityName: 'Michael Kojo',
    entityType: 'agent',
    unreadCount: 0,
    isOnline: true,
    lastUpdated: '2026-07-17 19:30',
    messages: [
      { id: 'MSG-101', sender: 'agent', senderName: 'Michael Kojo', text: 'Good evening. I have some users in Greater Accra who would like to purchase tickets offline with cash. Can I increase my revenue share percent to 18% to cover local marketing costs?', timestamp: '2026-07-17 19:10' },
      { id: 'MSG-102', sender: 'admin', senderName: 'System Admin', text: 'Hello Michael, thank you for your active support in the Greater Accra region. Let me review your transactional volumes. If you hit over 1000 ticket sales this month we can adjust your revenue share to 18% in the settings.', timestamp: '2026-07-17 19:25' },
      { id: 'MSG-103', sender: 'agent', senderName: 'Michael Kojo', text: 'Understood. I will push sales to hit that threshold. Thank you!', timestamp: '2026-07-17 19:30' }
    ]
  },
  {
    id: 'CH-503',
    entityId: 'AGT-204',
    entityName: 'Elena Rostova',
    entityType: 'agent',
    unreadCount: 2,
    isOnline: false,
    lastUpdated: '2026-07-16 11:30',
    messages: [
      { id: 'MSG-201', sender: 'agent', senderName: 'Elena Rostova', text: 'Greetings! I applied to become a Spin Game Agent from Moscow region two days ago. Could you please review and approve my credentials?', timestamp: '2026-07-16 11:15' },
      { id: 'MSG-202', sender: 'agent', senderName: 'Elena Rostova', text: 'I have attached my local agent license and bank verification documents for your review.', timestamp: '2026-07-16 11:30' }
    ]
  },
  {
    id: 'CH-504',
    entityId: 'USR-104',
    entityName: 'Amara Okafor',
    entityType: 'user',
    unreadCount: 0,
    isOnline: false,
    lastUpdated: '2026-07-15 09:12',
    messages: [
      { id: 'MSG-301', sender: 'user', senderName: 'Amara Okafor', text: 'My account has been blocked. What is the reason for this?', timestamp: '2026-07-15 09:00' },
      { id: 'MSG-302', sender: 'admin', senderName: 'System Admin', text: 'Hello Amara, your account was flagged for multiple duplicate payment refund requests. We are conducting an audit on your profile. Please refrain from using proxy nodes.', timestamp: '2026-07-15 09:12' }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'LOG-001', adminName: 'Admin System', action: 'SYSTEM_BOOT', details: 'SpinGame Administration control panel initialized on Cloud Run sandbox.', ipAddress: '10.244.1.42', timestamp: '2026-07-17 08:00:00' },
  { id: 'LOG-002', adminName: 'SuperAdmin (hailetadilo@gmail.com)', action: 'UPDATE_PRICE', details: 'Configured "VIP Elite Wheel" ticket price from $40.00 to $50.00.', ipAddress: '192.168.1.104', timestamp: '2026-07-17 11:30:22' },
  { id: 'LOG-003', adminName: 'SuperAdmin (hailetadilo@gmail.com)', action: 'APPROVE_AGENT', details: 'Approved Agent Carlos Mendoza (AGT-203) for CDMX region.', ipAddress: '192.168.1.104', timestamp: '2026-07-17 14:15:01' },
  { id: 'LOG-004', adminName: 'SuperAdmin (hailetadilo@gmail.com)', action: 'BLOCK_USER', details: 'Suspended user Amara Okafor (USR-104) due to suspicious transactions.', ipAddress: '192.168.1.104', timestamp: '2026-07-17 15:20:10' },
  { id: 'LOG-005', adminName: 'Admin System', action: 'AUTO_DRAW', details: 'Mega Spin Blitz Draw completed. Generated 3 winners. Total payout: $2250.00.', ipAddress: '127.0.0.1', timestamp: '2026-07-17 18:00:02' },
  { id: 'LOG-006', adminName: 'SuperAdmin (hailetadilo@gmail.com)', action: 'POST_AD', description: 'Posted advertisement "Midnight VIP Special Edition".', ipAddress: '192.168.1.104', timestamp: '2026-07-17 19:45:30' } as any,
  { id: 'LOG-007', adminName: 'SuperAdmin (hailetadilo@gmail.com)', action: 'UPDATE_SCHEDULE', details: 'Updated "Mega Spin Blitz" universal draw intervals to 15 minutes.', ipAddress: '192.168.1.104', timestamp: '2026-07-17 21:00:15' },
  { id: 'LOG-008', adminName: 'Admin System', action: 'AUTO_DRAW', details: 'Classic Golden Wheel Draw completed. Generated winner Alexander Wright (WIN-002). Payout: $350.00.', ipAddress: '127.0.0.1', timestamp: '2026-07-17 21:40:02' }
];

export const INITIAL_PERFORMANCE: PerformanceDay[] = [
  { date: 'Jul 11', ticketVolume: 340, revenue: 1720, commission: 258 },
  { date: 'Jul 12', ticketVolume: 420, revenue: 2150, commission: 322 },
  { date: 'Jul 13', ticketVolume: 380, revenue: 1980, commission: 297 },
  { date: 'Jul 14', ticketVolume: 610, revenue: 3100, commission: 465 },
  { date: 'Jul 15', ticketVolume: 520, revenue: 2680, commission: 402 },
  { date: 'Jul 16', ticketVolume: 780, revenue: 3950, commission: 592 },
  { date: 'Jul 17', ticketVolume: 940, revenue: 4850, commission: 727 }
];

export const INCOMING_SUPPORT_TEMPLATES = [
  "Thanks for checking. Let me know when my payout is processed.",
  "Hi, I want to sign up 5 sub-agents in my region, do you support sub-agent hierarchies?",
  "I received a bank error code 104 when depositing money into my wallet. What does that mean?",
  "Can you verify my identification card faster so I can start buying tickets?",
  "The game is extremely exciting! Keep up the good work!"
];
