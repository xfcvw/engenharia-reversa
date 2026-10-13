import { Clock3, Compass, Home, Library, ListMusic, Menu, Mic2, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Cover } from './components/Cover'
import { PlayButton } from './components/PlayButton'
import { ResultCard } from './components/ResultCard'
import { TrackRow } from './components/TrackRow'
import { browseCategories, catalog } from './data/catalog'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { groupResults, searchCatalog } from './lib/search'
import type { MediaItem, SearchFilter } from './types'

const filters: Array<{ id: SearchFilter; label: string }> = [
  { id: 'all', label: 'Tudo' },
  { id: 'track', label: 'Músicas' },
  { id: 'artist', label: 'Artistas' },
  { id: 'album', label: 'Álbuns' },
  { id: 'playlist', label: 'Playlists' },
  { id: 'podcast', label: 'Podcasts' },
]

function App() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<SearchFilter>('all')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebouncedValue(query)
  const results = useMemo(() => searchCatalog(catalog, debouncedQuery, filter), [debouncedQuery, filter])
  const grouped = useMemo(() => groupResults(results), [results])
  const topResult = results[0]?.item
  const isSearching = query.trim().length > 0

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        event.preventDefault()
        inputRef.current?.focus()
      }
      if (event.key === 'Escape' && document.activeElement === inputRef.current) {
        setQuery('')
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const togglePlay = (id: string) => setPlayingId((current) => current === id ? null : id)

  const searchCategory = (term: string) => {
    setQuery(term)
    setFilter('all')
    inputRef.current?.focus()
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar--open' : ''}`}>
        <a className="brand" href="#top" aria-label="Pulse, página inicial">
          <span className="brand__mark"><i /><i /><i /></span>
          <span>pulse</span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#top"><Home size={20} /> Início</a>
          <a className="active" href="#search"><Search size={20} /> Buscar</a>
          <a href="#library"><Library size={20} /> Sua coleção</a>
        </nav>
        <div className="sidebar__rule" />
        <nav aria-label="Sua biblioteca">
          <a href="#recent"><Clock3 size={19} /> Ouvidas recentemente</a>
          <a href="#playlists"><ListMusic size={19} /> Suas playlists</a>
          <a href="#podcasts"><Mic2 size={19} /> Seus podcasts</a>
        </nav>
        <div className="sidebar__footer">
          <span>Protótipo independente</span>
          <span>Busca local · sem login</span>
        </div>
      </aside>

      <main id="top">
        <header className="topbar">
          <button className="icon-button menu-button" type="button" onClick={() => setMobileNavOpen((value) => !value)} aria-label="Abrir menu"><Menu /></button>
          <div className="search-field" id="search">
            <Search size={21} aria-hidden="true" />
            <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="O que você quer ouvir?" aria-label="Buscar músicas, artistas, álbuns, playlists e podcasts" autoComplete="off" />
            {query ? <button type="button" onClick={() => setQuery('')} aria-label="Limpar busca"><X size={18} /></button> : <kbd>/</kbd>}
          </div>
          <button className="profile-button" type="button" aria-label="Abrir perfil"><span>AS</span><b>Alex Silva</b></button>
        </header>

        <section className="content" aria-busy={query !== debouncedQuery}>
          {!isSearching ? (
            <BrowseView onSelect={searchCategory} />
          ) : (
            <>
              <div className="filter-row" aria-label="Filtrar resultados">
                {filters.map((item) => (
                  <button key={item.id} className={filter === item.id ? 'active' : ''} type="button" onClick={() => setFilter(item.id)} aria-pressed={filter === item.id}>{item.label}</button>
                ))}
              </div>
              <p className="sr-only" role="status" aria-live="polite">{results.length} resultados para {debouncedQuery}</p>
              {results.length === 0 ? (
                <EmptyState query={debouncedQuery} onClear={() => { setQuery(''); setFilter('all') }} />
              ) : (
                <SearchResults topResult={topResult} tracks={grouped.track} cards={results.map((result) => result.item)} filter={filter} playingId={playingId} onPlay={togglePlay} />
              )}
            </>
          )}
        </section>
      </main>
    </div>
  )
}

