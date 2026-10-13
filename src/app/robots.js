const BASE_URL = 'https://poehali163.ru';

export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/mobile/general',
                    '/mobile/sign-in',
                    '/mobile/sign-up',
                    '/mobile/set-account',
                    '/mobile/general/my-account',
                    '/mobile/general/my-account/history',
                    '/mobile/general/my-account/add-car',
                    '/mobile/general/my-account/account-edit',
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}