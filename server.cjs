/* Dependency-free static server for Jotboard. Node.js 18+ required. */
'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json; charset=utf-8','.md':'text/markdown; charset=utf-8'};
const port = Number(process.env.PORT || 4173);
http.createServer((req,res)=>{
  let pathname;
  try { pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname); }
  catch { res.writeHead(400);res.end('Invalid URL');return; }
  const file = path.resolve(root,'.'+pathname,pathname.endsWith('/')?'index.html':'');
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
  fs.stat(file,(err,stats)=>{
    if(err||!stats.isFile()){res.writeHead(404);res.end('Not found');return;}
    res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
    res.setHeader('Cache-Control','no-cache');
    fs.createReadStream(file).pipe(res);
  });
}).listen(port,'127.0.0.1',()=>{
  console.log('\nJotboard is running at http://127.0.0.1:'+port+'\n');
  console.log('Open the address above in your browser. Press Ctrl+C to stop.');
});
