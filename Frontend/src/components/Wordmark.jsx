export default function Wordmark({ className = "", tone = "dark" }) {
  return (
    <span className={`inline-flex select-none items-center gap-2.5 ${className}`}>
      <img
        src="/fablet-logo.png"
        alt=""
        aria-hidden="true"
        draggable="false"
        className="h-[26px] w-auto shrink-0"
      />
      <span className={`display text-[1.55rem] leading-none ${tone === "light" ? "text-paper" : "text-ink-950"}`}>
        Fablet
      </span>
    </span>
  )
}
