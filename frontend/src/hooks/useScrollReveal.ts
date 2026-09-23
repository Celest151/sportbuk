import { useLayoutEffect } from 'react'

const revealSelector = [
  '.section-heading',
  '.collection-feature > h2',
  '.campaign-tile',
  '.page-intro',
  '.product-card',
  '.collection-card',
  '.collection-hero',
  '.product-gallery',
  '.product-info',
  '.journal-lead',
  '.journal-grid article',
  '.article-page header',
  '.article-page > img',
  '.article-body',
  '.contact-copy',
  '.form-panel',
  '.auth-image',
  '.auth-panel',
  '.saved-list article',
  '.bag-summary',
  '.account-page > *',
  '.empty-state',
].join(',')

export function useScrollReveal(routeKey: string) {
  useLayoutEffect(() => {
    const main = document.querySelector('main')
    if (!main) return

    main.querySelectorAll<HTMLElement>('.reveal-item').forEach((element) => {
      if (element.matches(revealSelector)) return
      element.classList.remove('reveal-item', 'is-revealed')
      element.style.removeProperty('--reveal-delay')
    })

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-revealed')
        revealObserver.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -9% 0px', threshold: 0.12 })

    function registerRevealItems(root: ParentNode) {
      const elements = root.querySelectorAll<HTMLElement>(revealSelector)
      elements.forEach((element) => {
        if (element.classList.contains('reveal-item')) return
        element.classList.add('reveal-item')
        const productIndex = element.classList.contains('product-card')
          ? Array.from(element.parentElement?.children ?? []).indexOf(element)
          : 0
        const collectionIndex = element.classList.contains('collection-card')
          ? Array.from(element.parentElement?.children ?? []).indexOf(element)
          : 0
        const staggerIndex = Math.max(productIndex, collectionIndex, 0)
        element.style.setProperty('--reveal-delay', `${Math.min(staggerIndex, 5) * 85}ms`)
        if (reducedMotion) element.classList.add('is-revealed')
        else revealObserver.observe(element)
      })
    }

    registerRevealItems(main)
    const contentObserver = new MutationObserver(() => registerRevealItems(main))
    contentObserver.observe(main, { childList: true, subtree: true })

    return () => {
      contentObserver.disconnect()
      revealObserver.disconnect()
      main.querySelectorAll<HTMLElement>('.reveal-item').forEach((element) => {
        element.classList.remove('reveal-item', 'is-revealed')
        element.style.removeProperty('--reveal-delay')
      })
    }
  }, [routeKey])
}
