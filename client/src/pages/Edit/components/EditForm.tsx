import type{ Dispatch, FC, SetStateAction } from 'react'
import {useRef, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import BasicButton from '../../../components/buttons/BasicButton';
import { uploadUserImage } from '../../../services/userService';
import Participants from './Participants';
import { updateChannel } from '../../../services/channelService';
import type { channel } from '../../../utils/types';
import { useChannelStore } from '../../../zustand/store/useChannelStore';


type Props = {
    channel: channel;
    participants: string[];
    setParticipants: Dispatch<SetStateAction<string[]>>;
    admins: string[];
    setAdmins: Dispatch<SetStateAction<string[]>>;
    image: any;
    setImage: Dispatch<SetStateAction<any>>;
}

const EditForm: FC<Props> = ({ channel, participants, setParticipants, admins, setAdmins, image, setImage }) => {
     const toggleRefresh = useChannelStore((state)=>state.toggleRefresh)
    const inputRef = useRef<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!e.target.name.value.trim()) {
            return toast.error('Channel name is required.', {
                duration: 3000,
                position: 'bottom-center',
                style: {
                    backgroundColor: '#353535',
                    color: '#fff'
                }
            });
        }

        var imageUrl = image;

        try {
            setIsSaving(true);

            if (image !== channel.image && e.target.image.files[0]) {
                imageUrl = await uploadUserImage(e.target.image.files[0]);
            }

            const { statusCode, message } = await updateChannel(channel.id, {
                name: e.target.name.value,
                participants,
                admins,
                description: e.target.description.value,
                image: imageUrl
            });

            if (statusCode === '200') {
                toggleRefresh();

                return toast.success(message, {
                    duration: 3000,
                    position: 'bottom-center',
                    style: {
                        backgroundColor: '#353535',
                        color: '#fff'
                    }
                });
            }

            toast.error(message, {
                duration: 3000,
                position: 'bottom-center',
                style: {
                    backgroundColor: '#353535',
                    color: '#fff'
                }
            });
        } catch {
            toast.error('Unable to save channel. Please try again.', {
                duration: 3000,
                position: 'bottom-center',
                style: {
                    backgroundColor: '#353535',
                    color: '#fff'
                }
            });
        } finally {
            setIsSaving(false);
        }
    }

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e: any) => {
        const imageFile = e.target.files[0];

        if (imageFile && FileReader) {
            const fr = new FileReader();
            fr.onload = () => {
                setImage(fr.result);
            }
            fr.readAsDataURL(imageFile);
        }
    }

    return (
        <form action='POST' className='max-w-[800px] px-3 mx-auto overflow-y-auto overflow-x-hidden pb-8' onSubmit={handleSubmit}>
            <div className='flex items-center justify-center w-full lg:flex-row flex-col py-5 border-b border-neutral-600'>
                <LazyLoadImage
                    className={`rounded-full w-52 h-52 object-cover cursor-pointer duration-200 ${!image && 'border-2 border-neutral-600 hover:bg-neutral-700'}`}
                    src={image}
                    alt='ch'
                    onClick={handleClick}
                />
                <input onChange={handleChange} ref={inputRef} type="file" hidden name="image" accept='image/png, image/jpeg' />
                <div className='md:pl-3 lg:pl-5 w-full md:w-[350px]'>
                    <div className='flex flex-col mb-3'>
                        <label htmlFor="name">Name</label>
                        <input
                            defaultValue={channel?.name}
                            className='bg-neutral-700 rounded-md p-2 outline-none'
                            placeholder='Channel Name'
                            maxLength={50}
                            type="text"
                            name='name'
                            required
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="description">Description</label>
                        <textarea
                            defaultValue={channel?.description}
                            name='description'
                            placeholder='Channel Description'
                            className='bg-neutral-700 p-2 resize-none rounded-md outline-none'
                            maxLength={255}
                            cols={20}
                            rows={5}
                        />
                    </div>
                </div>
            </div>
            <Participants
                participants={participants}
                setParticipants={setParticipants}
                admins={admins}
                setAdmins={setAdmins}
            />
            <div className='p-3 lg:p-0'>
                <BasicButton type='submit' disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</BasicButton>
            </div>
            <Toaster />
        </form>
    )
}

export default EditForm;
