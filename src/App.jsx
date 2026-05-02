import Hero from './components/Hero/Hero'
import Crew from './components/Crew/Crew'
import Launch from './components/Launch/Launch'
import Journey from './components/Journey/Journey'
import Return from './components/Return/Return'
import './styles/index.css'

function App() {
  return (
    <main className="artemis-app">
      <Hero />
      <Crew />
      <Launch />
      <Journey />
      <Return />
    </main>
  )
}

export default App
