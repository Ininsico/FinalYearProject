import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Vision from './components/Vision'
import HeroCarouselShowcase from './components/HeroCarouselShowcase'
import Stats from './components/Stats'
import Testimonials from './components/Testimonials'
import CTA from './components/CTA'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import About from './components/About'
import BackToTop from './components/BackToTop'
import Footer from './components/Footer'

function Landing() {
  return (
    <>
      <Hero />
      <Vision />
      <section className="h-[90vh] min-h-[640px] w-full">
        <HeroCarouselShowcase />
      </section>
      <Stats />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  )
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Landing />} />
      </Routes>
      <Footer />
      <BackToTop />
    </>
  )
}

export default App
