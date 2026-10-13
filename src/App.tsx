import { Clock3, Compass, Home, Library, ListMusic, Menu, Mic2, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Cover } from './components/Cover'
import { PlayerBar } from './components/PlayerBar'
import { PlayButton } from './components/PlayButton'
import { ResultCard } from './components/ResultCard'
import { TrackRow } from './components/TrackRow'
import { browseCategories, catalog } from './data/catalog'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { createDemoAudioUrl } from './lib/demoAudio'
import { searchPublicMusic } from './lib/musicApi'
import { groupResults, searchCatalog } from './lib/search'
import type { MediaItem, SearchFilter } from './types'

const filters: Array<{ id: SearchFilter; label: string }> = [
  { id: 'all', label: 'Tudo' }, { id: 'track', label: 'Músicas' },
  { id: 'artist', label: 'Artistas' }, { id: 'album', label: 'Álbuns' },
  { id: 'playlist', label: 'Playlists' }, { id: 'podcast', label: 'Podcasts' },
]

type View = 'home' | 'search' | 'library' | 'recent'
type RemoteState = 'idle' | 'loading' | 'ready' | 'fallback'

function getSavedItems() {
  try { return JSON.parse(localStorage.getItem('pulse-liked-items') || '[]') as MediaItem[] }
  catch { return [] }
}

