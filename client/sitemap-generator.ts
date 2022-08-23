require('babel-register')({
    presets: ['es2015', 'react']
});

const router = require('./src/sitemap-routes.tsx').default;
const Sitemap = require('react-router-sitemap').default;

const generateSitemap = () => {
    return new Sitemap(router).build('https://todo.imadelmahrad.com').save('./dist/sitemap.xml');
};

generateSitemap();
