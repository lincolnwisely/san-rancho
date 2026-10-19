import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        // Merchant Center wants Google's crawlers listed explicitly.
        rules: [
            { userAgent: 'Googlebot', allow: '/' },
            { userAgent: 'Googlebot-Image', allow: '/' },
            { userAgent: '*', allow: '/' },
        ],
        sitemap: 'https://www.sanrancho.com/sitemap.xml',
    }
}
