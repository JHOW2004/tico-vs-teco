import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [playlist, setPlaylist] = useState<string[]>([])
  const playlistRef = useRef<string[]>([])

  const [currentIndex, setCurrentIndex] = useState(0)
  const indexRef = useRef(0)

  const [isPlaying, setIsPlaying] = useState(false)
  const isPlayingRef = useRef(false)

  const [hasStarted, setHasStarted] = useState(false) 
  
  useEffect(() => {
    
    const modules = import.meta.glob('/src/sounds/*.{mp3,ogg,wav}', {
      eager: true,
      as: 'url',
    }) as Record<string, string>

    let files = Object.values(modules)
    if (!files || files.length === 0) {
     
      files = [
        '/sounds/song1.mp3',
        '/sounds/song2.mp3',
        '/sounds/song3.mp3',
        '/sounds/song4.mp3',
        '/sounds/song5.mp3',
        '/sounds/song6.mp3',
      ]
    }

    const list = shuffleArray(files)
    playlistRef.current = list
    setPlaylist(list)
    setCurrentIndex(0)
    indexRef.current = 0
  }, [])

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const el = new Audio()
      el.preload = 'auto'
      el.volume = 0.3
      audioRef.current = el
    }
    return audioRef.current!
  }, [])

  const currentSrc = useMemo(
    () => playlist[currentIndex] ?? '',
    [playlist, currentIndex],
  )

  useEffect(() => {
    if (!currentSrc) return
    const audio = ensureAudio()
    audio.src = currentSrc

    const onEnded = () => {
      const next = (indexRef.current + 1) % playlistRef.current.length
      if (next === 0) {
        const reshuffled = shuffleArray(playlistRef.current)
        playlistRef.current = reshuffled
        setPlaylist(reshuffled)
      }
      indexRef.current = next
      setCurrentIndex(next)
      if (isPlayingRef.current) {
        audio.play().catch(() => {})
      }
    }

    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('ended', onEnded)
    }
  }, [currentSrc, ensureAudio])

  useEffect(() => {
    if (hasStarted) return
    const startOnce = () => {
      start().catch(() => {})
      window.removeEventListener('pointerdown', startOnce)
      window.removeEventListener('keydown', startOnce)
      window.removeEventListener('touchend', startOnce)
    }
    window.addEventListener('pointerdown', startOnce, { once: true })
    window.addEventListener('keydown', startOnce, { once: true })
    window.addEventListener('touchend', startOnce, { once: true })
    return () => {
      window.removeEventListener('pointerdown', startOnce)
      window.removeEventListener('keydown', startOnce)
      window.removeEventListener('touchend', startOnce)
    }
  }, [hasStarted])

  const start = useCallback(async () => {
    if (!playlistRef.current.length) return
    setHasStarted(true)
    const audio = ensureAudio()
    audio.src = playlistRef.current[indexRef.current] ?? ''
    try {
      await audio.play()
      isPlayingRef.current = true
      setIsPlaying(true)
    } catch (err) {
      console.error('Erro ao iniciar áudio:', err)
      isPlayingRef.current = false
      setIsPlaying(false)
      throw err
    }
  }, [ensureAudio])

  const togglePlay = useCallback(async () => {
    const audio = ensureAudio()
    if (!hasStarted) {
      await start()
      return
    }
    if (isPlayingRef.current) {
      audio.pause()
      isPlayingRef.current = false
      setIsPlaying(false)
    } else {
      try {
        await audio.play()
        isPlayingRef.current = true
        setIsPlaying(true)
      } catch (err) {
        console.error('Erro ao retomar áudio:', err)
      }
    }
  }, [ensureAudio, hasStarted, start])

  const setVolume = useCallback((v: number) => {
    const audio = ensureAudio()
    audio.volume = Math.max(0, Math.min(1, v))
  }, [ensureAudio])

  return {
    isPlaying,
    start,
    togglePlay,
    setVolume,
    currentIndex,
    playlist,
  }
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
