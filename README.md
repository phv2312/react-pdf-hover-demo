# react-pdf-hover-demo

This is a small React app for learning how to show and work with PDF files.

Move your mouse over a field. The app will open the correct PDF page and show a
colored area around the matching text.

<img width="1200" height="800" alt="Screenshot 2026-09-11 at 21 18 16" src="https://github.com/user-attachments/assets/86d655ad-244f-40ca-b574-fe7d8d42d23b" />

## What you can do

- Select a PDF file from a dropdown
- Go to the next or previous page
- Zoom in and zoom out
- Drag the PDF when it is bigger than the viewer
- Move over a field to highlight its area in the PDF
- Use the app with a mouse, keyboard, or touch screen
- Read the tutorial on the same page

## Run the app

- Install the packages:

```bash
npm install
```

- Start the app:

```bash
npm run dev
```

- Open the local link shown in the terminal. It is usually:

```text
http://localhost:5173
```

## Important files

- `src/types.ts` - types for PDF fields and polygons
- `src/data/fields.ts` - sample fields from GraphRAG.pdf
- `src/data/documents.ts` - list of PDF files shown in the dropdown
- `src/App.tsx` - main app state and page layout
- `src/components/PdfViewer.tsx` - PDF viewer, zoom, drag, and highlight
- `src/utils/polygon.ts` - changes eight polygon numbers into SVG points

## Polygon data

Each field has eight polygon numbers. The numbers make four points:

- Top-left point
- Top-right point
- Bottom-right point
- Bottom-left point

Each number is from `0` to `1`. Because of this, the highlight stays in the correct
place when the PDF size changes.

## Add another PDF

- Copy the PDF file into `public/`
- Create a field list for the new PDF
- Open `src/data/documents.ts`
- Add the PDF name, file path, page count, and field list

The new PDF will appear in the dropdown.
