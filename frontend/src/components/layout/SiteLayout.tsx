import { CheckCircle } from '@phosphor-icons/react'
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useShop } from '../../features/shop/ShopProvider'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { Footer } from './Footer'
import { Header } from './Header'

export function SiteLayout() {
  const { pathname } = useLocation()
  const { notice, clearNotice } = useShop()
  useScrollReveal(pathname)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(clearNotice, 3200)
    return () => window.clearTimeout(timer)
  }, [notice, clearNotice])

  return <><Header /><main><Outlet /></main><Footer />{notice && <button className="toast" type="button" onClick={clearNotice} aria-label={`${notice} Dismiss notification`}><CheckCircle size={22} weight="fill" /><span>{notice}</span></button>}</>
}
