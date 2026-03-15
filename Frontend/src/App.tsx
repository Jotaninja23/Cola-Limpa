import { useState } from 'react'
import Cronometro from './componentes/cronometro.tsx'
import './App.css'

function App() {
  const [] = useState(0)

  return (
    <>
      <header>
        <h1>Cola Limpa</h1>
        <nav>
          <a href="#">Métodos</a>
          <a href="#">Materiais</a>
          <a href="#">Cronômetro</a>
          <a href="#">Login</a>
        </nav>
      </header>

      <div className='hero'>
        <h2>Estude de forma mais inteligente</h2>
        <p>Aprenda métodos de estudo eficientes para vestibular.</p>
      </div>

      <section >
        <Cronometro/>
      </section>

      <footer>
        <p>Projeto escolar - Desenvolvimento de Sistemas</p>
      </footer>

    </>
  )
}

export default App
