import { profile } from '../config/profile.js'

const quickLinks = [['GitHub', profile.github], ['Blog', profile.blog], ['Email', profile.email]]

function ProfilePanel() {
  return (
    <aside className="profile-panel" aria-label="Profile and status">
      <section className="panel-card">
        <p className="panel-label">Profile</p>
        <div className="profile-avatar" aria-hidden="true">KC</div>
        <h2 className="profile-name">{profile.terminalUsername}</h2>
        <p className="profile-empty">Profile details will appear after configuration.</p>
      </section>
      <section className="panel-card">
        <p className="panel-label">Quick links</p>
        <div className="quick-links">
          {quickLinks.map(([label]) => <span className="quick-link" aria-disabled="true" key={label}>{label}</span>)}
        </div>
      </section>
      <section className="panel-card">
        <p className="panel-label">Status</p>
        <p className="status-row"><span className="status-dot" />Portfolio shell ready</p>
        <p className="status-row">GitHub sync not configured</p>
      </section>
    </aside>
  )
}

export default ProfilePanel
