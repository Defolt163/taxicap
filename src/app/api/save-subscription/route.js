// /app/api/save-subscription/route.js

export async function POST(req) {
    try {
      // Получаем данные из тела запроса
      const subscription = await req.json();
  
      // Сохраните данные подписки в базе данных или используйте их по своему усмотрению
      // Например, сохранение в базу данных:
      // await db.subscriptions.create({ data: subscription });
  
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      console.error('Error saving subscription:', error);
      return new Response(
        JSON.stringify({ success: false, message: 'Failed to save subscription' }),
        { status: 500 }
      );
    }
  }
  