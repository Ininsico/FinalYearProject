const testimonials = [
  {
    name: 'Ayesha Khan',
    location: 'Lahore, Punjab',
    text: 'TheThirdPlanet completely changed how I study for my exams. The Urdu explanations make complex topics so easy to understand. I scored 92% in my Matric!',
    initials: 'AK',
  },
  {
    name: 'Muhammad Ali',
    location: 'Karachi, Sindh',
    text: 'Free quality education in Pakistan was a dream until I found this platform. The live doubt sessions are a lifesaver. Really grateful for this initiative.',
    initials: 'MA',
  },
  {
    name: 'Fatima Ahmed',
    location: 'Peshawar, KPK',
    text: 'Being from a remote area, access to good teachers was always a problem. Now I learn from the best teachers right from my home. Highly recommend!',
    initials: 'FA',
  },
]

export default function Testimonials() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-planet-900 mb-4">
            What Students Say
          </h2>
          <p className="text-planet-600 text-lg">
            Hear from students across Pakistan who are transforming their education
            with TheThirdPlanet.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-2xl border border-planet-100 bg-white hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-1 text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-planet-700 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-planet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-planet-900 text-sm">{t.name}</p>
                  <p className="text-xs text-planet-500">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
