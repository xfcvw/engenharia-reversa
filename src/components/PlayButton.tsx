import { Pause, Play } from 'lucide-react'

interface PlayButtonProps {
  label: string
  active: boolean
  onClick: () => void
  compact?: boolean
}

export function PlayButton({ label, active, onClick, compact = false }: PlayButtonProps) {
  return (
    <button className={`play-button ${compact ? 'play-button--compact' : ''}`} type="button" onClick={onClick} aria-label={`${active ? 'Pausar' : 'Reproduzir'} ${label}`}>
      {active ? <Pause size={compact ? 15 : 21} fill="currentColor" /> : <Play size={compact ? 15 : 21} fill="currentColor" />}
    </button>
  )
}
