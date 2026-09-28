import webpush from 'web-push';
import pool from '../../accountDB';

const internalSecret = process.env.PUSH_INTERNAL_SECRET;

webpush.setVapidDetails(
  'mailto:m.romanov.biz@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

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

export async function POST(request) {
  if (!internalSecret || request.headers.get('x-push-secret') !== internalSecret) {
    return Response.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { userIds = [], roles = [], title, body, data = {} } = await request.json();
    await ensureTable();

    const ids = new Set(userIds.map(Number).filter(Number.isInteger));
    if (roles.includes(0) || roles.includes('0')) {
      const [passengers] = await pool.query('SELECT UserId FROM accounts WHERE DriverMode = 0');
      passengers.forEach((user) => ids.add(Number(user.UserId)));
    }
    if (roles.includes(1) || roles.includes('1')) {
      const [drivers] = await pool.query('SELECT UserId FROM accounts WHERE DriverMode = 1');
      drivers.forEach((user) => ids.add(Number(user.UserId)));
    }

    if (ids.size === 0) return Response.json({ sent: 0 });

    const placeholders = Array.from(ids, () => '?').join(',');
    const [subscriptions] = await pool.query(
      `SELECT id, user_id, endpoint, p256dh, auth FROM push_subscriptions WHERE user_id IN (${placeholders})`,
      Array.from(ids)
    );

    const payload = JSON.stringify({
      title: title || 'Taxicap',
      body: body || '',
      data,
      url: '/mobile/general',
    });

    let sent = 0;
    await Promise.all(subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification({
          endpoint: subscription.endpoint,
          keys: { p256dh: subscription.p256dh, auth: subscription.auth },
        }, payload);
        sent += 1;
      } catch (error) {
        if (error.statusCode === 404 || error.statusCode === 410) {
          await pool.query('DELETE FROM push_subscriptions WHERE id = ?', [subscription.id]);
        } else {
          console.error('Push delivery error:', error.message);
        }
      }
    }));

    return Response.json({ sent });
  } catch (error) {
    console.error('Push notify error:', error);
    return Response.json({ message: 'Push notification failed' }, { status: 500 });
  }
}
