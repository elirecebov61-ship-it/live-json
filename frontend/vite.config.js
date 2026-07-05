export default {
  server: { proxy: { '/api': 'http://localhost:3000' } },
  build: { outDir: 'dist' }
};
