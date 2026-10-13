import type { MediaItem } from '../types'

interface ITunesTrack {
  trackId: number
  trackName: string
  artistName: string
  collectionName?: string
  primaryGenreName?: string
  trackTimeMillis?: number
  artworkUrl100?: string
  previewUrl?: string
  trackViewUrl?: string
}

interface ITunesResponse {
  results?: ITunesTrack[]
}

const palette = [
  ['#6342a8', '#c595ed'],
  ['#176f75', '#77d6bb'],
  ['#a8444b', '#f2a378'],
  ['#244e75', '#79b8d1'],
  ['#80602d', '#e0bc69'],
]

function colorFor(id: number) {
  return palette[Math.abs(id) % palette.length]
}

function formatDuration(milliseconds?: number) {
  if (!milliseconds) return '0:30'
  const totalSeconds = Math.round(milliseconds / 1000)
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`
}

export async function searchPublicMusic(query: string, signal?: AbortSignal, limit = 40): Promise<MediaItem[]> {
  const params = new URLSearchParams({
    term: query,
    media: 'music',
    entity: 'song',
    country: 'BR',
    limit: String(limit),
  })
  const response = await fetch(`https://itunes.apple.com/search?${params}`, { signal })
  if (!response.ok) throw new Error(`music catalog returned ${response.status}`)

  const payload = await response.json() as ITunesResponse
  return (payload.results ?? [])
    .filter((track) => track.previewUrl)
    .map((track) => {
      const [accent, accentEnd] = colorFor(track.trackId)
      return {
        id: `public-${track.trackId}`,
        type: 'track' as const,
        title: track.trackName,
        subtitle: track.artistName,
        meta: track.collectionName || 'Single',
        duration: formatDuration(track.trackTimeMillis),
        accent,
        accentEnd,
        keywords: [track.artistName, track.collectionName, track.primaryGenreName].filter((value): value is string => Boolean(value)),
        artworkUrl: track.artworkUrl100?.replace('100x100bb', '600x600bb'),
        previewUrl: track.previewUrl,
        externalUrl: track.trackViewUrl,
      }
    })
}
