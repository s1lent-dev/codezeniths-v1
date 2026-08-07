import { create } from 'zustand';

export type NotificationFilter = 'all' | 'new' | 'unread' | 'read' | 'others';

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    category: 'new' | 'unread' | 'read' | 'others';
}

interface SearchFilters {
    difficulty?: 'all' | 'easy' | 'medium' | 'hard';
    type?: 'all' | 'problems' | 'modules' | 'tags';
}

interface NavigationStore {
    // Sidebar State
    isDesktopSidebarCollapsed: boolean;
    toggleDesktopSidebar: () => void;
    setDesktopSidebarCollapsed: (collapsed: boolean) => void;
    
    isMobileSidebarOpen: boolean;
    setMobileSidebarOpen: (open: boolean) => void;
    toggleMobileSidebar: () => void;

    // Mobile Search Overlay State
    isMobileSearchOpen: boolean;
    setMobileSearchOpen: (open: boolean) => void;
    toggleMobileSearch: () => void;

    // Search Query & Filters
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isSearchFilterOpen: boolean;
    setSearchFilterOpen: (open: boolean) => void;
    searchFilters: SearchFilters;
    setSearchFilters: (filters: Partial<SearchFilters>) => void;
    resetSearchFilters: () => void;

    // Notifications State
    isNotificationPopoverOpen: boolean;
    setNotificationPopoverOpen: (open: boolean) => void;
    notificationFilter: NotificationFilter;
    setNotificationFilter: (filter: NotificationFilter) => void;
    notifications: NotificationItem[];
    markAllAsRead: () => void;
    markAsRead: (id: string) => void;

    // Profile Popover State
    isProfilePopoverOpen: boolean;
    setProfilePopoverOpen: (open: boolean) => void;
    isDNDEnabled: boolean;
    toggleDND: () => void;
    allowNotifications: boolean;
    toggleAllowNotifications: () => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
    {
        id: '1',
        title: 'New Problem Released!',
        message: 'Binary Tree Maximum Path Sum has been added to Problemset.',
        timestamp: '10 mins ago',
        isRead: false,
        category: 'new',
    },
    {
        id: '2',
        title: 'Streak Milestone Reached 🔥',
        message: 'You have maintained a 7-day coding streak. Keep it up!',
        timestamp: '1 hour ago',
        isRead: false,
        category: 'unread',
    },
    {
        id: '3',
        title: 'Module Certificate Earned 🏆',
        message: 'Congratulations! You completed Data Structures & Algorithms Level 1.',
        timestamp: '1 day ago',
        isRead: true,
        category: 'read',
    },
    {
        id: '4',
        title: 'System Maintenance Scheduled',
        message: 'Scheduled maintenance on Sunday from 2 AM to 4 AM UTC.',
        timestamp: '2 days ago',
        isRead: true,
        category: 'others',
    },
];

export const useNavigationStore = create<NavigationStore>((set) => ({
    // Sidebar
    isDesktopSidebarCollapsed: false,
    toggleDesktopSidebar: () => set((state) => ({ isDesktopSidebarCollapsed: !state.isDesktopSidebarCollapsed })),
    setDesktopSidebarCollapsed: (collapsed) => set({ isDesktopSidebarCollapsed: collapsed }),

    isMobileSidebarOpen: false,
    setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
    toggleMobileSidebar: () => set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),

    // Search Overlay
    isMobileSearchOpen: false,
    setMobileSearchOpen: (open) => set({ isMobileSearchOpen: open }),
    toggleMobileSearch: () => set((state) => ({ isMobileSearchOpen: !state.isMobileSearchOpen })),

    // Search & Filters
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    isSearchFilterOpen: false,
    setSearchFilterOpen: (open) => set({ isSearchFilterOpen: open }),
    searchFilters: { difficulty: 'all', type: 'all' },
    setSearchFilters: (filters) => set((state) => ({ searchFilters: { ...state.searchFilters, ...filters } })),
    resetSearchFilters: () => set({ searchFilters: { difficulty: 'all', type: 'all' } }),

    // Notifications
    isNotificationPopoverOpen: false,
    setNotificationPopoverOpen: (open) => set({ isNotificationPopoverOpen: open }),
    notificationFilter: 'all',
    setNotificationFilter: (filter) => set({ notificationFilter: filter }),
    notifications: INITIAL_NOTIFICATIONS,
    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        })),
    markAsRead: (id) =>
        set((state) => ({
            notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        })),

    // Profile Popover
    isProfilePopoverOpen: false,
    setProfilePopoverOpen: (open) => set({ isProfilePopoverOpen: open }),
    isDNDEnabled: false,
    toggleDND: () => set((state) => ({ isDNDEnabled: !state.isDNDEnabled })),
    allowNotifications: true,
    toggleAllowNotifications: () => set((state) => ({ allowNotifications: !state.allowNotifications })),
}));
