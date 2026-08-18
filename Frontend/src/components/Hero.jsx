export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <img
        src="/svg.png"
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchpriority="high"
        className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative text-center px-4 max-w-5xl mx-auto z-10">
        <h1 className="text-5xl sm:text-7xl lg:text-8xl text-white mb-4 tracking-tight font-semibold italic leading-tight">
          Dimitri
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-white/80 font-light leading-relaxed max-w-3xl mx-auto mb-10">
          "The future of Pakistan is in the hands of the youth,<br />
          and it is they who will build the nation"
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-3.5 bg-white text-planet-900 hover:bg-white/90 rounded-xl font-semibold text-base transition-all shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Start Learning Free
          </button>
          <button className="px-8 py-3.5 border-2 border-white/30 text-white hover:bg-white/10 rounded-xl font-semibold text-base transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Explore Courses
          </button>
        </div>
      </div>
    </section>
  )
}
