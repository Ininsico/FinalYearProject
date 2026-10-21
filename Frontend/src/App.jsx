import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import HowItWorks from "./components/HowItWorks"
import Domains from "./components/Domains"
import Team from "./components/Team"
import FAQ from "./components/FAQ"
import CTA from "./components/CTA"
import About from "./components/About"
import Contact from "./components/Contact"
import BackToTop from "./components/BackToTop"
import Footer from "./components/Footer"

function Landing() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Domains />
      <Team />
      <FAQ />
      <CTA />
    </>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
