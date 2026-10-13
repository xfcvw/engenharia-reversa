import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
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
})
