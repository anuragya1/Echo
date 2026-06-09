import type { FC } from "react";
import { toast, Toaster } from "react-hot-toast";
import { BiBlock } from "react-icons/bi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import IconButton from "../../../../components/buttons/IconButton";
import type { User } from "../../../../utils/types";
import useBlockStatus from "../../../../hooks/useBlockStatus";

type Props = {
    blocked: User;
}

const BlockedBox: FC<Props> = ({ blocked }) => {
    const navigate = useNavigate();
    const { isPending, isBlocked, addBlock, removeBlock } = useBlockStatus(blocked.id);

    const handleBlock = () => {
        addBlock();

        return toast.success('User blocked successfully.', {
            duration: 3000,
            position: 'bottom-center',
            style: {
                backgroundColor: '#353535',
                color: '#fff'
            }
        });
    };

    const handleUnblock = () => {
        removeBlock();

        return toast.success('User unblocked successfully.', {
            duration: 3000,
            position: 'bottom-center',
            style: {
                backgroundColor: '#353535',
                color: '#fff'
            }
        });
    };

    return (
        <>
            <div className="flex flex-wrap gap-3 p-3 items-center">
                <LazyLoadImage
                    onClick={() => navigate('/profile', { state: { userId: blocked.id } })}
                    src={blocked.image}
                    alt='blocked'
                    effect="blur"
                    className="w-20 h-20 rounded-full object-cover cursor-pointer md:block hidden"
                />
                <p
                    onClick={() => navigate('/profile', { state: { userId: blocked.id } })}
                    className="min-w-0 flex-1 text-xl font-semibold cursor-pointer truncate">
                    {blocked.username}
                </p>
                <div className="w-full sm:w-auto sm:min-w-[180px] flex flex-wrap ml-auto">
                    {
                        isBlocked
                            ?
                            <IconButton
                                isTextCanClosed
                                Icon={BiBlock}
                                text='Unblock'
                                type="button"
                                handleClick={handleUnblock}
                                isPending={isPending}
                            />
                            :
                            <IconButton
                                isTextCanClosed
                                Icon={BiBlock}
                                text='Block'
                                type="button"
                                handleClick={handleBlock}
                                isPending={isPending}
                            />
                    }
                </div>
            </div>
            <Toaster />
        </>
    )
}

export default BlockedBox;
