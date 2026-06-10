import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import PageInfo from '../../components/layout/ContentArea/PageInfo';
import StateNotice from '../../components/feedback/StateNotice';
import Spinner from '../../components/loading/Spinner';
import useChatScroll from '../../hooks/useChatScroll';
import socket from '../../lib/socket';

import { getChannel } from '../../services/channelService';
import { getMessagesByChannel } from '../../services/messageService';
import ChatInput from './components/ChatInput';
import Message from './components/Message';
import { useAuthStore } from '../../zustand/store/useAuthStore';
import type { channel, message } from '../../utils/types';

const Chat = () => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const channelId = location.state?.channelId;

  const [channel, setChannel] = useState<channel>();
  const [messages, setMessages] = useState<message[]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isSocketReady, setIsSocketReady] = useState(socket.connected);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);
  const [otherUserId, setOtherUserId] = useState<string>('');
  const [socketError, setSocketError] = useState('');

  const ref = useChatScroll(messages);

  // Monitor socket connection status
  useEffect(() => {
    const handleConnect = () => {
      setIsSocketReady(true);
      setSocketError('');
    };

    const handleDisconnect = () => {
      setIsSocketReady(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    setIsSocketReady(socket.connected);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  // Fetch channel and messages
  useEffect(() => {
    if (!channelId) {
      setIsPending(false);
      setError('No channel was selected.');
      return;
    }

    setIsPending(true);
    setError('');

    const fetchChannel = async () => {
      try {
        const result = await getChannel(channelId);
        setChannel(result.channel);

        if (result.channel.participants.length === 2 && !result.channel.name) {
          const otherUser = result.channel.participants[0].id === user?.id
            ? result.channel.participants[1]
            : result.channel.participants[0];
          setOtherUserId(otherUser.id);
        }
      } catch {
        setError('Unable to load this channel.');
      }
    };

    const fetchMessages = async () => {
      try {
        const result = await getMessagesByChannel(channelId);
        setMessages(result.messages || result);
      } catch {
        setError('Unable to load messages. Please try again.');
      } finally {
        setIsPending(false);
      }
    };

    if (user?.id) {
      fetchMessages();
      fetchChannel();
    }
  }, [channelId, user?.id]);

  
  useEffect(() => {
    if (!channel?.id || !isSocketReady) {
      return;
    }

    socket.emit('join-group', channel.id);

    if (otherUserId) {
      socket.emit('check-user-status', {
        userId: otherUserId,
        channelId: channel.id
      });
    }

    const handleJoinedGroup = () => {};

    const handleChat = (data: any) => { 
      if (
        data.channelId === channel?.id ||
        data.groupId === channel?.id ||
        data.GroupId === channel?.id
      ) {
        setIsOtherUserTyping(false);
        setMessages((prev) => (Array.isArray(prev) ? [...prev, data] : [data]));
      }
    };

    const handleUserTyping = (data: any) => {
      if (data.groupId === channel.id && data.userId !== user?.id) {
        setIsOtherUserTyping(true);
      }
    };

    const handleUserStopTyping = (data: any) => {
      if (data.groupId === channel.id && data.userId !== user?.id) {
        setIsOtherUserTyping(false);
      }
    };

    const handleUserStatusResponse = (data: any) => {
      if (data.userId === otherUserId) {
        setIsOtherUserOnline(data.status === 'online');
      }
    };

    const handleUserStatusChange = (data: any) => {
      if (data.userId === otherUserId) {
        setIsOtherUserOnline(data.status === 'online');
      }
    };

    const handleSocketError = (data: any) => {
      setSocketError(data?.message || 'Socket connection failed.');
    };

    socket.on('joined-group', handleJoinedGroup);
    socket.on('chat', handleChat);
    socket.on('user-typing', handleUserTyping);
    socket.on('user-stop-typing', handleUserStopTyping);
    socket.on('user-status-response', handleUserStatusResponse);
    socket.on('user-status-change', handleUserStatusChange);
    socket.on('error', handleSocketError);

    return () => {
      socket.emit('leave-group', channel.id);
      socket.off('joined-group', handleJoinedGroup);
      socket.off('chat', handleChat);
      socket.off('user-typing', handleUserTyping);
      socket.off('user-stop-typing', handleUserStopTyping);
      socket.off('user-status-response', handleUserStatusResponse);
      socket.off('user-status-change', handleUserStatusChange);
      socket.off('error', handleSocketError);

      setIsOtherUserTyping(false);
      setIsOtherUserOnline(false);
    };
  }, [channel?.id, user?.id, isSocketReady, otherUserId]);

  return (
    <section className="h-full relative overflow-hidden flex flex-col">
      {!channelId ? (
        <StateNotice title="No channel selected" message="Open a conversation from the sidebar to start chatting." />
      ) : <PageInfo
        isChannel={true}
        name={
          channel?.name
            ? channel?.name
            : channel?.participants[0].username === user?.username
            ? channel?.participants[1].username
            : channel?.participants[0].username
        }
        participants={channel?.name ? channel?.participants : null}
        image={
          channel?.name
            ? channel.image
            : channel?.participants[0].username === user?.username
            ? channel?.participants[1].image
            : channel?.participants[0].image
        }
        isOnline={!channel?.name && isOtherUserOnline}
      />}

      {(!isSocketReady || socketError) && (
        <div className="bg-yellow-600/90 text-sm px-4 py-2 text-center">
          {socketError || 'Realtime connection is offline. Messages may be delayed.'}
        </div>
      )}

      <div
        ref={ref}
        className="flex-1 min-h-0 flex flex-col overflow-x-hidden overflow-y-auto pb-4 scroll-smooth"
      >
        {!isPending ? (
          error ? (
            <p className="bg-red-600 p-3 m-2 rounded-md text-center">
              {error}
            </p>
          ) : messages && messages.length > 0 ? (
            messages.map((message) => (
              <Message key={message.id || String(message.createdAt)} message={message} />
            ))
          ) : (
            <p className="bg-cyan-600 p-3 m-2 rounded-md text-center">
              There are no messages yet.
            </p>
          )
        ) : (
          <Spinner size="lg" />
        )}

        {isOtherUserTyping && isSocketReady && (
          <div className="px-4 py-2 flex items-center space-x-2 mb-2">
            <div className="flex space-x-1">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
      </div>

      {channel?.id && <ChatInput channelId={channel.id} />}
    </section>
  );
};

export default Chat;
