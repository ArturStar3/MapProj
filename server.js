#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const PORT = 8000;

// Папка с файлами — используем текущую рабочую директорию
const ROOT = process.cwd();

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url === '/' ? '/index.html' : req.url);
  let filePath = path.join(ROOT, urlPath);
  const ext = path.extname(filePath).toLowerCase();

  console.log('Запрос:', urlPath);
  console.log('Файл:', filePath);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('Файл не найден:', filePath);
      res.writeHead(404);
      res.end('Not Found');
    } else {
      fs.readFile(filePath, (err, content) => {
        if (err) {
          console.error('Ошибка чтения:', filePath);
          res.writeHead(500);
          res.end('Internal Server Error');
        } else {
          res.writeHead(200, {
            'Content-Type': mimeTypes[ext] || 'application/octet-stream',
            'Cache-Control': 'no-cache',
          });
          res.end(content);
        }
      });
    }
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Сервер запущен на ${url}`);
  // Windows: открыть в браузере
  child_process.exec(`start ${url}`);
});
