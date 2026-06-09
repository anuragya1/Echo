import type { FC } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { RxDotsVertical } from 'react-icons/rx';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useLocation, useNavigate } from 'react-router-dom';

import type { User } from '../../../utils/types';

type Props = {
  image?: string;
  name: string;
  participants?: User[] | null;
  isChannel: boolean;
  isOnline?: boolean;
};

const PageInfo: FC<Props> = ({ image, name, participants, isChannel, isOnline = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (location.pathname === '/chat')
      return navigate('/channel', { state: { channelId: location.state.channelId } });
    navigate('/chat', { state: { channelId: location.state.channelId } });
  };

  return (
    <div className="flex items-center gap-2 md:gap-4 px-3 md:px-5 w-full sticky z-30 top-0 bg-neutral-900 border-b border-neutral-700 min-h-20 py-3">
      <button
        type="button"
        aria-label="Go back"
        className="shrink-0 p-2 rounded-md hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
      </button>
      {image && (
        <LazyLoadImage
          src={image}
          alt="channel-pp"
          effect="blur"
          className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover shrink-0"
        />
      )}
      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="text-lg md:text-2xl font-semibold truncate">{name}</p>

        {!participants && isOnline && (
          <p className="text-xs text-green-400 font-normal mt-1">● Online</p>
        )}

        {participants && (
          <div className="text-sm text-neutral-300 mt-1 truncate">
            <span className="font-semibold">Participants: </span>
            {participants.map((participant) => participant.username).join(', ')}
          </div>
        )}
      </div>
      {isChannel && participants !== null && (
        <button
          type="button"
          aria-label="Open channel details"
          className="shrink-0 p-2 rounded-md hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          onClick={handleClick}
        >
          <RxDotsVertical />
        </button>
      )}
    </div>
  );
};

export default PageInfo;
