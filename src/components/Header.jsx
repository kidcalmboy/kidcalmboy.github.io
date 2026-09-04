import { profile } from '../config/profile.js'

function Header() {
  return (
    <header className="site-header">
      <div className="brand" aria-label="KidCalmBoy developer portfolio">
        <span className="brand-mark" aria-hidden="true" />
        <span>{profile.terminalUsername}.DEV</span>
      </div>
      <nav className="header-nav" aria-label="Quick links">
        <span className="nav-link" aria-disabled="true">GitHub</span>
        <span className="nav-link" aria-disabled="true">Blog</span>
        <span className="nav-link" aria-disabled="true">Email</span>
        <button className="theme-button" type="button" aria-label="Theme control coming soon">Theme</button>
      </nav>
    </header>
  )
}

export default Header
