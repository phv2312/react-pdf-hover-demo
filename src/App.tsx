import { useState } from 'react'
import { FieldList } from './components/FieldList'
import { DummyPanel } from './components/DummyPanel'
import { PdfViewer } from './components/PdfViewer'
import { Tutorial } from './components/Tutorial'
import { pdfDocuments } from './data/documents'
import type { PdfField } from './types'

export default function App() {
  const [selectedDocumentId, setSelectedDocumentId] = useState(pdfDocuments[0].id)
  const [activePage, setActivePage] = useState(1)
  const [activeField, setActiveField] = useState<PdfField | null>(null)
  const [numPages, setNumPages] = useState(0)
  const selectedDocument =
    pdfDocuments.find((document) => document.id === selectedDocumentId) ?? pdfDocuments[0]

  const selectDocument = (documentId: string) => {
    setSelectedDocumentId(documentId)
    setActivePage(1)
    setActiveField(null)
    setNumPages(0)
  }

  const activateField = (field: PdfField) => {
    setActivePage(field.page)
    setActiveField(field)
  }

  const changePage = (page: number) => {
    const lastPage = numPages || page
    setActivePage(Math.min(Math.max(page, 1), lastPage))
    setActiveField(null)
  }

  return (
    <>
      <header className="hero">
        <nav className="nav-shell" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="PDF Lab home">
            <span className="brand-mark">P</span>
            PDF Lab
          </a>
          <a className="tutorial-link" href="#tutorial">
            Read the tutorial <span aria-hidden="true">↓</span>
          </a>
        </nav>

        <div className="hero-copy" id="top">
          <p className="eyebrow">React 19 · React-PDF · TypeScript</p>
          <h1>
            Connect structured fields to <em>real places</em> in a PDF.
          </h1>
          <p className="hero-description">
            Explore a working field highlighter, then follow the implementation from
            typed data to a responsive SVG overlay.
          </p>
          <div className="hero-meta" aria-label="Project facts">
            <span><strong>{numPages || selectedDocument.pageCount}</strong> PDF pages</span>
            <span><strong>{selectedDocument.fields.length}</strong> sample fields</span>
            <span><strong>8</strong> values per polygon</span>
          </div>
        </div>
      </header>

      <main>
        <section
          className="demo-shell mx-auto grid w-full max-w-[107.5rem] grid-cols-1 gap-5 px-3 pt-5 pb-16 lg:grid-cols-[minmax(7rem,0.48fr)_minmax(0,1.1fr)_minmax(0,1.25fr)] lg:gap-5.5 lg:px-6 lg:pt-8 lg:pb-24 2xl:grid-cols-[minmax(0,0.5fr)_minmax(0,1.15fr)_minmax(0,1.25fr)]"
          aria-label="Interactive PDF field demo"
        >
          <DummyPanel />
          <FieldList
            fields={selectedDocument.fields}
            activeFieldId={activeField?.id ?? null}
            onActivate={activateField}
            onDeactivate={() => setActiveField(null)}
          />
          <PdfViewer
            documents={pdfDocuments}
            selectedDocument={selectedDocument}
            activePage={activePage}
            activeField={activeField}
            onDocumentChange={selectDocument}
            onPageChange={changePage}
            onDocumentLoad={setNumPages}
          />
        </section>

        <Tutorial />
      </main>

      <footer>
        <span>PDF Lab</span>
        <p>Built to make coordinates visible.</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  )
}