function App() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<SearchFilter>('all')
  const [activeView, setActiveView] = useState<View>('home')
  const [remoteTracks, setRemoteTracks] = useState<MediaItem[]>([])
  const [remoteState, setRemoteState] = useState<RemoteState>('idle')
  const [currentItem, setCurrentItem] = useState<MediaItem | null>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(.72)
  const [sourceLabel, setSourceLabel] = useState('')
  const [likedItems, setLikedItems] = useState<MediaItem[]>(getSavedItems)
  const [recentItems, setRecentItems] = useState<MediaItem[]>([])
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const generatedUrlRef = useRef<string | null>(null)
  const debouncedQuery = useDebouncedValue(query)

  const searchableCatalog = useMemo(() => [...remoteTracks, ...catalog], [remoteTracks])
  const results = useMemo(() => searchCatalog(searchableCatalog, debouncedQuery, filter), [searchableCatalog, debouncedQuery, filter])
  const grouped = useMemo(() => groupResults(results), [results])
  const likedIds = useMemo(() => new Set(likedItems.map((item) => item.id)), [likedItems])
  const playingId = playing ? currentItem?.id ?? null : null
  const isSearching = query.trim().length > 0
  const topResult = results[0]?.item
  const playableQueue = useMemo(() => {
    const items = results.map((result) => result.item)
    return items.length ? items : catalog.filter((item) => item.type === 'track')
  }, [results])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        event.preventDefault(); setActiveView('search'); inputRef.current?.focus()
      }
      if (event.key === 'Escape' && document.activeElement === inputRef.current) {
        setQuery(''); inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const term = debouncedQuery.trim()
    if (term.length < 2) { setRemoteTracks([]); setRemoteState('idle'); return }
    const controller = new AbortController()
    setRemoteState('loading')
    searchPublicMusic(term, controller.signal)
      .then((items) => { setRemoteTracks(items); setRemoteState(items.length ? 'ready' : 'fallback') })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setRemoteTracks([]); setRemoteState('fallback')
      })
    return () => controller.abort()
  }, [debouncedQuery])

  useEffect(() => { localStorage.setItem('pulse-liked-items', JSON.stringify(likedItems)) }, [likedItems])
  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(timeout)
  }, [toast])
  useEffect(() => () => { if (generatedUrlRef.current) URL.revokeObjectURL(generatedUrlRef.current) }, [])

  const selectView = (view: View) => {
    setActiveView(view); setMobileNavOpen(false)
    if (view === 'home') { setQuery(''); setFilter('all') }
    if (view === 'search') window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  const playItem = (item: MediaItem) => {
    const audio = audioRef.current
    if (!audio) return
    if (currentItem?.id === item.id) {
      if (playing) { audio.pause(); setPlaying(false) }
      else void audio.play().then(() => setPlaying(true)).catch(() => setToast('O navegador bloqueou a reprodução. Tente novamente.'))
      return
    }
    if (generatedUrlRef.current) { URL.revokeObjectURL(generatedUrlRef.current); generatedUrlRef.current = null }
    let source = item.previewUrl
    let label = 'Prévia pública de 30 segundos'
    if (!source) { source = createDemoAudioUrl(item); generatedUrlRef.current = source; label = 'Instrumental demonstrativo' }
    setCurrentItem(item); setCurrentTime(0); setDuration(0); setSourceLabel(label)
    setRecentItems((current) => [item, ...current.filter((entry) => entry.id !== item.id)].slice(0, 20))
    audio.src = source; audio.volume = volume
    void audio.play().then(() => setPlaying(true)).catch(() => { setPlaying(false); setToast('Não foi possível iniciar o áudio. Clique em reproduzir novamente.') })
  }

  const moveInQueue = (direction: -1 | 1) => {
    if (!playableQueue.length) return
    const index = currentItem ? playableQueue.findIndex((item) => item.id === currentItem.id) : -1
    playItem(playableQueue[index < 0 ? 0 : (index + direction + playableQueue.length) % playableQueue.length])
  }
  const toggleLike = (item: MediaItem) => setLikedItems((current) => current.some((entry) => entry.id === item.id) ? current.filter((entry) => entry.id !== item.id) : [item, ...current])
  const showMore = (item: MediaItem) => {
    if (item.externalUrl) { window.open(item.externalUrl, '_blank', 'noopener,noreferrer'); return }
    setToast(`${item.title} faz parte do catálogo demonstrativo do Pulse.`)
  }
  const searchCategory = (term: string, type: SearchFilter = 'all') => {
    setQuery(term); setFilter(type); setActiveView('search'); setMobileNavOpen(false); inputRef.current?.focus()
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar--open' : ''}`}>
        <button className="brand" type="button" onClick={() => selectView('home')} aria-label="Pulse, página inicial"><span className="brand__mark"><i /><i /><i /></span><span>pulse</span></button>
        <nav aria-label="Navegação principal">
          <button className={activeView === 'home' ? 'active' : ''} type="button" onClick={() => selectView('home')}><Home size={20} /> Início</button>
          <button className={activeView === 'search' ? 'active' : ''} type="button" onClick={() => selectView('search')}><Search size={20} /> Buscar</button>
          <button className={activeView === 'library' ? 'active' : ''} type="button" onClick={() => selectView('library')}><Library size={20} /> Sua coleção</button>
        </nav>
        <div className="sidebar__rule" />
        <nav aria-label="Sua biblioteca">
          <button className={activeView === 'recent' ? 'active' : ''} type="button" onClick={() => selectView('recent')}><Clock3 size={19} /> Ouvidas recentemente</button>
          <button type="button" onClick={() => searchCategory('playlist', 'playlist')}><ListMusic size={19} /> Suas playlists</button>
          <button type="button" onClick={() => searchCategory('podcast', 'podcast')}><Mic2 size={19} /> Seus podcasts</button>
        </nav>
        <div className="sidebar__footer"><span>Catálogo público + demonstração</span><span>Preferências salvas neste aparelho</span></div>
      </aside>

      <main id="top">
        <header className="topbar">
          <button className="icon-button menu-button" type="button" onClick={() => setMobileNavOpen((value) => !value)} aria-label="Abrir menu"><Menu /></button>
          <div className="search-field" id="search"><Search size={21} aria-hidden="true" /><input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setActiveView('search') }} placeholder="O que você quer ouvir?" aria-label="Buscar músicas, artistas, álbuns, playlists e podcasts" autoComplete="off" />{query ? <button type="button" onClick={() => setQuery('')} aria-label="Limpar busca"><X size={18} /></button> : <kbd>/</kbd>}</div>
          <div className="profile-wrap">
            <button className="profile-button" type="button" onClick={() => setProfileOpen((value) => !value)} aria-expanded={profileOpen} aria-label="Abrir perfil"><span>AS</span><b>Alex Silva</b></button>
            {profileOpen && <div className="profile-menu"><strong>Alex Silva</strong><span>Perfil local</span><p>Suas músicas curtidas ficam salvas neste navegador.</p></div>}
          </div>
        </header>

        <section className="content" aria-busy={query !== debouncedQuery || remoteState === 'loading'}>
          {activeView === 'library' ? <SavedView title="Sua coleção" eyebrow="MÚSICAS CURTIDAS" items={likedItems} empty="Curta uma música para encontrá-la aqui." playingId={playingId} likedIds={likedIds} onPlay={playItem} onLike={toggleLike} onMore={showMore} />
          : activeView === 'recent' ? <SavedView title="Ouvidas recentemente" eyebrow="SEU HISTÓRICO" items={recentItems} empty="As faixas que você reproduzir aparecerão aqui." playingId={playingId} likedIds={likedIds} onPlay={playItem} onLike={toggleLike} onMore={showMore} />
          : !isSearching ? <BrowseView onSelect={searchCategory} />
          : <>
              <div className="filter-row" aria-label="Filtrar resultados">{filters.map((item) => <button key={item.id} className={filter === item.id ? 'active' : ''} type="button" onClick={() => setFilter(item.id)} aria-pressed={filter === item.id}>{item.label}</button>)}</div>
              {remoteState === 'loading' && <p className="catalog-status">Buscando músicas e prévias no catálogo público…</p>}
              {remoteState === 'ready' && <p className="catalog-status catalog-status--ready">Resultados públicos com prévia de áudio disponíveis.</p>}
              {remoteState === 'fallback' && <p className="catalog-status">Catálogo público indisponível; exibindo a coleção demonstrativa com áudio local.</p>}
              <p className="sr-only" role="status" aria-live="polite">{results.length} resultados para {debouncedQuery}</p>
              {results.length === 0 && remoteState === 'loading' ? <LoadingState /> : results.length === 0 ? <EmptyState query={debouncedQuery} onClear={() => { setQuery(''); setFilter('all'); setActiveView('home') }} /> : <SearchResults topResult={topResult} tracks={grouped.track} cards={results.map((result) => result.item)} filter={filter} playingId={playingId} likedIds={likedIds} onPlay={playItem} onLike={toggleLike} onMore={showMore} />}
            </>}
        </section>
      </main>

      <audio ref={audioRef} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => moveInQueue(1)} />
      {currentItem && <PlayerBar item={currentItem} playing={playing} currentTime={currentTime} duration={duration} volume={volume} sourceLabel={sourceLabel} onToggle={() => playItem(currentItem)} onPrevious={() => moveInQueue(-1)} onNext={() => moveInQueue(1)} onSeek={(time) => { if (audioRef.current) audioRef.current.currentTime = time; setCurrentTime(time) }} onVolume={(next) => { if (audioRef.current) audioRef.current.volume = next; setVolume(next) }} onClose={() => { audioRef.current?.pause(); setCurrentItem(null); setPlaying(false) }} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}

