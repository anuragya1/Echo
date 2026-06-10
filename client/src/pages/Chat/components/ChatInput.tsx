import type { FC, ChangeEvent } from 'react';
import { useRef, useState } from 'react';
import { ImAttachment } from 'react-icons/im';
import { IoMdSend } from 'react-icons/io';
import { GiCancel } from 'react-icons/gi';

import socket from '../../../lib/socket';
import { uploadImages } from '../../../services/userService';
import { useAuthStore } from '../../../zustand/store/useAuthStore';

type Props = {
  channelId: string;
};

const ChatInput: FC<Props> = ({ channelId }) => {
  const user = useAuthStore((state) => state.user);
  const [images, setImages] = useState<any[] | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [sendError, setSendError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const uploadInputRef = useRef<any>(null);
  const typingTimeoutRef = useRef<any>(null);

  const stopTyping = () => {
    if (isTyping && user) {
      socket.emit('stop-typing', {
        userId: user.id,
        groupId: channelId
      });
      setIsTyping(false);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!e.target.chat.value && !images) return;
    if (!socket.connected) {
      setSendError('Realtime connection is offline. Please try again.');
      return;
    }

    stopTyping();

    setIsPending(true);
    setSendError('');

    try {
      const result = images && (await uploadImages(images));
      const message = {
        text: e.target.chat.value,
        userId: user?.id,
        images: result || null,
        user: {
          username: user?.username
        },
        channelId
      };

      setImages(null);
      socket.timeout(5000).emit('chat', message, (error: Error | null, response: any) => {
        setIsPending(false);

        if (error || !response?.ok) {
          setSendError(response?.message || 'Message failed to send. Please try again.');
          return;
        }

        e.target.chat.value = '';
      });
    } catch {
      setIsPending(false);
      setSendError('Upload failed. Please try again.');
    }
  };

  const handleUploadImage = (e: any) => {
    e.preventDefault();
    uploadInputRef.current.click();
  };

  const handleChange = (e: any) => {
    setImages(e.target.files);
  };

  const handleTyping = (e: ChangeEvent<HTMLInputElement>) => {
    if (!user) return;

    const value = e.target.value;

    if (value.trim().length === 0) {
      stopTyping();
      return;
    }

    if (!isTyping) {
      socket.emit('typing', {
        userId: user.id,
        username: user.username,
        groupId: channelId
      });
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 1000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      method="POST"
      className="w-full mt-auto bg-neutral-900 p-3 sticky bottom-0 border-t border-neutral-700"
    >
      {sendError && (
        <p className="mb-2 rounded-md bg-red-600 px-3 py-2 text-sm text-center">
          {sendError}
        </p>
      )}
      {isPending && (
        <p className="mb-2 text-sm text-neutral-300 text-center">
          Sending...
        </p>
      )}
      {images && (
        <div className="pb-3 flex flex-wrap items-center gap-2">
          <GiCancel onClick={() => setImages(null)} className="mx-4 cursor-pointer" />
          {Array.from({ length: images!.length }, (_, i) => i).map((index) => {
            return (
              <span className="max-w-full truncate text-sm text-neutral-300" key={index}>
                {images![index].name}
              </span>
            );
          })}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          ref={uploadInputRef}
          type="file"
          multiple
          onChange={handleChange}
          hidden
          accept="image/png, image/jpeg"
        />
        <button type="button" aria-label="Attach images" className="shrink-0 p-2" onClick={handleUploadImage}>
          <ImAttachment className="text-2xl hover:text-neutral-300 duration-200" />
        </button>
        <input
          readOnly={isPending}
          spellCheck="false"
          type="text"
          name="chat"
          onChange={handleTyping}
          className="bg-neutral-800 rounded-lg min-w-0 flex-1 h-10 outline-none p-2"
        />
        <button type="submit" aria-label="Send message" className="shrink-0 p-2 disabled:opacity-60" disabled={isPending}>
          <IoMdSend className="text-2xl hover:text-neutral-300 duration-200" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
