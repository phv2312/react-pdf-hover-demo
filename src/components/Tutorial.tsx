const steps = [
  {
    number: '01',
    title: 'Understand the three layers',
    body: 'React-PDF renders the page canvas, a selectable text layer, and a link/annotation layer. Our SVG is a fourth layer. It belongs inside the same relatively positioned wrapper so every layer shares one size and origin.',
    code: `<div className="pdf-page-shell">
  <Page pageNumber={activePage} width={pageWidth} />
  <svg className="highlight-layer" viewBox="0 0 1 1">
    <polygon points={points} />
  </svg>
</div>`,
  },
  {
    number: '02',
    title: 'Configure the PDF.js worker',
    body: 'PDF.js parses and renders a document away from the main UI thread. React-PDF recommends setting the worker in the same module that uses Document and Page; another import can otherwise replace the setting because module order matters.',
    code: `pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()`,
  },
  {
    number: '03',
    title: 'Give field data a precise contract',
    body: 'A tuple guarantees exactly eight numbers: four x/y corners. The page number is one-based because that is the convention used by React-PDF. An id gives React a stable key and lets interaction state refer to a field without copying it.',
    code: `type Polygon = readonly [
  number, number, number, number,
  number, number, number, number,
]

interface PdfField {
  id: string
  fieldLabel: string
  value: string
  page: number
  polygon: Polygon
}`,
  },
  {
    number: '04',
    title: 'Normalize the coordinates',
    body: 'PDF tools often report points from the bottom-left. The browser uses a top-left origin. Divide x by page width, flip y, and divide it by page height. Once values are between 0 and 1, the same polygon works at every zoom level.',
    code: `normalizedX = pdfX / pageWidth
normalizedY = (pageHeight - pdfY) / pageHeight

// Rectangle order:
// top-left → top-right → bottom-right → bottom-left`,
  },
  {
    number: '05',
    title: 'Let SVG do the scaling',
    body: 'The SVG viewBox is one unit wide and one unit high, matching normalized data directly. The polygon helper only pairs adjacent numbers. CSS stretches the overlay to the exact rendered page bounds.',
    code: `function polygonToSvgPoints(polygon: Polygon) {
  const points: string[] = []
  for (let i = 0; i < polygon.length; i += 2) {
    points.push(\`${'${polygon[i]},${polygon[i + 1]}'}\`)
  }
  return points.join(' ')
}`,
  },
  {
    number: '06',
    title: 'Drive the page from field interaction',
    body: 'The app keeps activePage and activeField in its parent component. Entering or focusing a field updates both in one event. Leaving clears only the field, so the document remains on the page you just inspected.',
    code: `function activateField(field: PdfField) {
  setActivePage(field.page)
  setActiveField(field)
}

function deactivateField() {
  setActiveField(null)
}`,
  },
  {
    number: '07',
    title: 'Resize through React-PDF',
    body: 'A ResizeObserver measures the responsive viewport and caps the PDF base width at its natural 612-point page width. The selected zoom then multiplies that base before it reaches the Page component. When the result exceeds the viewport, Pointer Events turn the scroll area into a draggable canvas.',
    code: `const baseWidth = Math.min(612, viewportWidth - 32)
const pageWidth = baseWidth * (zoom / 100)

<Page width={pageWidth} />`,
  },
  {
    number: '08',
    title: 'Trace the complete data flow',
    body: 'A field begins as static typed data. User interaction selects it, React changes the PDF page, the tuple becomes an SVG points string, and the overlay scales with the rendered page. Try skewing one corner or adding a field from a later page to see each link in the chain.',
    code: `PdfField
  → hover / focus
  → activePage + activeField
  → <Page pageNumber={activePage}>
  → <polygon points="x,y x,y x,y x,y">`,
  },
]

export function Tutorial() {
  return (
    <section className="tutorial" id="tutorial" aria-labelledby="tutorial-heading">
      <div className="tutorial-heading">
        <p className="eyebrow">Walkthrough</p>
        <h2 id="tutorial-heading">Build the interaction, one idea at a time</h2>
        <p>
          Read these in order, then open the matching source files. Each step isolates
          one responsibility so you can change it without losing the full picture.
        </p>
      </div>

      <div className="tutorial-steps">
        {steps.map((step) => (
          <article className="tutorial-card" key={step.number}>
            <div className="step-number">{step.number}</div>
            <div className="step-copy">
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <pre>
                <code>{step.code}</code>
              </pre>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
