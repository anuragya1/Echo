import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import StateNotice from '../../../../components/feedback/StateNotice';
import Spinner from '../../../../components/loading/Spinner';
import { getRequests } from '../../../../services/userService';
import RequestBox from './RequestBox';
import type { User } from "../../../../utils/types";
const RequestsTab = () => {
  const location = useLocation();
  const [requests, setRequests] = useState<User[]>();
  const [trigger, setTrigger] = useState<boolean>(false);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    try {
      setIsPending(true);
      setError('');
      const result = await getRequests(location.state.userId);
      setRequests(Array.isArray(result.requests) ? result.requests : []);
    } catch {
      setError('Unable to load requests.');
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [location.state.userId, trigger]);

  return (
    <div>
      {isPending && <Spinner size="lg" />}
      {error && <StateNotice title="Requests unavailable" message={error} actionText="Try again" onAction={fetchRequests} />}
      {!isPending && !error && requests?.length === 0 && <StateNotice title="No requests" message="Friend requests will appear here." />}
      {!isPending && !error && requests?.map((request) => {
        return <RequestBox key={request.id} request={request} setTrigger={setTrigger} />
      })}
    </div>
  )
}

export default RequestsTab
