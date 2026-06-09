import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useEffect, useRef, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import type { User } from '../../utils/types';
import { useAuthStore } from '../../zustand/store/useAuthStore';
import PageInfo from '../../components/layout/ContentArea/PageInfo';
import StateNotice from '../../components/feedback/StateNotice';
import Spinner from '../../components/loading/Spinner';
import BasicButton from '../../components/buttons/BasicButton';
import { getUser, updateUser, uploadUserImage } from '../../services/userService';

const ProfileEdit = () => {
  const user = useAuthStore((state) => state.user); 
  const [details, setDetails] = useState<User>();
  const [image, setImage] = useState<any>();
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<any>(null);

  const fetchUser = async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      setError('');
      const result = await getUser(user.id);
      setDetails(result.user);
    } catch {
      setError('Unable to load your profile.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [user?.id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const username = e.target.username.value;
    const about = e.target.about.value;

    if (!username || username.length < 5) {
      return toast.error('Username must be at least 5 characters.', {
        duration: 3000,
        position: 'bottom-center',
        style: {
          backgroundColor: '#353535',
          color: '#fff',
        },
      });
    }

    let statusCode: string;
    let message: string;

    try {
      setIsSaving(true);

      if (image) {
        const secureUrl = await uploadUserImage(image);
        ({ statusCode, message } = await updateUser(user?.id!, { username, about, image: secureUrl }));
      } else {
        ({ statusCode, message } = await updateUser(user?.id!, { username, about }));
      }
    } catch {
      setIsSaving(false);
      return toast.error('Unable to save profile. Please try again.', {
        duration: 3000,
        position: 'bottom-center',
        style: {
          backgroundColor: '#353535',
          color: '#fff',
        },
      });
    } finally {
      setIsSaving(false);
    }

    if (statusCode === '200') {
      return toast.success(message, {
        duration: 3000,
        position: 'bottom-center',
        style: {
          backgroundColor: '#353535',
          color: '#fff',
        },
      });
    }

    return toast.error(message, {
      duration: 3000,
      position: 'bottom-center',
      style: {
        backgroundColor: '#353535',
        color: '#fff',
      },
    });
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleChange = (e: any) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;
    setName(imageFile.name);

    if (imageFile && FileReader) {
      const fr = new FileReader();
      fr.onload = () => {
        setImage(fr.result);
      };
      fr.readAsDataURL(imageFile);
    }
  };
    return (
        <section>
            <PageInfo isChannel={false} name='Edit Profile' />
            {isLoading && <Spinner size="lg" />}
            {error && <StateNotice title="Profile unavailable" message={error} actionText="Try again" onAction={fetchUser} />}
            {!isLoading && !error && <form className='w-full flex flex-col items-center justify-around py-5 px-3' onSubmit={handleSubmit} action='POST'>
                <div className='flex md:flex-row flex-col items-center'>
                    <LazyLoadImage
                        className='rounded-full w-52 h-52 object-cover cursor-pointer'
                        onClick={handleClick}
                        src={image ? image : details?.image}
                        alt='user'
                        effect='blur'
                    />
                    <div className='md:pl-5 flex flex-col justify-center md:mt-0 mt-5'>
                        <p className='md:text-start text-center'>{name ? name.slice(0, 20) + '...' : 'No image selected.'}</p>
                        <button
                            className='bg-neutral-700 p-3 w-full mt-3 rounded-md hover:bg-neutral-600 duration-200'
                            onClick={handleClick}
                            type='button'
                        >
                            Change Image
                        </button>
                    </div>
                    <input onChange={handleChange} ref={inputRef} type="file" name="image" hidden accept='image/png, image/jpeg' />
                </div>
                <div className='mt-10 flex flex-col w-full max-w-[400px]'>
                    <label className='text-xl font-semibold' htmlFor="username">Username:</label>
                    <input
                        minLength={5}
                        maxLength={20}
                        placeholder='Username'
                        className='bg-neutral-700 outline-none rounded-md p-2'
                        type="text"
                        name='username'
                        defaultValue={details?.username}
                    />
                    <label className='text-xl font-semibold mt-5' htmlFor="about">About:</label>
                    <textarea
                        spellCheck={false}
                        maxLength={250}
                        placeholder='Write about yourself...'
                        className='bg-neutral-700 outline-none rounded-md p-2 mb-5 resize-none'
                        name="about"
                        cols={30}
                        rows={10}
                        defaultValue={details?.about}
                    ></textarea>
                    <BasicButton type='submit' disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</BasicButton>
                </div>
            </form>}
            <Toaster />
        </section>
    )
}

export default ProfileEdit
