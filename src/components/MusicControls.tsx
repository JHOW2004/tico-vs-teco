import { Volume2, VolumeX, Play, Pause } from 'lucide-react'
import { useBackgroundMusic } from '../hooks/useBackgroundMusic'
import { useState } from 'react'

export function MusicControls() {
  const { isPlaying, start, setVolume } = useBackgroundMusic()
  const [muted, setMuted] = useState(false)


  const handleMute = () => {
    setMuted((m) => {
      const next = !m
      setVolume(next ? 0 : 0.3)
      return next
    })
  }

  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, display: 'flex', gap: 8 }}>

      <button
        onClick={start}
        style={{ padding: 8, borderRadius: 8, background: '#222', color: '#fff' }}
        title={isPlaying ? 'Pausar' : 'Tocar'}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      <button
        onClick={handleMute}
        style={{ padding: 8, borderRadius: 8, background: '#222', color: '#fff' }}
        title={muted ? 'Desmutar' : 'Mutar'}
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  )
}
