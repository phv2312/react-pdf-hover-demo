const workspaceItems = [
  { short: 'OV', label: 'Overview' },
  { short: 'DC', label: 'Documents' },
  { short: 'FD', label: 'Fields' },
  { short: 'RV', label: 'Review' },
]

export function DummyPanel() {
  return (
    <aside
      className="dummy-panel hidden min-w-0 border border-[#d7d6ce] bg-[#fbfaf5] p-3 lg:block xl:p-5"
      aria-label="Placeholder workspace panel"
    >
      <p className="eyebrow hidden xl:block">Workspace</p>
      <h2 className="mt-0 hidden text-lg font-bold tracking-[-0.03em] xl:block">Project tools</h2>
      <p className="mt-3 hidden text-xs leading-5 text-[#66706b] xl:block">
        Reserved for document navigation, filters, or project-level actions.
      </p>

      <div className="mt-6 grid gap-2" aria-hidden="true">
        {workspaceItems.map((item, index) => (
          <div
            className={`flex items-center justify-center gap-3 border px-2 py-3 text-xs font-semibold xl:justify-start xl:px-3 ${
              index === 1
                ? 'border-[#ff6b35] bg-[#ffddcf] text-[#19201d]'
                : 'border-[#d7d6ce] text-[#66706b]'
            }`}
            key={item.short}
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#132b2c] font-mono text-[9px] text-white">
              {item.short}
            </span>
            <span className="hidden xl:inline">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 hidden border-t border-[#d7d6ce] pt-5 xl:block">
        <span className="font-mono text-[10px] tracking-wider text-[#8a918d] uppercase">
          Placeholder
        </span>
        <div className="mt-3 h-2 rounded-full bg-[#e5e4dc]" />
        <div className="mt-2 h-2 w-3/4 rounded-full bg-[#e5e4dc]" />
      </div>
    </aside>
  )
}
