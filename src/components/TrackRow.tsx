import { Heart, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import type { MediaItem } from '../types'
import { Cover } from './Cover'
import { PlayButton } from './PlayButton'

interface TrackRowProps {
  item: MediaItem
  index: number
  playingId: string | null
  onPlay: (id: string) => void
}

export function TrackRow({ item, index, playingId, onPlay }: TrackRowProps) {
  const [liked, setLiked] = useState(false)
  const active = playingId === item.id

  return (
    <div className={`track-row ${active ? 'track-row--active' : ''}`}>
      <div className="track-row__index">
        <span>{index + 1}</span>
        <PlayButton label={item.title} active={active} onClick={() => onPlay(item.id)} compact />
      </div>
      <Cover item={item} size="small" />
      <div className="track-row__main">
        <strong>{item.title}</strong>
        <span>{item.subtitle}</span>
      </div>
      <span className="track-row__album">{item.meta}</span>
      <button className={`icon-button like-button ${liked ? 'like-button--active' : ''}`} type="button" onClick={() => setLiked((value) => !value)} aria-label={`${liked ? 'Remover' : 'Adicionar'} ${item.title} ${liked ? 'das' : 'às'} músicas curtidas`}>
        <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
      </button>
      <span className="track-row__duration">{item.duration}</span>
      <button className="icon-button" type="button" aria-label={`Mais opções para ${item.title}`}><MoreHorizontal size={18} /></button>
    </div>
  )
}
