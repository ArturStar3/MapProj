const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const ROOT = process.cwd();

const server = http.createServer((req, res) => {
  let urlPath = req.url === '/' ? '/index.html' : req.url;
  let filePath = path.join(ROOT, urlPath);
  const ext = path.extname(filePath).toLowerCase();

  console.log('Запрос:', urlPath);

  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error('Ошибка чтения:', filePath);
      res.writeHead(404);
      res.end('Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  require('child_process').exec(`start http://localhost:${PORT}`);
});
