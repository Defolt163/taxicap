
/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
    cacheOnFrontEndNav: false,
    aggressiveFrontEndNavCaching: false,
    reloadOnOnline: true,
    swcMinify: true,
    disable: false,
    workboxOptions:{
        disableDevLogs: false
    }
  });


const nextConfig = {
  //output: 'export',
};


module.exports = withPWA(nextConfig);