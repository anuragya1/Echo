import type{ FC } from 'react'
import type { IconType } from 'react-icons'
import Spinner from '../loading/Spinner';

type Props = {
    Icon: IconType;
    text: string;
    type: 'button' | 'submit' | 'reset';
    handleClick: VoidFunction;
    isTextCanClosed: boolean;
    isPending?: boolean
}

const IconButton: FC<Props> = ({ Icon, text, type, handleClick, isTextCanClosed, isPending = false }) => {
    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={isPending}
            aria-label={text}
            className="font-semibold text-base md:text-xl flex items-center px-3 py-2 bg-neutral-700 hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-60 duration-200 rounded-md mt-3 mr-3 min-w-12 flex-1 justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
            {
                isPending
                    ?
                    <Spinner size='sm' />
                    :
                    <>
                        <Icon className='mr-2 text-2xl' />
                        <span className={`${isTextCanClosed ? 'hidden xl:inline' : 'inline'}`}>{text}</span>
                    </>
            }
        </button>
    )
}

export default IconButton
