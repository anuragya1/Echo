import type{ FC, ReactNode } from 'react'

type Props = {
  type: any;
  children: ReactNode;
  disabled?: boolean;
}

const BasicButton: FC<Props> = ({ type = 'button', children, disabled = false }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className='w-full rounded-md bg-neutral-700 text-white p-3 hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-60 duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500'
    >
      {children}
    </button>
  )
}

export default BasicButton;
