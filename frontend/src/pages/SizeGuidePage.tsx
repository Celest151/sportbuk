import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { ErrorState } from '../components/ui/PageState'
import { useApi } from '../hooks/useApi'

interface SizeChartRow {
  _id: string
  name: string
  chest: string
  waist: string
  hip: string
  height: string
}

type Unit = 'cm' | 'in'
type Measurement = 'chest' | 'waist' | 'hip' | 'height'

function formatMeasurement(value: string, unit: Unit) {
  if (unit === 'cm' || !value || value === '-') return value
  return value.replace(/\d+(?:\.\d+)?/g, (number) => (Number(number) / 2.54).toFixed(1))
}

function SizeTable({ rows, unit, measurements }: { rows: SizeChartRow[]; unit: Unit; measurements: Array<{ key: Measurement; label: string }> }) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ x: number; scrollLeft: number } | null>(null)

  function syncScrollbar() {
    const scroller = scrollerRef.current
    const track = trackRef.current
    const thumb = thumbRef.current
    if (!scroller || !track || !thumb) return
    const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth)
    const thumbWidth = Math.max(48, track.clientWidth * (scroller.clientWidth / scroller.scrollWidth))
    const thumbLeft = maxScroll ? (scroller.scrollLeft / maxScroll) * (track.clientWidth - thumbWidth) : 0
    thumb.style.width = `${thumbWidth}px`
    thumb.style.transform = `translateX(${thumbLeft}px)`
    track.setAttribute('aria-valuemax', String(Math.round(maxScroll)))
    track.setAttribute('aria-valuenow', String(Math.round(scroller.scrollLeft)))
  }

  useEffect(() => {
    const scroller = scrollerRef.current
    const track = trackRef.current
    if (!scroller || !track) return
    const observer = new ResizeObserver(syncScrollbar)
    observer.observe(scroller)
    observer.observe(track)
    if (scroller.firstElementChild) observer.observe(scroller.firstElementChild)
    syncScrollbar()
    return () => observer.disconnect()
  }, [rows])

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!scrollerRef.current) return
    dragRef.current = { x: event.clientX, scrollLeft: scrollerRef.current.scrollLeft }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function dragThumb(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    const scroller = scrollerRef.current
    const track = trackRef.current
    const thumb = thumbRef.current
    if (!drag || !scroller || !track || !thumb) return
    const availableTrack = track.clientWidth - thumb.clientWidth
    const maxScroll = scroller.scrollWidth - scroller.clientWidth
    if (availableTrack > 0) scroller.scrollLeft = drag.scrollLeft + ((event.clientX - drag.x) / availableTrack) * maxScroll
  }

  function jumpOnTrack(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.target === thumbRef.current || !scrollerRef.current) return
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width
    scrollerRef.current.scrollTo({ left: ratio * scrollerRef.current.scrollWidth - scrollerRef.current.clientWidth / 2, behavior: 'smooth' })
  }

  return <div className="size-guide-table-shell"><div className="size-guide-table-wrap" ref={scrollerRef} role="region" aria-label="Horizontally scrollable size chart" tabIndex={0} onScroll={syncScrollbar}><table><thead><tr><th>Size</th>{rows.map((row) => <th key={row._id}>{row.name}</th>)}</tr></thead><tbody>{measurements.map((measurement) => <tr key={measurement.key}><th>{measurement.label} ({unit})</th>{rows.map((row) => <td key={row._id}>{formatMeasurement(row[measurement.key], unit)}</td>)}</tr>)}</tbody></table></div><div className="size-guide-scrollbar" ref={trackRef} role="scrollbar" aria-label="Scroll size chart horizontally" aria-orientation="horizontal" aria-valuemin={0} aria-valuemax={0} aria-valuenow={0} tabIndex={0} onPointerDown={jumpOnTrack} onKeyDown={(event) => { if (event.key === 'ArrowRight') scrollerRef.current?.scrollBy({ left: 120, behavior: 'smooth' }); if (event.key === 'ArrowLeft') scrollerRef.current?.scrollBy({ left: -120, behavior: 'smooth' }) }}><div ref={thumbRef} onPointerDown={startDrag} onPointerMove={dragThumb} onPointerUp={() => { dragRef.current = null }} onPointerCancel={() => { dragRef.current = null }} /></div></div>
}

export function SizeGuidePage() {
  const { data: rows, loading, error } = useApi<SizeChartRow[]>('/sizes/chart')
  const [unit, setUnit] = useState<Unit>('cm')
  const { hash } = useLocation()

  useEffect(() => {
    if (!rows || !hash) return
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash, rows])

  return <main className="page-shell page-top size-guide-page">
    <header className="size-guide-page-head"><div><span>SPORTBUK FIT</span><h1>Men's Size Guide</h1><p>Use body measurements to choose your closest fit. Tall sizes add length without changing waist, chest, or hip range.</p></div><div className="size-guide-unit" aria-label="Measurement unit"><button className={unit === 'in' ? 'active' : ''} type="button" onClick={() => setUnit('in')}>in</button><button className={unit === 'cm' ? 'active' : ''} type="button" onClick={() => setUnit('cm')}>cm</button></div></header>
    {loading && <div className="size-guide-loading">Loading measurements...</div>}
    {error && <ErrorState message={error} />}
    {rows && <div className="size-guide-sections">
      <section id="tops"><div><span>01</span><h2>Men's Tops</h2><p>For jerseys, shirts, training tops, hoodies, and jackets.</p></div><SizeTable rows={rows} unit={unit} measurements={[{ key: 'chest', label: 'Chest' }, { key: 'waist', label: 'Waist' }, { key: 'hip', label: 'Hip' }, { key: 'height', label: 'Height' }]} /></section>
      <section id="bottoms"><div><span>02</span><h2>Men's Bottoms</h2><p>For shorts, trousers, pants, and leggings.</p></div><SizeTable rows={rows} unit={unit} measurements={[{ key: 'waist', label: 'Waist' }, { key: 'hip', label: 'Hip' }, { key: 'height', label: 'Height' }]} /></section>
    </div>}
    <p className="size-guide-note">Measurements are a guide. Product fit can vary slightly by fabric and cut.</p>
  </main>
}
