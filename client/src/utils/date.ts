const toDate = (value?: Date | string | number | null) => {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const isToday = (value?: Date | string | number | null) => {
  const date = toDate(value);
  if (!date) return false;

  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const formatChatTime = (value?: Date | string | number | null) => {
  const date = toDate(value);
  if (!date) return '';

  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatChatDate = (value?: Date | string | number | null, includeTime = false) => {
  const date = toDate(value);
  if (!date) return '';

  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'short',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
  }).format(date);
};

export const isBefore = (left?: Date | string | number | null, right?: Date | string | number | null) => {
  const leftDate = toDate(left);
  const rightDate = toDate(right);

  if (!leftDate || !rightDate) return false;
  return leftDate.getTime() < rightDate.getTime();
};
