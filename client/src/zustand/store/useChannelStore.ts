import { create } from 'zustand';
import Cookies from 'js-cookie';

interface ChannelState {
  selectedChannel: string;
  lastSeen: string;
  refresh: boolean;
  setLastSeen: (lastSeen: string) => void;
  setSelectedChannel: (channelId: string) => void;
  toggleRefresh: () => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  selectedChannel: '',
  lastSeen: Cookies.get('last_seen') || '',
  refresh: false,

  setLastSeen: (lastSeen) => {
    Cookies.set('last_seen', lastSeen);
    set({ lastSeen });
  },

  setSelectedChannel: (channelId) => set({ selectedChannel: channelId }),

  toggleRefresh: () => set((state) => ({ refresh: !state.refresh })),
}));
