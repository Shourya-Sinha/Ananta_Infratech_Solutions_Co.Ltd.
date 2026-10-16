import { Component } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, RefreshCw } from 'lucide-react'

/**
 * Catches render errors anywhere below it so a broken section cannot take down
 * the whole site. Shows the visitor a calm, branded recovery screen.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Keep the detail in the console for whoever is debugging, not in the UI.
    console.error('Ananta UI error:', error, info?.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <main className="not-found">
        <p className="eyebrow eyebrow-light"><i />Something went wrong</p>
        <h1>That section<br /><em>did not load.</em></h1>
        <p>
          The rest of the site is fine — this part hit an unexpected error. Reloading usually fixes it.
          If it keeps happening, tell us at support@anantainfratechsolutions.com.
        </p>
        <div className="not-found-actions">
          <button className="button button-acid" onClick={() => window.location.reload()}>
            Reload the page <RefreshCw size={16} />
          </button>
          <Link className="button button-light" to="/">Return home <ArrowUpRight size={16} /></Link>
        </div>
      </main>
    )
  }
}
