import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import pool from '../../accountDB';

const SECRET_KEY = process.env.JWT_SECRET_KEY;

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      endpoint TEXT NOT NULL,
      endpoint_hash CHAR(64) NOT NULL UNIQUE,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_push_subscriptions_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

function getUserId(request) {
  const token = request.headers.get('authorization')?.split(' ')[1];
  if (!token) return null;
  const decoded = jwt.verify(token, SECRET_KEY);
  return Number(decoded.id);
}

export async function POST(request) {
  try {
    const userId = getUserId(request);
    if (!userId) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const subscription = await request.json();
    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return Response.json({ message: 'Invalid push subscription' }, { status: 400 });
    }

    await ensureTable();
    const endpointHash = crypto.createHash('sha256').update(subscription.endpoint).digest('hex');
    await pool.query(
      `INSERT INTO push_subscriptions (user_id, endpoint, endpoint_hash, p256dh, auth)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), p256dh = VALUES(p256dh), auth = VALUES(auth)`,
      [userId, subscription.endpoint, endpointHash, subscription.keys.p256dh, subscription.keys.auth]
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error('Push subscription error:', error);
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(request) {
  try {
    const userId = getUserId(request);
    if (!userId) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    const subscription = await request.json();
    if (subscription?.endpoint) {
      await pool.query('DELETE FROM push_subscriptions WHERE user_id = ? AND endpoint = ?', [userId, subscription.endpoint]);
    } else {
      await pool.query('DELETE FROM push_subscriptions WHERE user_id = ?', [userId]);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Push unsubscribe error:', error);
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
