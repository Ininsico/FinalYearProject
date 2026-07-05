export default function CTA() {
  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-planet-600 to-planet-800 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to Start Learning?
        </h2>
        <p className="text-planet-200 text-lg mb-10 max-w-2xl mx-auto">
          Join thousands of Pakistani students who are already learning on TheThirdPlanet.
          No fees. No barriers. Just quality education.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-3.5 bg-white text-planet-700 hover:bg-planet-50 rounded-xl font-semibold text-base transition-all shadow-lg">
            Create Free Account
          </button>
          <button className="px-8 py-3.5 border-2 border-white/30 text-white hover:bg-white/10 rounded-xl font-semibold text-base transition-all">
            Download App
          </button>
        </div>

        <p className="text-planet-300 text-sm mt-6">No credit card required. 100% free access.</p>
      </div>
    </section>
  )
}
