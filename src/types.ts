export type Polygon = readonly [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
]

export interface PdfField {
  id: string
  fieldLabel: string
  value: string
  page: number
  polygon: Polygon
}

export interface PdfDocument {
  id: string
  name: string
  fileUrl: string
  pageCount: number
  fields: PdfField[]
}
