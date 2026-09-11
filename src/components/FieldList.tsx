import type { PdfField } from '../types'

interface FieldListProps {
  fields: PdfField[]
  activeFieldId: string | null
  onActivate: (field: PdfField) => void
  onDeactivate: () => void
}

export function FieldList({
  fields,
  activeFieldId,
  onActivate,
  onDeactivate,
}: FieldListProps) {
  return (
    <section className="field-panel order-2 lg:order-none" aria-labelledby="fields-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Extracted data</p>
          <h2 id="fields-heading">Document fields</h2>
        </div>
        <span className="count-badge">{fields.length}</span>
      </div>

      <p className="panel-intro">
        Hover, focus, or tap a field. The viewer moves to its page and draws the
        normalized polygon.
      </p>

      <div className="field-list">
        {fields.map((field) => {
          const isActive = field.id === activeFieldId

          return (
            <button
              className={`field-card${isActive ? ' is-active' : ''}`}
              key={field.id}
              type="button"
              aria-pressed={isActive}
              onMouseEnter={() => onActivate(field)}
              onMouseLeave={onDeactivate}
              onFocus={() => onActivate(field)}
              onBlur={onDeactivate}
              onClick={() => onActivate(field)}
            >
              <span className="field-card-topline">
                <span className="field-label">{field.fieldLabel}</span>
                <span className="page-pill">Page {field.page}</span>
              </span>
              <strong>{field.value}</strong>
              <code>[{field.polygon.join(', ')}]</code>
            </button>
          )
        })}
      </div>
    </section>
  )
}
