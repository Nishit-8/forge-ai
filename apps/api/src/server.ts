import { createApp } from './app.js';

const PORT = Number(process.env.PORT ?? 3000);

const server = createApp();

server.listen(PORT, () => {
  console.log(`Forge API listening on http://localhost:${PORT}`);
});
