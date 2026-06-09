import { useForm } from 'react-hook-form';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdMail } from 'react-icons/md';
import { HiUser } from 'react-icons/hi';
import { AiFillLock } from 'react-icons/ai';
import toast, { Toaster } from 'react-hot-toast';

import PasswordInput from '../../../components/inputs/PasswordInput';
import TextInput from '../../../components/inputs/TextInput';
import BasicButton from '../../../components/buttons/BasicButton';
import { createAccount } from '../../../services/authService';
import Terms from './Terms';
import Cookies from 'js-cookie';

type Props = {
  setIsFormOpen: Dispatch<SetStateAction<boolean>>;
}

const RegisterForm: FC<Props> = ({ setIsFormOpen }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const { statusCode, message } = await createAccount(data);
    setIsSubmitting(false);

    if (statusCode === '201') {
      setIsFormOpen(false);
      Cookies.remove('last_user');
      setTimeout(() => {
        return navigate('/login');
      }, 2000);
      return;
    }

    reset();
    toast.error(message, {
      duration: 3000,
      position: 'bottom-center',
      style: {
        backgroundColor: '#353535',
        color: '#fff'
      }
    });
  };

  return (
    <form
      method='POST'
      name='form'
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextInput
        label='Email'
        placeholder='Type your email.'
        Icon={MdMail}
        informations={['email is required.', 'email must be valid.']}
        error={errors.email && errors.email.message}
        refs={{
          ...register('email', {
            required: 'email is required.',
            pattern: {
              value:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: 'please enter a valid email.'
            }
          })
        }}
      />
      <TextInput
        label='Username'
        placeholder='Type your username.'
        Icon={HiUser}
        error={errors.username && errors.username.message}
        informations={['username must be min 5.', 'username must be max 20.']}
        refs={{
          ...register('username', {
            required: 'username is required.',
            minLength: {
              value: 5,
              message: 'username must be min 5 characters.'
            },
            maxLength: {
              value: 20,
              message: 'username must be max 20 characters.'
            }
          })
        }}
      />
      <PasswordInput
        label='Password'
        placeholder='Type your password.'
        error={errors.password && errors.password.message}
        Icon={AiFillLock}
        refs={{
          ...register('password', {
            required: 'password is required',
            minLength: {
              value: 8,
              message: 'password must be min 8 characters.'
            },
            maxLength: {
              value: 20,
              message: 'password must be max 20 characters.'
            }
          })
        }}
      />
      <div className='w-[90%] md:w-[80%] mx-auto'>
        <Terms />
        <BasicButton
          type='submit'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Account'}
        </BasicButton>
      </div>
      <Toaster />
    </form>
  );
};

export default RegisterForm;
