import { useRef } from 'react'

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80'

export default function HeroBackground({
  baseColor = '#050505',
  imageUrl = DEFAULT_IMAGE,
  imageOpacity = 0.18,
  blur = 2,
}) {
  return (
    <>
      <div className="absolute inset-0 z-0" style={{ backgroundColor: baseColor }}>
        <img
          src={imageUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: imageOpacity,
            filter: `blur(${blur}px)`,
            transform: 'scale(1.05)',
          }}
        />
      </div>

      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: `linear-gradient(to bottom, ${baseColor}, rgba(5,5,5,0.6), ${baseColor})`,
        }}
        aria-hidden="true"
      />
    </>
  )
}
