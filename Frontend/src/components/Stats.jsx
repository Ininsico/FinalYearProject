const stats = [
  { value: '10,000+', label: 'Active Students' },
  { value: '200+', label: 'Expert Teachers' },
  { value: '50+', label: 'Cities in Pakistan' },
  { value: '500+', label: 'Video Lessons' },
]

export default function Stats() {
  return (
    <section className="py-16 bg-planet-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl sm:text-5xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-planet-300 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
