// Экспорт именованного обработчика для метода POST
export async function GET() {
    try {
  
      // Здесь вы можете выполнять обработку данных или отправлять запросы к внешним API
      const result = await someExternalAPI(); // Например, вызов внешнего API
  
      // Возвращаем только результат на клиент
      return new Response(JSON.stringify({ result }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, message: 'Ошибка на сервере' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // Функция для вызова внешнего API
  async function someExternalAPI() {
    // Выполнение API-запроса к стороннему сервису
    const response = await fetch('https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=3f92ee1c9c6946c59edce5b1227a9078', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  
    const result = await response.json();
    return result;
  }
  