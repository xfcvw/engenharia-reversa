import { catalog } from '../data/catalog'
import { normalizeSearchText, rankItem, searchCatalog } from './search'

describe('normalizeSearchText', () => {
  it('remove acentos, normaliza caixa e espaços', () => {
    expect(normalizeSearchText('  ORAÇÃO   ao Têmpo ')).toBe('oracao ao tempo')
  })
})

describe('rankItem', () => {
  it('prioriza correspondência exata no título', () => {
    const track = catalog.find((item) => item.title === 'Dengo')!
    const exact = rankItem(track, 'dengo')
    const byKeyword = rankItem(track, 'forró')
    expect(exact!.score).toBeGreaterThan(byKeyword!.score)
    expect(exact!.matchedOn).toContain('title')
  })
})

describe('searchCatalog', () => {
  it('encontra texto sem depender de acentos', () => {
    expect(searchCatalog(catalog, 'oracao')[0].item.title).toBe('Oração ao Tempo')
  })

  it('agrupa implicitamente diferentes tipos numa única consulta', () => {
    const types = new Set(searchCatalog(catalog, 'marina').map((result) => result.item.type))
    expect(types).toEqual(new Set(['artist', 'track', 'album']))
  })

  it('aplica filtro de tipo sem perder a ordenação', () => {
    const results = searchCatalog(catalog, 'brasil', 'playlist')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((result) => result.item.type === 'playlist')).toBe(true)
    expect(results[0].item.title).toBe('Brasil em Alta')
  })

  it('retorna uma lista vazia para consulta desconhecida', () => {
    expect(searchCatalog(catalog, 'zzzz-impossivel')).toEqual([])
  })

  it('inclui uma seleção ampla de rap de anime e funk', () => {
    expect(searchCatalog(catalog, 'rap de anime', 'track').length).toBeGreaterThanOrEqual(6)
    expect(searchCatalog(catalog, 'funk brasileiro', 'track').length).toBeGreaterThanOrEqual(6)
  })
})
