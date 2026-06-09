const buckets = new Map();

export const rateLimit = ({ windowMs = 60000, max = 60, keyPrefix = 'default' } = {}) => {
  return (req, res, next) => {
    const key = `${keyPrefix}:${req.ip}:${req.user?.id || 'anonymous'}`;
    const now = Date.now();
    const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (bucket.resetAt <= now) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    buckets.set(key, bucket);

    if (bucket.count > max) {
      return res.status(429).json({ message: 'Too many requests. Please slow down.' });
    }

    return next();
  };
};
