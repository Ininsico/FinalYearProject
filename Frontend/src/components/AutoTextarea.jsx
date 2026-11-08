import { useLayoutEffect, useRef } from "react"

/**
 * A textarea that grows with its content instead of turning into a scrollbox.
 */
export default function AutoTextarea({ value = "", minRows = 3, className = "", ...props }) {
  const ref = useRef(null)

  const resize = () => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight + el.offsetHeight - el.clientHeight}px`
  }

  useLayoutEffect(() => {
    resize()
  }, [value])

  return (
    <textarea
      ref={ref}
      rows={minRows}
      value={value}
      onInput={resize}
      className={`field resize-none overflow-hidden ${className}`}
      {...props}
    />
  )
}
