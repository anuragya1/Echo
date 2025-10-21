import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import PageInfo from '../../components/layout/ContentArea/PageInfo';
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

  const [channel, setChannel] = useState<channel>();
  const [messages, setMessages] = useState<message[]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isSocketReady, setIsSocketReady] = useState(socket.connected);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [typingUsername, setTypingUsername] = useState<string>('');
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);
  const [otherUserId, setOtherUserId] = useState<string>('');

  const ref = useChatScroll(messages);

  // Monitor socket connection status
  useEffect(() => {
    const handleConnect = () => {
      console.log('Socket connected in Chat');
      setIsSocketReady(true);
    };

    const handleDisconnect = () => {
      console.log(' Socket disconnected in Chat');
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
    if (!location.state?.channelId) return;
    setIsPending(true);

    const fetchChannel = async () => {
      const result = await getChannel(location.state.channelId);
      setChannel(result.channel);

      if (result.channel.participants.length === 2 && !result.channel.name) {
        const otherUser = result.channel.participants[0].id === user?.id
          ? result.channel.participants[1]
          : result.channel.participants[0];
        setOtherUserId(otherUser.id);
        console.log('Other user ID:', otherUser.id);
      }
    };

    const fetchMessages = async () => {
      const result = await getMessagesByChannel(location.state.channelId);
      console.log("Fetched messages:", result);
      setMessages(result.messages || result);
      setIsPending(false);
    };

    if (user?.id) {
      fetchMessages();
      fetchChannel();
    }
  }, [location.state?.channelId, user?.id]);

  
  useEffect(() => {
    if (!channel?.id || !isSocketReady) {
      console.log('Waiting for socket or channel...', { channelId: channel?.id, isSocketReady });
      return;
    }

    console.log('Attempting to join room:', channel.id);
    socket.emit('join-group', channel.id);

    if (otherUserId) {
      console.log('Checking status for user:', otherUserId);
      socket.emit('check-user-status', {
        userId: otherUserId,
        channelId: channel.id
      });
    }

    const handleJoinedGroup = (data: any) => {
      console.log('Successfully joined room:', data.groupId);
    };

    const handleChat = (data: any) => { 
      console.log('Received chat event:', data);

      if (
        data.channelId === channel?.id ||
        data.groupId === channel?.id ||
        data.GroupId === channel?.id
      ) {
        setIsOtherUserTyping(false);
        setTypingUsername('');
        setMessages((prev) => (Array.isArray(prev) ? [...prev, data] : [data]));
      }
    };

    const handleUserTyping = (data: any) => {
      console.log(' User typing event received:', data);

      if (data.groupId === channel.id && data.userId !== user?.id) {
        console.log('Showing typing for:', data.username);
        setIsOtherUserTyping(true);
        setTypingUsername(data.username);
      }
    };

    const handleUserStopTyping = (data: any) => {
      console.log(' User stopped typing event received:', data);

      if (data.groupId === channel.id && data.userId !== user?.id) {
        console.log('Hiding typing indicator');
        setIsOtherUserTyping(false);
        setTypingUsername('');
      }
    };

    const handleUserStatusResponse = (data: any) => {
      console.log(' User status response:', data);
      if (data.userId === otherUserId) {
        setIsOtherUserOnline(data.status === 'online');
        console.log(' Other user online status:', data.status === 'online');
      }
    };

    const handleUserStatusChange = (data: any) => {
      console.log('User status changed:', data);
      if (data.userId === otherUserId) {
        setIsOtherUserOnline(data.status === 'online');
        console.log('Updated online status to:', data.status === 'online');
      }
    };

    socket.on('joined-group', handleJoinedGroup);
    socket.on('chat', handleChat);
    socket.on('user-typing', handleUserTyping);
    socket.on('user-stop-typing', handleUserStopTyping);
    socket.on('user-status-response', handleUserStatusResponse);
    socket.on('user-status-change', handleUserStatusChange);

    return () => {
      console.log('Cleaning up socket listeners for:', channel.id);
      socket.emit('leave-group', channel.id);
      socket.off('joined-group', handleJoinedGroup);
      socket.off('chat', handleChat);
      socket.off('user-typing', handleUserTyping);
      socket.off('user-stop-typing', handleUserStopTyping);
      socket.off('user-status-response', handleUserStatusResponse);
      socket.off('user-status-change', handleUserStatusChange);

      setIsOtherUserTyping(false);
      setTypingUsername('');
      setIsOtherUserOnline(false);
    };
  }, [channel?.id, user?.id, isSocketReady, otherUserId]);

  return (
    <section className="h-full relative overflow-hidden">
      <PageInfo
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
      />

      <div
        ref={ref}
        className="flex flex-col overflow-x-hidden overflow-y-auto pb-10 h-[85%] scroll-smooth"
      >
        {!isPending ? (
          messages && messages.length > 0 ? (
            messages.map((message, index) => (
              <Message key={index} message={message} />
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

      <ChatInput channelId={channel?.id!} setMessages={setMessages} />
    </section>
  );
};

export default Chat;