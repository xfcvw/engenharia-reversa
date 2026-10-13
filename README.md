# Pulse Search

Uma experiência de busca musical independente, inspirada nos padrões observáveis e na API pública do Spotify, sem copiar marca, ativos ou código proprietário.

## Recursos

- Busca instantânea em músicas, artistas, álbuns, playlists e podcasts.
- Ranking que privilegia título exato, prefixos, artista e palavras-chave.
- Normalização de acentos e caixa para consultas em português.
- Resultado principal, lista compacta de músicas e cartões por tipo.
- Filtros, estados vazio/inicial, reprodução simulada e músicas curtidas.
- Atalho `/` para focar a busca e `Escape` para limpar.
- Layout responsivo e suporte a movimento reduzido.

Os dados são demonstrativos e locais. Nenhuma credencial ou API do Spotify é necessária.

## Desenvolvimento

```bash
npm install
npm start
```

Validação:

```bash
npm test
npm run build
npm run preview
```

Veja [EVIDENCE.md](./EVIDENCE.md) para as evidências, inferências e limitações da investigação.
