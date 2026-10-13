# Evidências da investigação: busca do Spotify

Data da investigação: 13 de outubro de 2026.

## Escopo e método

O alvo escolhido foi a busca do Spotify. A investigação separa fatos confirmados por fonte oficial, hipóteses de design e itens que não puderam ser observados. O projeto resultante é uma reconstrução independente; não contém código, marca, imagens ou dados proprietários do Spotify.

## Evidência confirmada

Foi inspecionado o SDK TypeScript oficial `spotify/spotify-web-api-ts-sdk` no commit `c6f34491eaa17ab73698d5464ee10332d0c551cc`.

1. `src/endpoints/SearchEndpoints.ts:5-11` define a consulta com os parâmetros `q`, `type`, `market`, `limit`, `offset` e `include_external`, e a envia para o recurso `search`.
2. `src/endpoints/SearchEndpoints.test.ts:17-28` verifica que uma consulta é serializada como `/v1/search?q=...&type=artist` e que múltiplos tipos são aceitos.
3. `src/types.ts:268-291` modela a resposta por coleções tipadas, permitindo retornar categorias diferentes em uma mesma consulta.
4. `src/responsevalidation/DefaultResponseValidator.ts:13` trata explicitamente o limite de requisições HTTP 429.

Conclusões sustentadas por essas evidências:

- A busca pública aceita uma consulta textual e uma ou mais categorias de mídia.
- Os resultados são paginados por `limit` e `offset` e podem variar por mercado.
- A resposta preserva a separação por tipo de conteúdo.
- Uma integração real deve tratar rate limiting.

## Evidência operacional do REA

- `rea-agents` 6.4.0 foi executado com Node 24.19.0.
- O REA detectou Chromium e disponibilizou os fluxos `inspect-web-page`, `capture-browser-scenario` e `analyze-web-bundle`.
- A tentativa de acessar `https://open.spotify.com/search` recebeu `403 CONNECT` do proxy de saída antes de chegar ao site.
- A política de rede do ambiente ainda não permite uma captura dinâmica do Web Player. Portanto, nenhum detalhe interno de debounce, ranking privado, endpoints internos ou telemetria é apresentado como confirmado.

## Hipóteses de produto usadas na reconstrução

Os seguintes itens são padrões de interface adotados na implementação, não alegações sobre o código interno do Spotify:

- atualização após uma pausa curta na digitação;
- melhor resultado em destaque;
- filtros em chips e seções por tipo;
- correspondência tolerante a acentos;
- ranking local com título acima de artista e palavras-chave;
- ações de reproduzir e curtir simuladas.

## Mapeamento para o projeto

| Evidência ou requisito | Implementação |
| --- | --- |
| Consulta textual | campo de busca controlado em `src/App.tsx` |
| Múltiplos tipos | modelo `MediaType` e filtros em `src/types.ts` |
| Respostas separadas por tipo | `groupResults` em `src/lib/search.ts` |
| Limitar chamadas durante digitação | debounce de 180 ms em `src/hooks/useDebouncedValue.ts` |
| Ranking independente | pontuação determinística em `src/lib/search.ts` |
| Sem credenciais disponíveis | catálogo demonstrativo local em `src/data/catalog.ts` |

## Limitações e próxima prova

Para comprovar o comportamento exato do Spotify Web Player, ainda é necessário permitir `open.spotify.com` e os domínios de recursos carregados pela página na configuração de rede. Depois disso, uma captura passiva com REA pode observar estrutura acessível, formas dos corpos JSON e scripts retidos sem expor valores de armazenamento ou credenciais.
