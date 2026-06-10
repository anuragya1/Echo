import { useEffect, useState } from "react";
import { RxExit } from "react-icons/rx";
import { AiFillEdit } from "react-icons/ai";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { useLocation, useNavigate } from "react-router-dom";

import IconButton from "../../components/buttons/IconButton";
import PageInfo from "../../components/layout/ContentArea/PageInfo";
import StateNotice from "../../components/feedback/StateNotice";
import Spinner from "../../components/loading/Spinner";

import { getChannel, updateChannel } from "../../services/channelService";
import Participant from "./components/Participant";
import { useAuthStore } from "../../zustand/store/useAuthStore";
import type { channel } from "../../utils/types";
import { useChannelStore } from "../../zustand/store/useChannelStore";


const Channel = () => {
    
    const location = useLocation();
    const navigate = useNavigate();
    const user = useAuthStore((state)=>state.user)
    const channelId = location.state?.channelId;
    const [channel, setChannel] = useState<channel>();
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState('');
    const toggleRefresh= useChannelStore((state)=>state.toggleRefresh);

    const fetchChannel = async () => {
        try {
            if (!channelId) {
                setError('No channel was selected.');
                return;
            }

            setIsPending(true);
            setError('');
            const result = await getChannel(channelId);
            setChannel(result.channel);
        } catch {
            setError('Unable to load channel details.');
        } finally {
            setIsPending(false);
        }
    };

    useEffect(() => {
        fetchChannel();
    }, [channelId]);

    const handleClick = async () => {
        const newParticipants: string[] = [];

        if (!channel || !channelId) return;

        for (let i = 0; i < channel.participants.length; i++) {
            if (channel.participants[i].id === user?.id) continue;

            newParticipants.push(channel.participants[i].id);
        }

        await updateChannel(channelId, {
            participants: newParticipants
        });
         toggleRefresh();
        return navigate('/');
    }

    return (
        <section>
            <PageInfo isChannel name={channel?.name || 'Channel'} image={channel?.image} participants={channel?.participants} />
            {isPending && <Spinner size="lg" />}
            {error && <StateNotice title="Channel unavailable" message={error} actionText="Try again" onAction={fetchChannel} />}
            {!isPending && !error && channel && <div className="w-full flex flex-col items-center py-1 xl:py-10 px-3">
                <div className="flex xl:flex-row flex-col my-5 p-3 max-w-[800px] w-full">
                    <LazyLoadImage
                        src={channel?.image}
                        alt='user-pp'
                        effect="blur"
                        className="w-52 h-52 object-cover rounded-full mx-auto mb-5 xl:mb-0"
                    />
                    <div className="max-w-[400px] lg:w-[800px] md:pl-5 w-full">
                        <h1 className="text-2xl font-semibold my-2 xl:text-start text-center">{channel?.name}</h1>
                        <p className="min-h-[100px] break-words text-neutral-300">{channel?.description ? channel.description : 'No Information.'}</p>
                        <div className="flex flex-wrap gap-2">
                            {
                                channel?.admins?.includes(user?.id!)
                                &&
                                <IconButton Icon={AiFillEdit}
                                    handleClick={() => navigate('/edit', { state: { channelId: channel.id } })}
                                    isTextCanClosed
                                    text="Edit"
                                    type="button"
                                />
                            }
                            <IconButton
                                Icon={RxExit}
                                handleClick={handleClick}
                                isTextCanClosed
                                text="Leave"
                                type="button"
                            />
                        </div>
                    </div>
                </div>
                <div className="max-w-[800px] w-full flex flex-col items-start p-3 overflow-y-auto border-t border-neutral-600 pt-10">
                    {
                        channel &&
                        channel?.participants.map((participant) => {
                            return <Participant key={participant.id} participant={participant} isAdmin={channel.admins?.includes(participant.id)!} />
                        })
                    }
                </div>
            </div>}
        </section>
    )
}

export default Channel;
