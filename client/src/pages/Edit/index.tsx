import { useLocation } from 'react-router-dom';
import PageInfo from '../../components/layout/ContentArea/PageInfo';
import StateNotice from '../../components/feedback/StateNotice';
import Spinner from '../../components/loading/Spinner';
import EditForm from './components/EditForm';
import { useEffect, useState } from 'react';
import { getChannel } from '../../services/channelService';
import type { channel } from '../../utils/types';
const Create = () => {
    const { state } = useLocation();
    const [channel, setChannel] = useState<channel>();
    const [participants, setParticipants] = useState<string[]>([]);
    const [admins, setAdmins] = useState<string[]>([]);
    const [image, setImage] = useState();
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState('');

    const fetchChannel = async () => {
        try {
            setIsPending(true);
            setError('');
            const result = await getChannel(state.channelId);
            setImage(result.channel.image);
            setChannel(result.channel);
            setAdmins(result.channel.admins)
            setParticipants(result.participants);
        } catch {
            setError('Unable to load channel settings.');
        } finally {
            setIsPending(false);
        }
    };

    useEffect(() => {
        fetchChannel();
    }, [state]);

    return (
        <section>
            <PageInfo isChannel={false} name='Edit Channel' />
            {isPending && <Spinner size="lg" />}
            {error && <StateNotice title="Edit unavailable" message={error} actionText="Try again" onAction={fetchChannel} />}
            {!isPending && !error && channel && <EditForm
                channel={channel!}
                participants={participants}
                setParticipants={setParticipants}
                admins={admins}
                setAdmins={setAdmins}
                image={image}
                setImage={setImage}
            />}
        </section>
    )
}

export default Create;