function BrowseView({ onSelect }: { onSelect: (term: string) => void }) {
  return (
    <>
      <div className="hero-copy">
        <span className="eyebrow">EXPLORE SEM PRESSA</span>
        <h1>Encontre seu próximo<br /><em>som favorito.</em></h1>
        <p>Busque por música, artista, álbum ou clima. Resultados organizados para você chegar mais rápido ao que importa.</p>
      </div>
      <section aria-labelledby="browse-title">
        <div className="section-heading"><div><span className="eyebrow">DESCUBRA</span><h2 id="browse-title">Navegue por categoria</h2></div><Compass size={24} /></div>
        <div className="category-grid">
          {browseCategories.map((category, index) => (
            <button key={category.name} type="button" onClick={() => onSelect(category.term)} style={{ '--category-start': category.accent, '--category-end': category.accentEnd } as React.CSSProperties}>
              <span>{String(index + 1).padStart(2, '0')}</span><strong>{category.name}</strong><i aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
    </>
  )
}

interface SearchResultsProps {
  topResult?: MediaItem
  tracks: ReturnType<typeof groupResults>['track']
  cards: MediaItem[]
  filter: SearchFilter
  playingId: string | null
  onPlay: (id: string) => void
}

function SearchResults({ topResult, tracks, cards, filter, playingId, onPlay }: SearchResultsProps) {
  const showOverview = filter === 'all'
  const highlightedId = showOverview ? topResult?.id : undefined
  const cardItems = cards.filter((item) => item.id !== highlightedId && item.type !== 'track').slice(0, showOverview ? 5 : 12)
  const visibleTracks = tracks.filter((result) => result.item.id !== highlightedId).slice(0, showOverview ? 4 : 12)

  return (
    <div className="results-layout">
      {showOverview && topResult && (
        <section className="top-result" aria-labelledby="top-result-title">
          <span className="eyebrow">MELHOR RESULTADO</span>
          <div className="top-result__content">
            <Cover item={topResult} size="large" />
            <div><h1 id="top-result-title">{topResult.title}</h1><p>{topResult.subtitle}</p><span className="type-pill">{topResult.type === 'artist' ? 'Artista' : topResult.meta}</span></div>
            <PlayButton label={topResult.title} active={playingId === topResult.id} onClick={() => onPlay(topResult.id)} />
          </div>
        </section>
      )}

      {visibleTracks.length > 0 && (
        <section className="tracks-section" aria-labelledby="tracks-title">
          <div className="section-heading"><h2 id="tracks-title">Músicas</h2><span>{tracks.length} encontradas</span></div>
          <div className="track-list">
            {visibleTracks.map((result, index) => <TrackRow key={result.item.id} item={result.item} index={index} playingId={playingId} onPlay={onPlay} />)}
          </div>
        </section>
      )}

      {cardItems.length > 0 && (
        <section className="cards-section" aria-labelledby="more-title">
          <div className="section-heading"><h2 id="more-title">{filter === 'all' ? 'Mais resultados' : 'Resultados'}</h2><span>ordenados por relevância</span></div>
          <div className="cards-grid">{cardItems.map((item) => <ResultCard key={item.id} item={item} playingId={playingId} onPlay={onPlay} />)}</div>
        </section>
      )}
    </div>
  )
}

function EmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="empty-state">
      <div><Search size={36} /></div>
      <span className="eyebrow">NENHUM RESULTADO</span>
      <h1>Não encontramos “{query}”</h1>
      <p>Confira a escrita ou tente outro artista, música, álbum ou gênero.</p>
      <button type="button" onClick={onClear}>Explorar categorias</button>
    </div>
  )
}

export default App
