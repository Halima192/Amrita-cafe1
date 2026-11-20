import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { About } from './components/sections/About'
import { Hero } from './components/sections/Hero'
import { Menu } from './components/sections/Menu'
import { PlayTogether } from './components/sections/PlayTogether'

function App() {
  return (
    <div className="min-h-svh bg-cream text-chocolate">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[80] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-full focus:bg-coffee focus:px-4 focus:py-2 focus:text-cream focus:outline-none focus:ring-2 focus:ring-caramel"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Menu />
        <About />
        <PlayTogether />
      </main>
      <Footer />
    </div>
  )
}

export default App
