import { motion } from 'framer-motion'
import { Code2, ArrowUp } from 'lucide-react'

export function CTASection() {
  return (
    <section id="cta" className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel-accent rounded-3xl p-12 sm:p-16"
          >
            <h2 className="text-3xl sm:text-5xl font-black text-text mb-6 leading-tight">
              Ready to explore the{' '}
              <span className="bg-gradient-to-r from-[#22ff66] to-[#22ff88] bg-clip-text text-transparent">
                future
              </span>
              ?
            </h2>
            <p className="text-muted mb-10 max-w-lg mx-auto leading-relaxed">
              Dive into the full project documentation, explore the source code, and see how
              Erebus is redefining spatial computing.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-accent text-bg font-bold px-8 py-4 rounded-xl text-sm tracking-wider uppercase hover:brightness-110 transition shadow-[0_0_30px_rgba(34,255,102,0.15)]"
              >
                <Code2 className="w-4 h-4" />
                View on GitHub
              </motion.a>
              <motion.a
                href="#hero"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 border border-border text-text font-bold px-8 py-4 rounded-xl text-sm tracking-wider uppercase hover:border-accent/50 hover:text-accent transition"
              >
                <ArrowUp className="w-4 h-4" />
                Back to Top
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
