import { useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedGradient from './AnimatedGradient'
import { Mail, MessageSquare, Send } from 'lucide-react'

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
}

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <section className="relative min-h-screen pt-32 pb-24 overflow-hidden">
      <AnimatedGradient
        config={{
          preset: 'custom',
          color1: '#050816',
          color2: '#0b1530',
          color3: '#22d3ee',
          shape: 'Edge',
          shapeSize: 40,
          proportion: 70,
          scale: 0.5,
          speed: 16,
          distortion: 30,
          swirl: 70,
          softness: 90,
        }}
      />
      <div className="absolute inset-0 bg-[#070b1c]/70" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-md tracking-wider mb-6">
            GET IN TOUCH
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight">
            Let's build something.
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Tell us what you want to create with the Fablet swarm — or just say hello.
          </p>
        </motion.div>

        <motion.form
          initial="hidden"
          animate="show"
          transition={{ duration: 0.6, delay: 0.15 }}
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
          }}
          className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-8 space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={update('name')}
                placeholder="Ada Lovelace"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-blue-400/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={update('email')}
                placeholder="you@company.com"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-blue-400/60 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Message</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={update('message')}
              placeholder="I want to build a..."
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-blue-400/60 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
          >
            <Send className="w-4 h-4" />
            Send message
          </button>

          {sent && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-emerald-400"
            >
              <MessageSquare className="w-4 h-4" />
              Thanks, {form.name || 'friend'} — we'll get back to you shortly.
            </motion.p>
          )}
        </motion.form>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-400">
          <Mail className="w-4 h-4" />
          hello@fablet.ai
        </div>
      </div>
    </section>
  )
}