function BrowseView({ onSelect }: { onSelect: (term: string, type?: SearchFilter) => void }) {
  return <><div className="hero-copy"><span className="eyebrow">EXPLORE SEM PRESSA</span><h1>Encontre seu próximo<br /><em>som favorito.</em></h1><p>Busque por música, artista, álbum ou clima. Resultados organizados para você chegar mais rápido ao que importa — e agora com áudio de verdade.</p></div><section aria-labelledby="browse-title"><div className="section-heading"><div><span className="eyebrow">DESCUBRA</span><h2 id="browse-title">Navegue por categoria</h2></div><Compass size={24} /></div><div className="category-grid">{browseCategories.map((category, index) => <button key={category.name} type="button" aria-label={category.name} onClick={() => onSelect(category.term, category.type)} style={{ '--category-start': category.accent, '--category-end': category.accentEnd } as React.CSSProperties}><span>{String(index + 1).padStart(2, '0')}</span><strong>{category.name}</strong><i aria-hidden="true" /></button>)}</div></section></>
}

interface SearchResultsProps { topResult?: MediaItem; tracks: ReturnType<typeof groupResults>['track']; cards: MediaItem[]; filter: SearchFilter; playingId: string | null; likedIds: ReadonlySet<string>; onPlay: (item: MediaItem) => void; onLike: (item: MediaItem) => void; onMore: (item: MediaItem) => void }

