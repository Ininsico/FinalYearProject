const logos = [
  { name: 'Apple', color: '#a3a3a3' },
  { name: 'Microsoft', color: '#a3a3a3' },
  { name: 'Google', color: '#a3a3a3' },
  { name: 'Amazon', color: '#a3a3a3' },
  { name: 'Meta', color: '#a3a3a3' },
  { name: 'Nvidia', color: '#a3a3a3' },
  { name: 'Tesla', color: '#a3a3a3' },
  { name: 'Netflix', color: '#a3a3a3' },
  { name: 'OpenAI', color: '#a3a3a3' },
  { name: 'Spotify', color: '#a3a3a3' },
  { name: 'Stripe', color: '#a3a3a3' },
  { name: 'Salesforce', color: '#a3a3a3' },
  { name: 'IBM', color: '#a3a3a3' },
  { name: 'Intel', color: '#a3a3a3' },
  { name: 'Adobe', color: '#a3a3a3' },
  { name: 'Shopify', color: '#a3a3a3' },
  { name: 'Slack', color: '#a3a3a3' },
  { name: 'GitHub', color: '#a3a3a3' },
  { name: 'Figma', color: '#a3a3a3' },
  { name: 'Uber', color: '#a3a3a3' },
]

function Wordmark({ name }) {
  return (
    <span
      className="whitespace-nowrap text-2xl font-bold tracking-tight text-white/70 hover:text-white transition-colors"
      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {name}
    </span>
  )
}

export default function Stats() {
  const loop = [...logos, ...logos]
  return (
    <section className="py-16 bg-[#070b1c] overflow-hidden border-y border-white/10">
      <p className="text-center text-slate-400 text-xs uppercase tracking-[0.3em] mb-10">
        Powering teams building on the Fablet swarm
      </p>

      <div className="relative flex overflow-hidden mask-fade-x">
        <div className="flex w-max animate-marquee items-center gap-20 pr-20">
          {loop.map((logo, i) => (
            <Wordmark key={i} name={logo.name} />
          ))}
        </div>
      </div>
    </section>
  )
}
