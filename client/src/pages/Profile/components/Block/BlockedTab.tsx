import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

import StateNotice from '../../../../components/feedback/StateNotice';
import Spinner from '../../../../components/loading/Spinner';
import { getBlocked } from '../../../../services/userService';
import BlockedBox from './BlockedBox';
import type { User } from "../../../../utils/types";
const BlockedTab = () => {
  const location = useLocation();
  const [blocked, setBlocked] = useState<User[]>();
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState('');

  const fetchBlocked = async () => {
    try {
      setIsPending(true);
      setError('');
      const result = await getBlocked(location.state.userId);
      setBlocked(Array.isArray(result.blocked) ? result.blocked : []);
    } catch {
      setError('Unable to load blocked users.');
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    fetchBlocked();
  }, [location.state.userId]);

  return (
    <div>
      {isPending && <Spinner size="lg" />}
      {error && <StateNotice title="Blocked users unavailable" message={error} actionText="Try again" onAction={fetchBlocked} />}
      {!isPending && !error && blocked?.length === 0 && <StateNotice title="No blocked users" message="Blocked users will appear here." />}
      {!isPending && !error && blocked?.map((item)=>{
        return <BlockedBox key={item.id} blocked={item} />
      })}
    </div>
  )
}

export default BlockedTab
