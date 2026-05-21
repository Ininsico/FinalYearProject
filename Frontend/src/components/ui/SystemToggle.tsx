interface SystemToggleProps {
  checked: boolean
  onChange: () => void
  disabled: boolean
}

export function SystemToggle({ checked, onChange, disabled }: SystemToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-5 w-10 flex-shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer ${checked ? 'bg-cyan' : 'bg-faint border border-border'}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full transition-transform duration-300 ${checked ? 'translate-x-[22px] bg-[var(--color-bg)]' : 'translate-x-[3px] bg-muted'}`}
      />
    </button>
  )
}
