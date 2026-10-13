import type { MediaItem } from '../types'

export const catalog: MediaItem[] = [
  { id: 't1', type: 'track', title: 'Horizonte Azul', subtitle: 'Marina Sena', meta: 'Vértice', duration: '3:24', accent: '#176f75', accentEnd: '#77d6bb', keywords: ['mpb', 'brasil', 'leve', 'verão'], popular: true },
  { id: 'a1', type: 'artist', title: 'Marina Sena', subtitle: 'Artista', meta: '2,8 mi ouvintes mensais', accent: '#f1553a', accentEnd: '#f3b879', keywords: ['mpb', 'pop', 'brasileira'], popular: true },
  { id: 't2', type: 'track', title: 'Por Supuesto', subtitle: 'Marina Sena', meta: 'De Primeira', duration: '3:06', accent: '#8c4352', accentEnd: '#e9a58e', keywords: ['mpb', 'pop', 'brasil'], popular: true },
  { id: 'al1', type: 'album', title: 'De Primeira', subtitle: 'Marina Sena', meta: 'Álbum · 2021', accent: '#c5484c', accentEnd: '#e9c28b', keywords: ['álbum', 'mpb', 'pop'] },
  { id: 't3', type: 'track', title: 'Dengo', subtitle: 'João Gomes', meta: 'Digo ou Não Digo', duration: '2:42', accent: '#75382c', accentEnd: '#eab85e', keywords: ['forró', 'piseiro', 'romântico'], popular: true },
  { id: 'a2', type: 'artist', title: 'João Gomes', subtitle: 'Artista', meta: '9,4 mi ouvintes mensais', accent: '#1d596b', accentEnd: '#7fc6d4', keywords: ['forró', 'piseiro', 'nordeste'] },
  { id: 't4', type: 'track', title: 'Acorda Pedrinho', subtitle: 'Jovem Dionisio', meta: 'Acorda Pedrinho', duration: '2:53', accent: '#203e67', accentEnd: '#d25b79', keywords: ['indie', 'pop', 'brasil'] },
  { id: 'al2', type: 'album', title: 'Clube da Esquina', subtitle: 'Milton Nascimento, Lô Borges', meta: 'Álbum · 1972', accent: '#5a3f27', accentEnd: '#b99d6d', keywords: ['mpb', 'clássico', 'brasil'], popular: true },
  { id: 't5', type: 'track', title: 'Tudo o Que Você Podia Ser', subtitle: 'Milton Nascimento, Lô Borges', meta: 'Clube da Esquina', duration: '2:56', accent: '#493923', accentEnd: '#d7bd86', keywords: ['mpb', 'clássico'] },
  { id: 'p1', type: 'playlist', title: 'Brasil em Alta', subtitle: 'Pulse', meta: '50 faixas', accent: '#117b56', accentEnd: '#c7f05c', keywords: ['brasil', 'hits', 'populares'], popular: true },
  { id: 'p2', type: 'playlist', title: 'Indie para a Estrada', subtitle: 'Pulse', meta: '42 faixas', accent: '#6a4db2', accentEnd: '#dd91d8', keywords: ['indie', 'viagem', 'alternativo'] },
  { id: 'p3', type: 'playlist', title: 'Café & Foco', subtitle: 'Pulse', meta: '65 faixas', accent: '#6b492d', accentEnd: '#d8a96a', keywords: ['foco', 'instrumental', 'trabalho'] },
  { id: 'p4', type: 'playlist', title: 'Bossa no Fim de Tarde', subtitle: 'Pulse', meta: '38 faixas', accent: '#95663a', accentEnd: '#f5c791', keywords: ['bossa nova', 'mpb', 'calmo'] },
  { id: 'po1', type: 'podcast', title: 'Café da Manhã', subtitle: 'Folha de S.Paulo', meta: 'Podcast diário', accent: '#b4332d', accentEnd: '#ff8d67', keywords: ['notícias', 'brasil', 'diário'], popular: true },
  { id: 'po2', type: 'podcast', title: 'Rádio Novelo Apresenta', subtitle: 'Rádio Novelo', meta: 'Podcast narrativo', accent: '#263b65', accentEnd: '#eaaf67', keywords: ['histórias', 'documentário', 'brasil'] },
  { id: 'a3', type: 'artist', title: 'Liniker', subtitle: 'Artista', meta: '4,1 mi ouvintes mensais', accent: '#853049', accentEnd: '#f0928a', keywords: ['mpb', 'soul', 'brasileira'], popular: true },
  { id: 't6', type: 'track', title: 'Baby 95', subtitle: 'Liniker', meta: 'CAJU', duration: '3:30', accent: '#8b3b42', accentEnd: '#e39b6f', keywords: ['mpb', 'soul', 'romântico'] },
  { id: 'al3', type: 'album', title: 'CAJU', subtitle: 'Liniker', meta: 'Álbum · 2024', accent: '#693d2f', accentEnd: '#efab72', keywords: ['mpb', 'soul', 'álbum'], popular: true },
  { id: 't7', type: 'track', title: 'Oração ao Tempo', subtitle: 'Caetano Veloso', meta: 'Cinema Transcendental', duration: '3:28', accent: '#31524d', accentEnd: '#a3c783', keywords: ['mpb', 'clássico', 'brasil'] },
  { id: 'a4', type: 'artist', title: 'Caetano Veloso', subtitle: 'Artista', meta: '3,7 mi ouvintes mensais', accent: '#31524d', accentEnd: '#c8cf8d', keywords: ['mpb', 'tropicália', 'brasil'] },
]

export const browseCategories = [
  { name: 'Feito para você', accent: '#713cce', accentEnd: '#bd8cf4', term: 'populares' },
  { name: 'Lançamentos', accent: '#db593b', accentEnd: '#ffad78', term: 'álbum' },
  { name: 'Música brasileira', accent: '#18875d', accentEnd: '#57c990', term: 'brasil' },
  { name: 'Podcasts', accent: '#3152a4', accentEnd: '#708de2', term: 'podcast' },
  { name: 'Para relaxar', accent: '#8a6544', accentEnd: '#dcb878', term: 'calmo' },
  { name: 'Indie', accent: '#9752ad', accentEnd: '#ed9adf', term: 'indie' },
]
