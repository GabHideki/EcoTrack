import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });

await cp('index.html', 'dist/index.html');
await cp('css', 'dist/css', { recursive: true });
await cp('js', 'dist/js', { recursive: true });

console.log('Build concluído: arquivos preparados em dist/.');