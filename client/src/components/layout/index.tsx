
import type { FC, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

import socket from '../../lib/socket';
import { useAuthStore } from '../../zustand/store/useAuthStore';
import ContentArea from './ContentArea';
import Sidebar from './Sidebar';

type Props = {
  children: ReactNode;
};

const Layout: FC<Props> = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname, location.state]);

  useEffect(() => {
    if (!user?.id) {
      socket.disconnect();
      return;
    }

    const emitOnlineStatus = () => {
      if (socket.connected) {
        socket.emit('user-online');
      }
    };

    if (!socket.connected) {
      socket.connect();
    } else {
      socket.disconnect().connect();
    }

    socket.on('connect', emitOnlineStatus);

    return () => {
      socket.off('connect', emitOnlineStatus);
    };
  }, [user?.id]);

  if (location.pathname === '/login' || location.pathname === '/register') {
    return <>{children}</>;
  }

  return (
    <div className="h-[100dvh] flex items-center justify-center bg-neutral-950 md:p-4">
      <div className="relative grid grid-cols-1 md:grid-cols-5 xl:grid-cols-7 lg:w-[90%] lg:h-[90%] max-w-[1600px] w-full h-full md:max-h-[1000px] bg-neutral-800 md:rounded-md overflow-hidden">
        <div className="md:hidden sticky top-0 z-40 h-14 bg-neutral-900 border-b border-neutral-700 flex items-center px-3">
          <button
            type="button"
            aria-label="Open chats"
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <FiMenu className="text-2xl" />
          </button>
          <p className="ml-3 font-semibold truncate">Echo</p>
        </div>
        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Close chats"
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <ContentArea>{children}</ContentArea>
      </div>
    </div>
  );
};

export default Layout;