function SearchResults({ topResult, tracks, cards, filter, playingId, likedIds, onPlay, onLike, onMore }: SearchResultsProps) {
  const showOverview = filter === 'all'
  const highlightedId = showOverview ? topResult?.id : undefined
  const cardItems = cards.filter((item) => item.id !== highlightedId && item.type !== 'track').slice(0, showOverview ? 5 : 12)
  const visibleTracks = tracks.filter((result) => result.item.id !== highlightedId).slice(0, showOverview ? 8 : 36)
  return <div className="results-layout">
    {showOverview && topResult && <section className="top-result" aria-labelledby="top-result-title"><span className="eyebrow">MELHOR RESULTADO</span><div className="top-result__content"><Cover item={topResult} size="large" /><div><h1 id="top-result-title">{topResult.title}</h1><p>{topResult.subtitle}</p><span className="type-pill">{topResult.type === 'artist' ? 'Artista' : topResult.meta}</span></div><PlayButton label={topResult.title} active={playingId === topResult.id} onClick={() => onPlay(topResult)} /></div></section>}
    {visibleTracks.length > 0 && <section className="tracks-section" aria-labelledby="tracks-title"><div className="section-heading"><h2 id="tracks-title">Músicas</h2><span>{tracks.length} encontradas</span></div><div className="track-list">{visibleTracks.map((result, index) => <TrackRow key={result.item.id} item={result.item} index={index} playingId={playingId} liked={likedIds.has(result.item.id)} onPlay={onPlay} onLike={onLike} onMore={onMore} />)}</div></section>}
    {cardItems.length > 0 && <section className="cards-section" aria-labelledby="more-title"><div className="section-heading"><h2 id="more-title">{filter === 'all' ? 'Mais resultados' : 'Resultados'}</h2><span>ordenados por relevância</span></div><div className="cards-grid">{cardItems.map((item) => <ResultCard key={item.id} item={item} playingId={playingId} onPlay={onPlay} onMore={onMore} />)}</div></section>}
  </div>
}

interface SavedViewProps { title: string; eyebrow: string; items: MediaItem[]; empty: string; playingId: string | null; likedIds: ReadonlySet<string>; onPlay: (item: MediaItem) => void; onLike: (item: MediaItem) => void; onMore: (item: MediaItem) => void }
function SavedView({ title, eyebrow, items, empty, playingId, likedIds, onPlay, onLike, onMore }: SavedViewProps) {
  return <section className="saved-view" aria-labelledby="saved-view-title"><span className="eyebrow">{eyebrow}</span><h1 id="saved-view-title">{title}</h1>{items.length ? <div className="track-list">{items.map((item, index) => <TrackRow key={item.id} item={item} index={index} playingId={playingId} liked={likedIds.has(item.id)} onPlay={onPlay} onLike={onLike} onMore={onMore} />)}</div> : <p className="saved-view__empty">{empty}</p>}</section>
}

function LoadingState() { return <div className="loading-state" role="status"><span /><p>Procurando faixas com prévia de áudio…</p></div> }
function EmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return <div className="empty-state"><div><Search size={36} /></div><span className="eyebrow">NENHUM RESULTADO</span><h1>Não encontramos “{query}”</h1><p>Confira a escrita ou tente outro artista, música, álbum ou gênero.</p><button type="button" onClick={onClear}>Explorar categorias</button></div>
}

export default App
