import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-lead"><Link className="brand-logo footer-logo" to="/" aria-label="SPORTBUK home"><img src="/logos/sportbuk.png" alt="SPORTBUK" /></Link><p>Built for the pitch. Pick your kit, pack your bag, play.</p></div>
      <div className="footer-links"><div><strong>Shop</strong><Link to="/products">All gear</Link><Link to="/collections">Collections</Link><Link to="/wishlist">Wishlist</Link></div><div><strong>Support</strong><Link to="/size-guide">Size guide</Link><Link to="/contact">Contact</Link><Link to="/journal">Journal</Link><Link to="/auth">Account</Link></div></div>
      <div className="footer-base"><span>© 2026 SPORTBUK</span><span>Football catalog course project</span></div>
    </footer>
  )
}
