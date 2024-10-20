import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from 'next/server';

// Функция для проверки, является ли устройство мобильным
const isMobileDevice = (userAgent: string | null) => {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent || '');
};

// Аутентификационный middleware
export default authMiddleware({
  publicRoutes: ['/anyone-can-visit-this-route'],
  ignoredRoutes: ['/no-auth-in-this-route'],
});

// Дополнительная проверка для десктопных устройств
export function middleware(request) {
  const userAgent = request.headers.get('user-agent');

  // Логируем User-Agent для отладки
  console.log('Middleware is running');
  console.log('User-Agent:', userAgent);

  // Проверяем, является ли устройство мобильным
  const isMobile = isMobileDevice(userAgent);
  
  // Если устройство не мобильное и пользователь пытается получить доступ к маршруту /mobile/
  if (!isMobile && request.nextUrl.pathname.startsWith('/mobile')) {
    // Перенаправляем десктопных пользователей на
    return NextResponse.redirect(new URL('/platform-error', request.url));
  }

  // Если устройство мобильное или пользователь не пытается попасть на /mobile/, продолжаем выполнение
  return NextResponse.next();
}

// Конфигурация middleware
export const config = {
  // Применяем middleware ко всем маршрутам, кроме статических файлов и служебных директорий
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
