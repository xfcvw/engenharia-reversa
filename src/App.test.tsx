import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, vi } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [] }) }))
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: vi.fn(() => 'blob:demo-audio') })
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() })
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined)
  })

  it('busca, anuncia resultados e permite filtrar por tipo', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByRole('textbox', { name: /buscar músicas/i })
    await user.type(input, 'marina')

    expect(await screen.findByRole('heading', { name: 'Marina Sena' }, { timeout: 1000 })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Músicas' }))
    expect(screen.getByRole('button', { name: 'Músicas' })).toHaveAttribute('aria-pressed', 'true')
    expect(await screen.findByText('Por Supuesto')).toBeInTheDocument()
    expect(screen.getByText('Horizonte Azul')).toBeInTheDocument()
  })

  it('exibe estado vazio e permite voltar à exploração', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByRole('textbox', { name: /buscar músicas/i }), 'não existe xyz')
    expect(await screen.findByText(/não encontramos/i, {}, { timeout: 1000 })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /explorar categorias/i }))
    expect(screen.getByText(/navegue por categoria/i)).toBeInTheDocument()
  })

  it('reproduz áudio e conecta músicas curtidas à coleção', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByRole('textbox', { name: /buscar músicas/i }), 'marina')
    await user.click(screen.getByRole('button', { name: 'Músicas' }))

    const playButton = await screen.findByRole('button', { name: 'Reproduzir Por Supuesto' })
    await user.click(playButton)
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled()
    expect(screen.getByRole('region', { name: 'Player atual' })).toHaveTextContent('Por Supuesto')
    expect(screen.getByText(/instrumental demonstrativo/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /adicionar por supuesto às músicas curtidas/i }))
    await user.click(screen.getByRole('button', { name: 'Sua coleção' }))
    expect(screen.getByRole('heading', { name: 'Sua coleção' })).toBeInTheDocument()
    expect(screen.getAllByText('Por Supuesto').length).toBeGreaterThan(0)
  })
})
