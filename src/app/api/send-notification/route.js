import webpush from 'web-push';

// Настройка VAPID
const vapidKeys = {
  publicKey: 'BKKhu0jqOaKKskBGJi0ai4_NWd3oohMzxkAzXJon4y-8llr1aBX3Z8cqCrawSmtIpFMAR9BPiRDeJavcogx7sek',
  privateKey: 'TWkKyVTOkBiH_pzKmITsS0QTLwEnko500j7zTtXeVkw',
};

webpush.setVapidDetails(
  'mailto:m.romanov.biz@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function POST(req) {
  const { subscription } = await req.json();  // Получаем подписку от клиента

  const payload = JSON.stringify({
    title: 'Новое уведомление!',
    body: 'Это уведомление для всех пользователей.',
  });

  try {
    await webpush.sendNotification(subscription, payload);  // Отправляем уведомление
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Ошибка при отправке уведомлений:', error);
    return new Response(JSON.stringify({ error: 'Не удалось отправить уведомления' }), { status: 500 });
  }
}
