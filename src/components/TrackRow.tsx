import { Heart, MoreHorizontal } from 'lucide-react'
import type { MediaItem } from '../types'
import { Cover } from './Cover'
import { PlayButton } from './PlayButton'

interface TrackRowProps {
  item: MediaItem
  index: number
  playingId: string | null
  liked: boolean
  onPlay: (item: MediaItem) => void
  onLike: (item: MediaItem) => void
  onMore: (item: MediaItem) => void
}

export function TrackRow({ item, index, playingId, liked, onPlay, onLike, onMore }: TrackRowProps) {
  const active = playingId === item.id

  return (
    <div className={`track-row ${active ? 'track-row--active' : ''}`}>
      <div className="track-row__index">
        <span>{index + 1}</span>
        <PlayButton label={item.title} active={active} onClick={() => onPlay(item)} compact />
      </div>
      <Cover item={item} size="small" />
      <div className="track-row__main">
        <strong>{item.title}</strong>
        <span>{item.subtitle}</span>
      </div>
      <span className="track-row__album">{item.meta}</span>
      <button className={`icon-button like-button ${liked ? 'like-button--active' : ''}`} type="button" onClick={() => onLike(item)} aria-label={`${liked ? 'Remover' : 'Adicionar'} ${item.title} ${liked ? 'das' : 'às'} músicas curtidas`}>
        <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
      </button>
      <span className="track-row__duration">{item.duration}</span>
      <button className="icon-button" type="button" onClick={() => onMore(item)} aria-label={`Mais opções para ${item.title}`}><MoreHorizontal size={18} /></button>
    </div>
  )
}
