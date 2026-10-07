export async function GET(request, { params }) {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const { path } = await params;
  const tilePath = path.join('/');
  const apiServerUrl = (process.env.API_SERVER_URL || 'http://localhost:8080').replace(/\/+$/, '');
  const tileUrl = `${apiServerUrl}/tile/${tilePath}`;
  
  try {
    const response = await fetch(tileUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      return new Response('Tile not found', { status: response.status });
    }
    
    const blob = await response.blob();
    return new Response(blob, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Tile proxy request failed:', error);
    return new Response('Tile service unavailable', { status: 502 });
  }
}