const BASE_URL = 'https://poehali163.ru';

export default function sitemap() {
    return [
        {
            url: BASE_URL,
            lastModified: '2026-10-01',
            changeFrequency: 'monthly',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/policy`,
            lastModified: '2026-10-01',
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/mobile`,
            lastModified: '2026-10-01',
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];
}