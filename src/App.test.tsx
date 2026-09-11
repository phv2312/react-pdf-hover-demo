import { useEffect, useRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('react-pdf', () => ({
  pdfjs: {
    GlobalWorkerOptions: { workerSrc: '' },
  },
  Document: ({ children, onLoadSuccess }: { children: React.ReactNode; onLoadSuccess: (value: { numPages: number }) => void }) => {
    const hasLoaded = useRef(false)

    useEffect(() => {
      if (!hasLoaded.current) {
        hasLoaded.current = true
        onLoadSuccess({ numPages: 26 })
      }
    }, [onLoadSuccess])

    return <div data-testid="document">{children}</div>
  },
  Page: ({ pageNumber }: { pageNumber: number }) => <div>Rendered page {pageNumber}</div>,
}))

vi.stubGlobal(
  'ResizeObserver',
  class {
    observe() {}
    disconnect() {}
  },
)

describe('field-to-PDF interaction', () => {
  it('renders the three-column workspace in desktop order', () => {
    render(<App />)

    const workspace = screen.getByLabelText('Interactive PDF field demo')
    expect(workspace.children[0]).toHaveAttribute('aria-label', 'Placeholder workspace panel')
    expect(workspace.children[1]).toHaveClass('field-panel')
    expect(workspace.children[2]).toHaveClass('viewer-panel')
  })

  it('shows the available PDFs in a document selector', () => {
    render(<App />)

    const selector = screen.getByRole('combobox', { name: 'Select PDF document' })
    expect(selector).toHaveValue('graphrag')
    expect(screen.getByRole('option', { name: 'GraphRAG.pdf' })).toBeInTheDocument()
  })

  it('reveals the floating toolbar when the user enters the PDF viewport', () => {
    render(<App />)
    const toolbar = document.querySelector<HTMLElement>('[aria-label="PDF controls"]')
    const stage = screen.getByLabelText('Draggable PDF canvas')

    expect(toolbar).not.toBeNull()
    expect(toolbar).toHaveClass('opacity-0')
    fireEvent.pointerEnter(stage)
    expect(toolbar).toHaveClass('opacity-100')
  })

  it('jumps to a field page, highlights it, then stays on that page after leaving', () => {
    render(<App />)
    const field = screen.getByRole('button', { name: /Pipeline input/i })

    fireEvent.mouseEnter(field)
    expect(screen.getByText('Rendered page 4')).toBeInTheDocument()
    expect(screen.getByText(/Highlighting “Source Documents”/)).toBeInTheDocument()

    fireEvent.mouseLeave(field)
    expect(screen.getByText('Rendered page 4')).toBeInTheDocument()
    expect(screen.getByText(/Move over a field/)).toBeInTheDocument()
  })

  it('keeps manual page navigation inside the document boundaries', () => {
    render(<App />)
    fireEvent.pointerEnter(screen.getByLabelText('Draggable PDF canvas'))
    const previous = screen.getByRole('button', { name: 'Previous page' })
    expect(previous).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(screen.getByText('Rendered page 2')).toBeInTheDocument()
    expect(previous).toBeEnabled()
  })

  it('zooms in, zooms out, and resets to 100%', () => {
    render(<App />)
    fireEvent.pointerEnter(screen.getByLabelText('Draggable PDF canvas'))

    const zoomIn = screen.getByRole('button', { name: 'Zoom in' })
    const zoomOut = screen.getByRole('button', { name: 'Zoom out' })

    fireEvent.click(zoomIn)
    expect(screen.getByRole('button', { name: /Reset zoom, currently 125%/ })).toHaveTextContent('125%')

    fireEvent.click(zoomOut)
    expect(screen.getByRole('button', { name: /Reset zoom, currently 100%/ })).toHaveTextContent('100%')

    fireEvent.click(zoomIn)
    fireEvent.click(screen.getByRole('button', { name: /Reset zoom, currently 125%/ }))
    expect(screen.getByRole('button', { name: /Reset zoom, currently 100%/ })).toBeInTheDocument()
  })

  it('drags an overflowing PDF in both directions', () => {
    render(<App />)
    const stage = screen.getByLabelText('Draggable PDF canvas')

    Object.defineProperties(stage, {
      clientWidth: { configurable: true, value: 760 },
      clientHeight: { configurable: true, value: 720 },
      scrollWidth: { configurable: true, value: 1200 },
      scrollHeight: { configurable: true, value: 1000 },
    })
    stage.scrollLeft = 100
    stage.scrollTop = 80
    stage.setPointerCapture = vi.fn()
    stage.hasPointerCapture = vi.fn(() => true)
    stage.releasePointerCapture = vi.fn()

    fireEvent.pointerDown(stage, { button: 0, pointerId: 7, clientX: 200, clientY: 180 })
    fireEvent.pointerMove(stage, { pointerId: 7, clientX: 140, clientY: 120 })

    expect(stage.scrollLeft).toBe(160)
    expect(stage.scrollTop).toBe(140)

    fireEvent.pointerUp(stage, { pointerId: 7 })
    expect(stage.releasePointerCapture).toHaveBeenCalledWith(7)
  })
})
