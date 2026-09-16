import { Component, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/tokens.css";
import "./styles/game.css";
import "./styles/investigation.css";
import "./styles/dialogue.css";
import "./styles/platforms.css";
class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <main className="boot">
        <h1>NOVA</h1>
        <p>화면을 불러오지 못했습니다. 저장 기록은 보존되어 있습니다.</p>
        <button onClick={() => location.reload()}>다시 시도</button>
      </main>
    ) : (
      this.props.children
    );
  }
}
createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
