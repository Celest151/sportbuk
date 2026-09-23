import { ArrowRight, Heart, List, MagnifyingGlass, ShoppingBag, UserCircle, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthProvider'
import { useShop } from '../../features/shop/ShopProvider'

const links = [
  { to: '/products', label: 'Products' },
  { to: '/collections', label: 'Collections' },
  { to: '/journal', label: 'Journal' },
  { to: '/contact', label: 'Contact' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchClosing, setSearchClosing] = useState(false)
  const [query, setQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchCloseTimerRef = useRef<number | null>(null)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { bag, wishlist } = useShop()
  const bagQuantity = bag.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    if (!searchOpen) return
    searchInputRef.current?.focus()
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSearchClosing(true)
        searchCloseTimerRef.current = window.setTimeout(() => {
          setSearchOpen(false)
          setSearchClosing(false)
        }, 260)
      }
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [searchOpen])

  useEffect(() => () => {
    if (searchCloseTimerRef.current) window.clearTimeout(searchCloseTimerRef.current)
  }, [])

  function openSearch() {
    if (searchCloseTimerRef.current) window.clearTimeout(searchCloseTimerRef.current)
    setSearchClosing(false)
    setSearchOpen(true)
  }

  function closeSearch() {
    if (!searchOpen || searchClosing) return
    setSearchClosing(true)
    searchCloseTimerRef.current = window.setTimeout(() => {
      setSearchOpen(false)
      setSearchClosing(false)
    }, 260)
  }

  function submitSearch(event: React.FormEvent) {
    event.preventDefault()
    if (query.trim()) navigate(`/products?search=${encodeURIComponent(query.trim())}`)
    closeSearch()
  }

  return (
    <>
      <div className="utility-bar" aria-label="Utility navigation">
        <Link to="/contact">Find a Store</Link>
        <Link to="/contact">Help</Link>
        {user ? (
          <Link to="/account">Account</Link>
        ) : (
          <>
            <Link to="/auth?mode=register">Join Us</Link>
            <Link to="/auth">Sign In</Link>
          </>
        )}
      </div>
      <header className="site-header">
        <button className="icon-button mobile-only" type="button" aria-label="Open menu" onClick={() => setMenuOpen(true)}><List size={24} /></button>
        <Link className="brand-logo" to="/" aria-label="SPORTBUK home"><img src="/logos/sportbuk.png" alt="SPORTBUK" /></Link>
        <nav className={menuOpen ? 'primary-nav is-open' : 'primary-nav'} aria-label="Primary navigation">
          <button className="icon-button mobile-menu-close" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={24} /></button>
          {links.map((link) => <NavLink key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>{link.label}</NavLink>)}
        </nav>
        <div className="header-actions">
          <button className="icon-button search-trigger" type="button" aria-label={searchOpen ? 'Close search' : 'Open search'} aria-expanded={searchOpen && !searchClosing} aria-controls="site-search-panel" onClick={searchOpen ? closeSearch : openSearch}>{searchOpen ? <X size={22} /> : <MagnifyingGlass size={22} />}</button>
          <Link className="icon-button desktop-action" to="/wishlist" aria-label={`Wishlist with ${wishlist.length} items`}><Heart size={22} />{wishlist.length > 0 && <span>{wishlist.length}</span>}</Link>
          <Link className="icon-button desktop-action" to={user ? '/account' : '/auth'} aria-label="Account"><UserCircle size={23} /></Link>
          <Link className="icon-button" to="/bag" aria-label={`Training bag with ${bagQuantity} items`}><ShoppingBag size={22} />{bagQuantity > 0 && <span>{bagQuantity}</span>}</Link>
        </div>
        {searchOpen && (
          <div className={searchClosing ? 'search-overlay is-closing' : 'search-overlay'} id="site-search-panel" role="dialog" aria-modal="true" aria-label="Product search" onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeSearch()
          }}>
            <div className="search-panel">
              <form className="search-form page-shell" onSubmit={submitSearch}>
                <label htmlFor="site-search">What are you looking for?</label>
                <div className="search-field">
                  <MagnifyingGlass size={28} aria-hidden="true" />
                  <input ref={searchInputRef} id="site-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search shirts, gloves, balls" autoComplete="off" />
                  {query && <button className="search-clear" type="button" onClick={() => { setQuery(''); searchInputRef.current?.focus() }}>Clear</button>}
                  <button className="search-submit" type="submit" aria-label="Search products" disabled={!query.trim()}><ArrowRight size={22} weight="bold" /></button>
                </div>
                <div className="search-shortcuts">
                  <span>Popular searches</span>
                  {['Match shirts', 'Goalkeeper gloves', 'Training tops', 'Football'].map((term) => (
                    <Link to={`/products?search=${encodeURIComponent(term)}`} onClick={closeSearch} key={term}>{term}<ArrowRight size={14} /></Link>
                  ))}
                </div>
              </form>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
