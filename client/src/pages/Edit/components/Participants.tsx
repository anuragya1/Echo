import type{ Dispatch, FC, SetStateAction } from "react";
import { useState,useEffect } from "react";
import { useAuthStore } from "../../../zustand/store/useAuthStore";
import { getFriends } from "../../../services/userService";
import UserBar from "./UserBar";
import type { User } from "../../../utils/types";
import Spinner from "../../../components/loading/Spinner";
import StateNotice from "../../../components/feedback/StateNotice";
type Props = {
    participants: string[];
    setParticipants: Dispatch<SetStateAction<string[]>>;
    admins: string[];
    setAdmins: Dispatch<SetStateAction<string[]>>;
}

const Participants: FC<Props> = ({ participants, setParticipants, admins, setAdmins }) => {
    const user = useAuthStore((state) => state.user);
    const [search, setSearch] = useState<string>('');
    const [friends, setFriends] = useState<User[]>();
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState('');

    const fetchFriends = async () => {
        try {
            setIsPending(true);
            setError('');
            const result = await getFriends(user?.id!);
            setFriends(Array.isArray(result.friends) ? result.friends : []);
        } catch {
            setError('Unable to load friends.');
        } finally {
            setIsPending(false);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, [user?.id])

    return (
        <div className="w-full py-5 flex">
            <div className="w-full py-3 grid grid-cols-1 xl:grid-cols-2 gap-3">
                <div className="w-full">
                    <p className="text-xl font-semibold">Friends</p>
                    <div className="py-3">
                        <input
                            onChange={(e: any) => setSearch(e.target.value)}
                            type="text"
                            className="border-neutral-900 outline-none w-full rounded-md bg-neutral-700 py-3 px-2"
                            placeholder="Search a friend..."
                        />
                    </div>
                    <div className="overflow-auto">
                        {isPending && <Spinner size="sm" />}
                        {error && <StateNotice title="Friends unavailable" message={error} actionText="Try again" onAction={fetchFriends} />}
                        {!isPending && !error && friends?.length === 0 && <p className="text-neutral-400">No friends to add yet.</p>}
                        {!isPending && !error &&
                            friends?.map((friend: User) => {
                                return (
                                    !participants.includes(friend.id)
                                    &&
                                    <UserBar
                                        search={search}
                                        isAdded={false}
                                        key={friend.id}
                                        user={friend}
                                        participants={participants}
                                        setParticipants={setParticipants}
                                        admins={admins}
                                        setAdmins={setAdmins}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
                <div className="xl:w-[380px]">
                    <p className="text-xl font-semibold mb-2">Participants  ({participants?.length})</p>
                    {
                        participants
                        &&
                        participants.map((participant: string, index) => {
                            return (
                                <UserBar
                                    search={search}
                                    isAdded={true}
                                    key={index}
                                    userId={participant}
                                    participants={participants}
                                    setParticipants={setParticipants}
                                    admins={admins}
                                    setAdmins={setAdmins}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Participants
