import { useEffect, useState } from "react";
import PageInfo from "../../components/layout/ContentArea/PageInfo";
import StateNotice from "../../components/feedback/StateNotice";
import Spinner from "../../components/loading/Spinner";
import { getUsersBySearch } from "../../services/userService";
import Box from "./components/Box";
import Search from "./components/Search";
import type { User } from "../../utils/types";
const AddFriend = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isPending, setIsPending] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        if (!search.trim()) return;

        setIsPending(true);
        setError('');
        try {
            const result = await getUsersBySearch(search);
            setUsers(Array.isArray(result.users) ? result.users : []);
        } catch {
            setUsers([]);
            setError('Unable to search users right now.');
        } finally {
            setIsPending(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search]);

    return (
        <section>
            <PageInfo isChannel={false} name='Add Friend' />
            <div className="overflow-y-auto px-3 pb-8">
                <Search search={search} setSearch={setSearch} />
                {
                    search && <p className="text-center">{users.length || 0} results found.</p>
                }
                {
                    isPending && <Spinner size="lg" />
                }
                {error && <StateNotice title="Search failed" message={error} actionText="Try again" onAction={fetchUsers} />}
                {!isPending && !error &&
                    <div className="w-full max-w-[800px] mx-auto mt-10">
                        {
                            (users.length > 0 && search)
                            ?
                            users.map((user: User) => {
                                return <Box key={user.id} user={user} />
                            })
                            :
                            search && <StateNotice title="No users found" message="Try another username." />
                        }
                    </div>
                }

            </div>
        </section>
    )
}

export default AddFriend;
