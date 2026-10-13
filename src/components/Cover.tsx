import type { CSSProperties } from 'react'
import type { MediaItem } from '../types'

interface CoverProps {
  item: MediaItem
  size?: 'small' | 'medium' | 'large'
}

export function Cover({ item, size = 'medium' }: CoverProps) {
  const initials = item.title
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')

  const style = {
    '--cover-start': item.accent,
    '--cover-end': item.accentEnd,
  } as CSSProperties

  return (
    <div className={`cover cover--${size} ${item.type === 'artist' ? 'cover--round' : ''}`} style={style} aria-hidden="true">
      {item.artworkUrl ? <img src={item.artworkUrl} alt="" loading="lazy" /> : <><span>{initials}</span><i /></>}
    </div>
  )
}
