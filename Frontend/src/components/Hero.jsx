import { useState, useEffect } from 'react'

const images = [
  { src: '/herosection/islamabad.png', city: 'Islamabad' },
  { src: '/herosection/lahore.png', city: 'Lahore' },
  { src: '/herosection/karachi.png', city: 'Karachi' },
  { src: '/herosection/peshawar.png', city: 'Peshawar' },
  { src: '/herosection/balochistan.png', city: 'Balochistan' },
  { src: '/herosection/kashmir.png', city: 'Kashmir' },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {images.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${img.src})`,
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-black/60" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 border border-white/10 rounded-full" />
        <div className="absolute top-40 left-20 w-48 h-48 border border-white/5 rounded-full" />
        <div className="absolute bottom-32 right-10 w-96 h-96 border border-white/10 rounded-full" />
        <div className="absolute bottom-20 right-32 w-52 h-52 border border-white/5 rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-white/20 rotate-45" />
        <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-white/20 rotate-45" />
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white/30 rotate-45" />
      </div>

      <div className="relative text-center px-4 max-w-5xl mx-auto z-10">
        <h1 className="text-5xl sm:text-7xl lg:text-8xl text-white mb-4 tracking-tight font-semibold italic leading-tight">
          The Third Planet
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-white/80 font-light leading-relaxed max-w-3xl mx-auto mb-10">
          "The future of Pakistan is in the hands of the youth,<br />
          and it is they who will build the nation"
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-14">
          <button className="px-8 py-3.5 bg-white text-planet-900 hover:bg-white/90 rounded-xl font-semibold text-base transition-all shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Start Learning Free
          </button>
          <button className="px-8 py-3.5 border-2 border-white/30 text-white hover:bg-white/10 rounded-xl font-semibold text-base transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Explore Courses
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['A', 'M', 'F', 'Z'].map((l, i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                  {l}
                </div>
              ))}
              <div className="w-9 h-9 rounded-full border-2 border-white bg-planet-900 flex items-center justify-center text-white text-xs font-bold">
                +9k
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-0.5 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-white/70 text-xs">Trusted by 10,000+ students</p>
            </div>
          </div>

          <div className="h-8 w-px bg-white/20 hidden sm:block" />

          <div className="flex items-center gap-6 text-white/70 text-sm">
            <div className="text-center">
              <p className="text-white font-bold text-lg">200+</p>
              <p className="text-xs">Expert Teachers</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">50+</p>
              <p className="text-xs">Cities</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">500+</p>
              <p className="text-xs">Video Lessons</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
          <span className="w-16 h-px bg-white/20" />
          <span>{images[current].city}</span>
          <span className="w-16 h-px bg-white/20" />
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
