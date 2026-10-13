export type MediaType = 'track' | 'artist' | 'album' | 'playlist' | 'podcast'

export interface MediaItem {
  id: string
  type: MediaType
  title: string
  subtitle: string
  meta?: string
  duration?: string
  accent: string
  accentEnd: string
  keywords: string[]
  popular?: boolean
}

export type SearchFilter = 'all' | MediaType

export interface RankedResult {
  item: MediaItem
  score: number
  matchedOn: Array<'title' | 'subtitle' | 'keyword'>
}
