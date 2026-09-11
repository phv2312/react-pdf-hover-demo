import type { PdfDocument } from '../types'
import { pdfFields } from './fields'

// Add another object here after copying its PDF into public/. The dropdown,
// viewer, page count, and field list will update from this single data source.
export const pdfDocuments: PdfDocument[] = [
  {
    id: 'graphrag',
    name: 'GraphRAG.pdf',
    fileUrl: '/GraphRAG.pdf',
    pageCount: 26,
    fields: pdfFields,
  },
]
