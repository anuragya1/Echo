import type { FC, ReactNode } from 'react';

type Props = {
  title: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  children?: ReactNode;
};

const StateNotice: FC<Props> = ({ title, message, actionText, onAction, children }) => {
  return (
    <div className="w-full max-w-[640px] mx-auto my-6 rounded-md border border-neutral-700 bg-neutral-900 p-4 text-center">
      <p className="text-lg font-semibold">{title}</p>
      {message && <p className="mt-2 text-sm text-neutral-300">{message}</p>}
      {children}
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-md bg-cyan-600 px-4 py-2 font-semibold hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default StateNotice;
