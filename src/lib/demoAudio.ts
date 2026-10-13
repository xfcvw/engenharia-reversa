import type { MediaItem } from '../types'

function writeText(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) view.setUint8(offset + index, value.charCodeAt(index))
}

function hash(value: string) {
  return [...value].reduce((total, character) => ((total * 31) + character.charCodeAt(0)) >>> 0, 2166136261)
}

export function createDemoAudioUrl(item: MediaItem) {
  const sampleRate = 16_000
  const duration = 12
  const samples = sampleRate * duration
  const buffer = new ArrayBuffer(44 + samples * 2)
  const view = new DataView(buffer)
  const seed = hash(item.id)
  const roots = [110, 123.47, 130.81, 146.83, 164.81]
  const root = roots[seed % roots.length]
  const progression = [1, 1.25, 1.5, 1.125]

  writeText(view, 0, 'RIFF')
  view.setUint32(4, 36 + samples * 2, true)
  writeText(view, 8, 'WAVE')
  writeText(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeText(view, 36, 'data')
  view.setUint32(40, samples * 2, true)

  for (let index = 0; index < samples; index += 1) {
    const time = index / sampleRate
    const beat = Math.floor(time * 2) % 8
    const chord = progression[Math.floor(time / 3) % progression.length]
    const envelope = Math.min(1, (time * 2) % 1 * 6) * Math.min(1, (1 - ((time * 2) % 1)) * 2.5)
    const bass = Math.sin(2 * Math.PI * root * chord * time) * 0.24
    const leadFrequency = root * chord * [2, 2.5, 3, 2.25][beat % 4]
    const lead = Math.sin(2 * Math.PI * leadFrequency * time) * 0.13 * envelope
    const pad = Math.sin(2 * Math.PI * root * chord * 1.5 * time) * 0.08
    const kickPhase = (time * 2) % 1
    const kick = Math.sin(2 * Math.PI * (55 - kickPhase * 25) * time) * Math.exp(-kickPhase * 12) * 0.32
    const sample = Math.max(-1, Math.min(1, bass + lead + pad + kick))
    view.setInt16(44 + index * 2, sample * 0x7fff, true)
  }

  return URL.createObjectURL(new Blob([view], { type: 'audio/wav' }))
}
