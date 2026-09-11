import type { PdfField } from '../types'

// Coordinates are normalized to 0..1 from the page's top-left corner.
// Each polygon is ordered: top-left, top-right, bottom-right, bottom-left.
export const pdfFields: PdfField[] = [
  {
    id: 'paper-topic',
    fieldLabel: 'Paper topic',
    value: 'GraphRAG',
    page: 1,
    polygon: [0.50391, 0.12774, 0.64459, 0.12774, 0.64459, 0.14728, 0.50391, 0.14728],
  },
  {
    id: 'paper-subtitle',
    fieldLabel: 'Title phrase',
    value: 'Query-Focused Summarization',
    page: 1,
    polygon: [0.31166, 0.1529, 0.68834, 0.1529, 0.68834, 0.17244, 0.31166, 0.17244],
  },
  {
    id: 'lead-author',
    fieldLabel: 'Lead author',
    value: 'Darren Edge',
    page: 1,
    polygon: [0.19623, 0.22767, 0.28591, 0.22767, 0.28591, 0.24094, 0.19623, 0.24094],
  },
  {
    id: 'organization',
    fieldLabel: 'Organization',
    value: 'Microsoft Research',
    page: 1,
    polygon: [0.43888, 0.32741, 0.56722, 0.32741, 0.56722, 0.34066, 0.43888, 0.34066],
  },
  {
    id: 'abstract-heading',
    fieldLabel: 'Section heading',
    value: 'Abstract',
    page: 1,
    polygon: [0.46366, 0.47803, 0.53635, 0.47803, 0.53635, 0.4916, 0.46366, 0.4916],
  },
  {
    id: 'baseline-name',
    fieldLabel: 'Baseline method',
    value: 'vector RAG',
    page: 2,
    polygon: [0.17647, 0.12251, 0.25256, 0.12251, 0.25256, 0.13375, 0.17647, 0.13375],
  },
  {
    id: 'task-name',
    fieldLabel: 'Target task',
    value: 'global sensemaking',
    page: 2,
    polygon: [0.51188, 0.46007, 0.64182, 0.46007, 0.64182, 0.47131, 0.51188, 0.47131],
  },
  {
    id: 'diagram-source',
    fieldLabel: 'Pipeline input',
    value: 'Source Documents',
    page: 4,
    polygon: [0.25521, 0.09966, 0.37999, 0.09966, 0.37999, 0.11091, 0.25521, 0.11091],
  },
  {
    id: 'diagram-chunks',
    fieldLabel: 'Pipeline stage',
    value: 'Text Chunks',
    page: 4,
    polygon: [0.27579, 0.15693, 0.35941, 0.15693, 0.35941, 0.16818, 0.27579, 0.16818],
  },
  {
    id: 'diagram-graph',
    fieldLabel: 'Pipeline output',
    value: 'Knowledge Graph',
    page: 4,
    polygon: [0.25723, 0.27019, 0.37797, 0.27019, 0.37797, 0.28143, 0.25723, 0.28143],
  },
  {
    id: 'diagram-community',
    fieldLabel: 'Answer stage',
    value: 'Community Answers',
    page: 4,
    polygon: [0.58389, 0.15566, 0.72406, 0.15566, 0.72406, 0.1669, 0.58389, 0.1669],
  },
  {
    id: 'diagram-answer',
    fieldLabel: 'Final output',
    value: 'Global Answer',
    page: 4,
    polygon: [0.6038, 0.09966, 0.70416, 0.09966, 0.70416, 0.11091, 0.6038, 0.11091],
  },
  {
    id: 'example-company',
    fieldLabel: 'Example company',
    value: 'NeoChip',
    page: 5,
    polygon: [0.23508, 0.09496, 0.29386, 0.09496, 0.29386, 0.10621, 0.23508, 0.10621],
  },
  {
    id: 'example-exchange',
    fieldLabel: 'Example exchange',
    value: 'NewTech Exchange',
    page: 5,
    polygon: [0.66114, 0.45875, 0.79112, 0.45875, 0.79112, 0.47, 0.66114, 0.47],
  },
]
