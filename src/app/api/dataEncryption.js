export function getDataEncryptionKey() {
  const key = process.env.DATA_SECRET_KEY;
  if (!key) {
    throw new Error('DATA_SECRET_KEY is not configured');
  }

  return Buffer.from(key, 'hex');
}
