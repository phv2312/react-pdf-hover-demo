import { useCallback, useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import type { PdfDocument, PdfField } from '../types'
import { polygonToSvgPoints } from '../utils/polygon'

const MIN_ZOOM = 50
const MAX_ZOOM = 200
const ZOOM_STEP = 25
const MAX_BASE_PAGE_WIDTH = 612
const TOOLBAR_HIDE_DELAY = 1800

interface DragState {
  pointerId: number
  startX: number
  startY: number
  scrollLeft: number
  scrollTop: number
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

interface PdfViewerProps {
  documents: PdfDocument[]
  selectedDocument: PdfDocument
  activePage: number
  activeField: PdfField | null
  onDocumentChange: (documentId: string) => void
  onPageChange: (page: number) => void
  onDocumentLoad: (pages: number) => void
}

export function PdfViewer({
  documents,
  selectedDocument,
  activePage,
  activeField,
  onDocumentChange,
  onPageChange,
  onDocumentLoad,
}: PdfViewerProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef<DragState | null>(null)
  const toolbarTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [stageWidth, setStageWidth] = useState(MAX_BASE_PAGE_WIDTH + 32)
  const [zoom, setZoom] = useState(100)
  const [isDragging, setIsDragging] = useState(false)
  const [isPannable, setIsPannable] = useState(false)
  const [isToolbarVisible, setIsToolbarVisible] = useState(false)

  const clearToolbarTimer = useCallback(() => {
    if (toolbarTimerRef.current) {
      clearTimeout(toolbarTimerRef.current)
      toolbarTimerRef.current = null
    }
  }, [])

  const hideToolbarLater = useCallback(() => {
    clearToolbarTimer()
    toolbarTimerRef.current = setTimeout(() => {
      setIsToolbarVisible(false)
      toolbarTimerRef.current = null
    }, TOOLBAR_HIDE_DELAY)
  }, [clearToolbarTimer])

  const revealToolbar = useCallback(() => {
    setIsToolbarVisible(true)
    hideToolbarLater()
  }, [hideToolbarLater])

  useEffect(() => clearToolbarTimer, [clearToolbarTimer])

  const updatePanAvailability = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return

    setStageWidth(stage.clientWidth)
    setIsPannable(
      stage.scrollWidth > stage.clientWidth || stage.scrollHeight > stage.clientHeight,
    )
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const observer = new ResizeObserver(updatePanAvailability)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [updatePanAvailability])

  useEffect(() => {
    requestAnimationFrame(updatePanAvailability)
  }, [activePage, selectedDocument.id, updatePanAvailability, zoom])

  const handleLoadSuccess = ({ numPages: loadedPages }: PDFDocumentProxy) => {
    setNumPages(loadedPages)
    onDocumentLoad(loadedPages)
  }

  const responsiveBaseWidth = Math.max(
    280,
    Math.min(MAX_BASE_PAGE_WIDTH, stageWidth - 32),
  )
  const pageWidth = Math.round(responsiveBaseWidth * (zoom / 100))
  const visibleField = activeField?.page === activePage ? activeField : null

  const startDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    const stage = event.currentTarget
    const hasOverflow =
      stage.scrollWidth > stage.clientWidth || stage.scrollHeight > stage.clientHeight

    if (event.button !== 0 || !hasOverflow) return

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: stage.scrollLeft,
      scrollTop: stage.scrollTop,
    }
    stage.setPointerCapture(event.pointerId)
    setIsDragging(true)
  }

  const dragPage = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    event.preventDefault()
    event.currentTarget.scrollLeft = drag.scrollLeft - (event.clientX - drag.startX)
    event.currentTarget.scrollTop = drag.scrollTop - (event.clientY - drag.startY)
  }

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragStateRef.current = null
    setIsDragging(false)
  }

  return (
    <section className="viewer-panel order-1 lg:order-none" aria-labelledby="viewer-heading">
      <div className="viewer-toolbar">
        <div className="document-picker">
          <p className="eyebrow">Live preview</p>
          <div className="select-shell">
            <select
              id="pdf-document"
              aria-label="Select PDF document"
              value={selectedDocument.id}
              onChange={(event) => onDocumentChange(event.target.value)}
            >
              {documents.map((document) => (
                <option key={document.id} value={document.id}>
                  {document.name}
                </option>
              ))}
            </select>
            <span aria-hidden="true">⌄</span>
          </div>
          <span className="sr-only" id="viewer-heading">
            PDF document viewer
          </span>
        </div>
      </div>

      <div
        className="viewport-shell relative h-[65vh] min-h-96 w-full overflow-hidden sm:h-[68vh] lg:h-[70vh] lg:max-h-[45rem]"
        onPointerEnter={revealToolbar}
        onPointerMove={revealToolbar}
        onPointerLeave={hideToolbarLater}
        onFocusCapture={() => {
          clearToolbarTimer()
          setIsToolbarVisible(true)
        }}
        onBlurCapture={hideToolbarLater}
      >
        <div
          className={`floating-toolbar absolute top-4 left-1/2 z-20 flex max-w-[calc(100%-24px)] -translate-x-1/2 items-center gap-2 rounded-md border border-white/15 bg-[#132b2c]/95 p-1.5 shadow-2xl backdrop-blur-sm transition duration-200 ${
            isToolbarVisible
              ? 'visible translate-y-0 opacity-100'
              : 'invisible -translate-y-2 opacity-0 pointer-events-none'
          }`}
          aria-label="PDF controls"
          aria-hidden={!isToolbarVisible}
          onPointerMove={revealToolbar}
        >
          <div className="zoom-controls" aria-label="PDF zoom controls">
            <button
              type="button"
              onClick={() => setZoom((current) => Math.max(MIN_ZOOM, current - ZOOM_STEP))}
              disabled={zoom === MIN_ZOOM}
              aria-label="Zoom out"
            >
              −
            </button>
            <button
              className="zoom-value"
              type="button"
              onClick={() => setZoom(100)}
              aria-label={`Reset zoom, currently ${zoom}%`}
              title="Reset zoom"
            >
              {zoom}%
            </button>
            <button
              type="button"
              onClick={() => setZoom((current) => Math.min(MAX_ZOOM, current + ZOOM_STEP))}
              disabled={zoom === MAX_ZOOM}
              aria-label="Zoom in"
            >
              +
            </button>
          </div>
          <div className="page-controls" aria-label="PDF page navigation">
            <button
              type="button"
              onClick={() => onPageChange(activePage - 1)}
              disabled={activePage <= 1}
              aria-label="Previous page"
            >
              ←
            </button>
            <span>
              {activePage} <small>/ {numPages || '…'}</small>
            </span>
            <button
              type="button"
              onClick={() => onPageChange(activePage + 1)}
              disabled={!numPages || activePage >= numPages}
              aria-label="Next page"
            >
              →
            </button>
          </div>
        </div>

        <div
          className={`viewer-stage h-full w-full touch-none overflow-auto p-4 ${
            isDragging
              ? 'cursor-grabbing select-none'
              : isPannable
                ? 'cursor-grab'
                : 'cursor-default'
          }`}
          ref={stageRef}
          tabIndex={0}
          aria-label="Draggable PDF canvas"
          onScroll={revealToolbar}
          onWheel={revealToolbar}
          onPointerDown={startDragging}
          onPointerMove={dragPage}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onDragStart={(event) => event.preventDefault()}
        >
          <Document
            key={selectedDocument.id}
            file={selectedDocument.fileUrl}
            onLoadSuccess={handleLoadSuccess}
            loading={<div className="viewer-message">Loading the PDF…</div>}
            error={
              <div className="viewer-message is-error">
                {selectedDocument.name} could not be loaded. Check its path in the document list.
              </div>
            }
          >
            <div className="pdf-page-shell" data-page={activePage}>
              <Page
                pageNumber={activePage}
                width={pageWidth}
                onRenderSuccess={updatePanAvailability}
              />
              <svg
                className="highlight-layer"
                viewBox="0 0 1 1"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {visibleField && (
                  <polygon
                    key={visibleField.id}
                    points={polygonToSvgPoints(visibleField.polygon)}
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              </svg>
            </div>
          </Document>
        </div>
      </div>

      <div className="viewer-status" aria-live="polite">
        <span className={`status-dot${visibleField ? ' is-active' : ''}`} />
        {visibleField
          ? `Highlighting “${visibleField.value}” on page ${visibleField.page}`
          : 'Move over a field to see its polygon'}
      </div>
    </section>
  )
}
