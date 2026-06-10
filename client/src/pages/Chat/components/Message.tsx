import type{ FC } from 'react'
import { useState } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { updateMessage } from '../../../services/messageService';
import { formatChatDate, formatChatTime, isToday } from '../../../utils/date';
import type { message } from '../../../utils/types';
import { useAuthStore } from '../../../zustand/store/useAuthStore';

type Props = {
    message: message;
}

const Message: FC<Props> = ({ message }) => {
    const user = useAuthStore((state)=>state.user)
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [deleted, setDeleted] = useState(false);

    const handleDelete = async () => {
        const messageDoc = {
            images: null,
            text: 'This message has been deleted.'
        }
        await updateMessage(message.id, messageDoc);
        setDeleted(true);
        setIsOpen(false);
    }

    return (
        <div
            className={`
                rounded-md w-fit max-w-[88%] sm:max-w-[72%] p-3 m-3 flex flex-col relative group break-words
                ${message.userId === user?.id ? 'bg-cyan-600 ml-auto' : 'bg-neutral-900'}
            `}
        >
            {
                (message.user?.id === user?.id && message.text !== 'This message has been deleted.' && !deleted)
                &&
                <div className='absolute hidden group-hover:block group-focus-within:block top-2 right-1 z-30 w-[98%] bg-[rgba(8,145,178,.7)] transition-all duration-200'>
                    {
                        isOpen
                            ?
                            <div className='top-3 right-0 p-3 bg-cyan-500 shadow-xl absolute w-32 rounded-md'>
                                <p className='text-xl font-semibold'>Delete ?</p>
                                <button onClick={handleDelete} className='mr-5 font-medium text-lg py-2 hover:underline'>Yes</button>
                                <button onClick={() => setIsOpen(false)} className='py-2 font-medium text-lg hover:underline'>No</button>
                            </div>
                            :
                            <button type="button" aria-label="Message actions" className="ml-auto block" onClick={() => setIsOpen(prev => !prev)}>
                                <HiOutlineChevronDown className='text-3xl cursor-pointer' />
                            </button>
                    }
                </div>
            }
            {
                (message.images && message.images!.length > 0 && !deleted)
                &&
                message.images.map((image: string, index) => {
                    return (
                        <LazyLoadImage
                            key={index}
                            className='max-w-full w-auto max-h-72 object-contain mb-2 mx-auto rounded-md'
                            effect='blur'
                            src={image}
                            alt="message"
                        />
                    )
                })
            }
            <p className="whitespace-pre-wrap break-words">{deleted ? 'This message has been deleted.' : message.text}</p>
            <div className={`flex flex-wrap gap-x-3 justify-between text-xs mt-2 ${message.userId === user?.id ? 'text-neutral-300' : 'text-neutral-400'}`}>
                <p className='truncate'>{message.user?.username !== user?.username && message.user?.username}</p>
                <p className="ml-auto shrink-0">
                    {
                        isToday(message.createdAt)
                            ?
                            formatChatTime(message.createdAt)
                            :
                            formatChatDate(message.createdAt, true)
                    }
                </p>
            </div>
        </div>
    )
}

export default Message;
