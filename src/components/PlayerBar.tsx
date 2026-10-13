import { ExternalLink, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react'
import type { MediaItem } from '../types'
import { Cover } from './Cover'

interface PlayerBarProps {
  item: MediaItem
  playing: boolean
  currentTime: number
  duration: number
  volume: number
  sourceLabel: string
  onToggle: () => void
  onPrevious: () => void
  onNext: () => void
  onSeek: (time: number) => void
  onVolume: (volume: number) => void
  onClose: () => void
}

function formatTime(value: number) {
  if (!Number.isFinite(value)) return '0:00'
  return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`
}

export function PlayerBar({ item, playing, currentTime, duration, volume, sourceLabel, onToggle, onPrevious, onNext, onSeek, onVolume, onClose }: PlayerBarProps) {
  return (
    <section className="player-bar" aria-label="Player atual">
      <div className="player-bar__track">
        <Cover item={item} size="small" />
        <div><strong>{item.title}</strong><span>{item.subtitle} · {sourceLabel}</span></div>
      </div>
      <div className="player-bar__center">
        <div className="player-bar__controls">
          <button type="button" onClick={onPrevious} aria-label="Faixa anterior"><SkipBack size={18} fill="currentColor" /></button>
          <button className="player-bar__play" type="button" onClick={onToggle} aria-label={playing ? 'Pausar' : 'Reproduzir'}>
            {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
          <button type="button" onClick={onNext} aria-label="Próxima faixa"><SkipForward size={18} fill="currentColor" /></button>
        </div>
        <div className="player-bar__timeline">
          <span>{formatTime(currentTime)}</span>
          <input aria-label="Progresso da música" type="range" min="0" max={duration || 0} step="0.1" value={Math.min(currentTime, duration || 0)} onChange={(event) => onSeek(Number(event.target.value))} />
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className="player-bar__actions">
        {item.externalUrl && <a href={item.externalUrl} target="_blank" rel="noreferrer" aria-label={`Abrir ${item.title} no catálogo`}><ExternalLink size={16} /></a>}
        <button type="button" onClick={() => onVolume(volume === 0 ? .72 : 0)} aria-label={volume === 0 ? 'Ativar som' : 'Silenciar'}>{volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
        <input aria-label="Volume" type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => onVolume(Number(event.target.value))} />
        <button type="button" onClick={onClose} aria-label="Fechar player"><X size={17} /></button>
      </div>
    </section>
  )
}
