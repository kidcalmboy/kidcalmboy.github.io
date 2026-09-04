const sections = ['Home', 'About', 'Study', 'Projects', 'Skills', 'Certs', 'Contact']

function Sidebar() {
  return (
    <aside className="sidebar">
      <p className="sidebar-label">Explore</p>
      <nav className="sidebar-nav" aria-label="Portfolio sections">
        {sections.map((section) => (
          <button
            className={`sidebar-button${section === 'Home' ? ' active' : ''}`}
            type="button"
            key={section}
            aria-current={section === 'Home' ? 'page' : undefined}
          >
            <span>{section}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
