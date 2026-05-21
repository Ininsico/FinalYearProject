import { Header } from './components/common/Header'
import { Footer } from './components/common/Footer'
import { LandingPage } from './pages/LandingPage'

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-text relative flex flex-col font-sans">
      <div className="fixed top-[-20%] left-[-10%] w-[60%] aspect-square rounded-full bg-accent/8 blur-[160px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-cyan/8 blur-[160px] pointer-events-none" />

      <Header />
      <LandingPage />
      <Footer />
    </div>
  )
}
