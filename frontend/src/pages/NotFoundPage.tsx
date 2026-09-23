import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return <div className="page-shell page-top not-found"><strong>404</strong><h1>Wrong end of the pitch.</h1><p>This page does not exist or has moved.</p><Link className="button button-dark" to="/">Return home</Link></div>
}
