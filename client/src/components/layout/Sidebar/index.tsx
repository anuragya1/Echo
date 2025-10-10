import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getChannelsByUser } from '../../../services/channelService';
import ChannelBox from './ChannelBox';
import Searchbar from './Searchbar';
import UserBox from './UserBox'
import Spinner from '../../loading/Spinner';
import type { channel, message } from '../../../utils/types';
import { useAuthStore } from '../../../zustand/store/useAuthStore';
import { useChannelStore } from '../../../zustand/store/useChannelStore';

const Sidebar = () => {
    const location = useLocation();
    const user = useAuthStore((state) => state.user);
    const refresh = useChannelStore((state) => state.refresh);
    const [channels, setChannels] = useState<channel[]>([]);
    const [isPending, setIsPending] = useState<boolean>(true);
    const [lastMessages, setLastMessages] = useState<message[]>([]);
    const [search, setSearch] = useState<string>('');

    useEffect(() => {
        const fetchChannels = async () => {
            if (!user?.id) return; // Guard clause
            
            try {
                setIsPending(true);
                const result = await getChannelsByUser(user.id);
                
                console.log('Fetched result:', result); // Debug log
                
                // Ensure we have arrays
                setChannels(Array.isArray(result.channels) ? result.channels : []);
                setLastMessages(Array.isArray(result.lastMessages) ? result.lastMessages : []);
            } catch (error) {
                console.error('Failed to fetch channels:', error);
                setChannels([]);
                setLastMessages([]);
            } finally {
                setIsPending(false);
            }
        };

        fetchChannels();
    }, [user?.id, refresh]);

    return (
        <aside className={
            `bg-neutral-900 border-r md:block border-neutral-700 xl:col-span-2 md:col-span-2 min-h-screen md:min-h-fit overflow-hidden  
                ${location.pathname === '/' ? 'block' : 'hidden'} 
            `}
        >
            <UserBox />
            <Searchbar setSearch={setSearch} />
            <div className='overflow-x-hidden overflow-y-auto max-h-[865px] pb-16'>
                {isPending ? (
                    <div className='mt-10'>
                        <Spinner size='sm' />
                    </div>
                ) : channels.length > 0 ? (
                    channels.map((channel, index) => {
                        // Safe access to lastMessage
                        const lastMessage = lastMessages[index] || null;
                        
                        return (
                            <ChannelBox
                                key={channel.id}
                                channel={channel}
                                userId={user?.id!}
                                lastMessage={lastMessage}
                                search={search}
                            />
                        );
                    })
                ) : (
                    <p className='text-neutral-500 text-center mt-3'>
                        Create a channel now and start chatting.
                    </p>
                )}
            </div>
        </aside>
    );
}

export default Sidebar;