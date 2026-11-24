import { useEffect, useRef } from "react"

// JS-driven infinite marquee. A CSS keyframe marquee dies under OS/browser
// "reduce motion" and OperaGX animation savers, so the loop is driven here with
// requestAnimationFrame instead: the track holds two identical halves and each
// frame shifts it by (half width / duration) px, wrapping at exactly one half
// width, so the loop is seamless in every browser. Pauses when off-screen or
// when the tab is hidden. Decorative: hidden from assistive tech.
export default function Ticker({
  items,
  children,
  duration = 32,
  reverse = false,
  offset = 0,
  halfClassName = "items-center",
  itemClassName = "",
  separatorClassName = "mx-[0.9em] h-[0.24em] w-[0.24em]",
  className = "",
}) {
  const trackRef = useRef(null)
  const halfRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    const half = halfRef.current
    if (!track || !half) return

    let raf = 0
    let x = 0
    let last = 0
    let width = half.offsetWidth || 1
    let visible = true

    const draw = () => {
      track.style.transform = reverse
        ? `translate3d(${x - width}px,0,0)`
        : `translate3d(${-x}px,0,0)`
    }
    draw()

    const step = (now) => {
      const dt = Math.min((now - last) / 1000 || 0, 0.05)
      last = now
      x = (x + (width / duration) * dt) % width
      draw()
      raf = requestAnimationFrame(step)
    }

    const start = () => {
      if (raf || !visible || document.hidden) return
      last = performance.now()
      raf = requestAnimationFrame(step)
    }
    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    const resizeObserver = new ResizeObserver(() => {
      width = half.offsetWidth || 1
      draw()
    })
    resizeObserver.observe(half)

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    intersectionObserver.observe(track)

    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }
    document.addEventListener("visibilitychange", onVisibility)

    start()

    return () => {
      stop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [duration, reverse])

  const sequence = offset && items ? [...items.slice(offset), ...items.slice(0, offset)] : items

  const content = children ?? (
    <>
      {sequence.map((it, i) => (
        <span key={i} className={`inline-flex items-center whitespace-nowrap ${itemClassName}`}>
          {it}
          <span
            className={`inline-block shrink-0 rotate-45 bg-accent ${separatorClassName}`}
            aria-hidden="true"
          />
        </span>
      ))}
    </>
  )

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div ref={trackRef} className="flex w-max will-change-transform">
        <div ref={halfRef} className={`flex shrink-0 ${halfClassName}`}>
          {content}
        </div>
        <div className={`flex shrink-0 ${halfClassName}`}>{content}</div>
      </div>
    </div>
  )
}
