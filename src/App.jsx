import './App.css'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import Terminal from './components/Terminal.jsx'
import ProfilePanel from './components/ProfilePanel.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="workspace">
        <Sidebar />
        <Terminal />
        <ProfilePanel />
      </main>
      <Footer />
    </div>
  )
}

export default App
