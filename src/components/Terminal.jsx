import { profile } from '../config/profile.js'

function Terminal() {
  return (
    <section className="terminal-region" aria-label="Interactive portfolio terminal">
      <div className="terminal-window">
        <div className="terminal-bar">
          <div className="window-controls" aria-hidden="true"><span /><span /><span /></div>
          <span className="terminal-title">terminal — portfolio</span>
          <span />
        </div>
        <div className="terminal-body">
          <p className="terminal-kicker">Welcome to {profile.terminalUsername}.DEV</p>
          <p className="terminal-muted">Type 'help' to explore the portfolio.</p>
          <label className="terminal-prompt">
            <span className="prompt-user">{profile.terminalUsername}@portfolio</span>
            <span>:~$</span>
            <input className="terminal-input" type="text" autoComplete="off" spellCheck="false" aria-label="Terminal command" placeholder="help" />
          </label>
        </div>
      </div>
    </section>
  )
}

export default Terminal
