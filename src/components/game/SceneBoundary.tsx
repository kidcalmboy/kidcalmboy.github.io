import { Component } from 'react'
import type { ReactNode } from 'react'

export default class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <div role="alert" className="scene-message">3D 환경을 불러오지 못했습니다. 브라우저 그래픽 가속을 확인해주세요.</div>
    return this.props.children
  }
}
