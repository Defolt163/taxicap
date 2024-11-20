export async function GET() {
  try {
      const apiKey = process.env.MAP_API_KEY; // Берем ключ из .env

      // Запрос к Geoapify API на серверной стороне
      const response = await fetch(`https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${apiKey}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      // Возвращаем результат на клиент
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
