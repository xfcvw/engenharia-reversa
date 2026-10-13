import { MoreHorizontal } from 'lucide-react'
import type { MediaItem } from '../types'
import { Cover } from './Cover'
import { PlayButton } from './PlayButton'

interface ResultCardProps {
  item: MediaItem
  playingId: string | null
  onPlay: (item: MediaItem) => void
  onMore: (item: MediaItem) => void
}

const typeLabels: Record<MediaItem['type'], string> = {
  track: 'Música', artist: 'Artista', album: 'Álbum', playlist: 'Playlist', podcast: 'Podcast',
}

export function ResultCard({ item, playingId, onPlay, onMore }: ResultCardProps) {
  return (
    <article className="result-card">
      <div className="result-card__visual">
        <Cover item={item} />
        <PlayButton label={item.title} active={playingId === item.id} onClick={() => onPlay(item)} />
      </div>
      <div className="result-card__copy">
        <h3>{item.title}</h3>
        <p>{typeLabels[item.type]} <span aria-hidden="true">·</span> {item.subtitle}</p>
      </div>
      <button className="icon-button result-card__more" type="button" onClick={() => onMore(item)} aria-label={`Mais opções para ${item.title}`}><MoreHorizontal size={20} /></button>
    </article>
  )
}
