import type { MediaItem, MediaType, RankedResult, SearchFilter } from '../types'

export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim()
    .replace(/\s+/g, ' ')
}

function fieldScore(field: string, query: string, weight: number): number {
  if (!field || !query) return 0
  if (field === query) return 120 * weight
  if (field.startsWith(query)) return 80 * weight
  const words = field.split(/\s+/)
  if (words.some((word) => word.startsWith(query))) return 55 * weight
  if (field.includes(query)) return 35 * weight
  return 0
}

export function rankItem(item: MediaItem, rawQuery: string): RankedResult | null {
  const query = normalizeSearchText(rawQuery)
  if (!query) return null

  const title = normalizeSearchText(item.title)
  const subtitle = normalizeSearchText(item.subtitle)
  const keywords = item.keywords.map(normalizeSearchText)
  const titleScore = fieldScore(title, query, 4)
  const subtitleScore = fieldScore(subtitle, query, 2)
  const keywordScore = Math.max(0, ...keywords.map((keyword) => fieldScore(keyword, query, 1)))

  const matchedOn: RankedResult['matchedOn'] = []
  if (titleScore) matchedOn.push('title')
  if (subtitleScore) matchedOn.push('subtitle')
  if (keywordScore) matchedOn.push('keyword')
  if (!matchedOn.length) return null

  return {
    item,
    score: titleScore + subtitleScore + keywordScore + (item.popular ? 8 : 0),
    matchedOn,
  }
}

export function searchCatalog(items: MediaItem[], query: string, filter: SearchFilter = 'all'): RankedResult[] {
  return items
    .filter((item) => filter === 'all' || item.type === filter)
    .map((item) => rankItem(item, query))
    .filter((result): result is RankedResult => result !== null)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'pt-BR'))
}

export function groupResults(results: RankedResult[]): Record<MediaType, RankedResult[]> {
  return results.reduce<Record<MediaType, RankedResult[]>>(
    (groups, result) => {
      groups[result.item.type].push(result)
      return groups
    },
    { track: [], artist: [], album: [], playlist: [], podcast: [] },
  )
}
