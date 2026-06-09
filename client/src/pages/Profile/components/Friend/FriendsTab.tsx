import { useEffect, useState } from "react";

import StateNotice from "../../../../components/feedback/StateNotice";
import Spinner from "../../../../components/loading/Spinner";
import { getFriends } from "../../../../services/userService";
import FriendBox from "./FriendBox";
import type { User } from "../../../../utils/types";

type Props = {
  profileId: string;
};

const FriendsTab = ({ profileId }: Props) => {
  const [friends, setFriends] = useState<User[]>();
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState('');

  const fetchFriends = async () => {
    try {
      setIsPending(true);
      setError('');
      const result = await getFriends(profileId);
      setFriends(Array.isArray(result.friends) ? result.friends : []);
    } catch {
      setError('Unable to load friends.');
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [profileId]);

  return (
    <div>
      {isPending && <Spinner size="lg" />}
      {error && <StateNotice title="Friends unavailable" message={error} actionText="Try again" onAction={fetchFriends} />}
      {!isPending && !error && friends?.length === 0 && <StateNotice title="No friends yet" message="Friends will appear here." />}
      {!isPending && !error && friends?.map((friend: User) => {
        return <FriendBox key={friend.id} friend={friend} />
      })}
    </div>
  )
}

export default FriendsTab;
