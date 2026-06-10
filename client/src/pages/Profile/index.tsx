import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageInfo from "../../components/layout/ContentArea/PageInfo";
import StateNotice from "../../components/feedback/StateNotice";
import Spinner from "../../components/loading/Spinner";
import { getUser } from "../../services/userService";
import Info from "./components/Info";
import Tabs from "./components/Tabs";
import type { User } from "../../utils/types";
import { useAuthStore } from "../../zustand/store/useAuthStore";

const Profile = () => {
    const location = useLocation();
    const user = useAuthStore((state) => state.user);
    const profileId = location.state?.userId || user?.id;
    const [profileInfo, setProfileInfo] = useState<User>();
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState('');

    const fetchDetails = async () => {
        try {
            if (!profileId) {
                setError('No profile was selected.');
                return;
            }

            setIsPending(true);
            setError('');
            const result = await getUser(profileId);
            setProfileInfo(result.user);
        } catch {
            setError('Unable to load this profile.');
        } finally {
            setIsPending(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [profileId]);

    return (
        <section>
            <PageInfo isChannel={false} name={profileInfo ? `${profileInfo.username}'s Profile` : 'Profile'} />
            {isPending && <Spinner size="lg" />}
            {error && <StateNotice title="Profile unavailable" message={error} actionText="Try again" onAction={fetchDetails} />}
            {!isPending && !error && profileInfo && (
                <>
                    <Info details={profileInfo} />
                    <Tabs profileId={profileId!} />
                </>
            )}
        </section>
    )
}

export default Profile;
