import { X } from '@phosphor-icons/react'
import { useEffect, useRef, useState, type PointerEvent } from 'react'

interface ImageCropDialogProps {
  src: string
  filename: string
  onCancel: () => void
  onApply: (file: File) => void
}

interface ImageSize { width: number; height: number }
interface Position { x: number; y: number }

export function ImageCropDialog({ src, filename, onCancel, onApply }: ImageCropDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const dragRef = useRef<{ x: number; y: number; origin: Position } | null>(null)
  const [viewportSize, setViewportSize] = useState(0)
  const [imageSize, setImageSize] = useState<ImageSize | null>(null)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    const viewport = viewportRef.current
    if (!viewport) return () => dialog?.close()
    const observer = new ResizeObserver(() => setViewportSize(viewport.clientWidth))
    observer.observe(viewport)
    return () => { observer.disconnect(); dialog?.close() }
  }, [])

  const baseScale = imageSize && viewportSize ? Math.max(viewportSize / imageSize.width, viewportSize / imageSize.height) : 0
  const scale = baseScale * zoom
  const displayWidth = imageSize ? imageSize.width * scale : 0
  const displayHeight = imageSize ? imageSize.height * scale : 0
  const maxX = Math.max(0, (displayWidth - viewportSize) / 2)
  const maxY = Math.max(0, (displayHeight - viewportSize) / 2)
  const boundedPosition = { x: Math.max(-maxX, Math.min(maxX, position.x)), y: Math.max(-maxY, Math.min(maxY, position.y)) }
  const clampPosition = (next: Position): Position => ({
    x: Math.max(-maxX, Math.min(maxX, next.x)),
    y: Math.max(-maxY, Math.min(maxY, next.y)),
  })

  function moveStart(event: PointerEvent<HTMLDivElement>) {
    if (!imageSize) return
    dragRef.current = { x: event.clientX, y: event.clientY, origin: boundedPosition }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return
    setPosition(clampPosition({
      x: dragRef.current.origin.x + event.clientX - dragRef.current.x,
      y: dragRef.current.origin.y + event.clientY - dragRef.current.y,
    }))
  }

  async function apply() {
    const image = imageRef.current
    if (!image || !imageSize || !viewportSize || processing) return
    setProcessing(true)
    setError('')

    try {
      const cropSize = viewportSize / scale
      const sourceX = Math.max(0, Math.min(imageSize.width - cropSize, (imageSize.width - cropSize) / 2 - boundedPosition.x / scale))
      const sourceY = Math.max(0, Math.min(imageSize.height - cropSize, (imageSize.height - cropSize) / 2 - boundedPosition.y / scale))
      const outputSize = Math.min(1200, Math.max(1, Math.floor(cropSize)))
      const canvas = document.createElement('canvas')
      canvas.width = outputSize
      canvas.height = outputSize
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Image cropping is unavailable in this browser.')
      context.drawImage(image, sourceX, sourceY, cropSize, cropSize, 0, 0, outputSize, outputSize)
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.9))
      if (!blob) throw new Error('Could not create the cropped image.')
      if (blob.size > 5 * 1024 * 1024) throw new Error('Cropped image exceeds the 5 MB upload limit.')
      const baseName = filename.replace(/\.[^.]+$/, '').replace(/[^a-z0-9-]+/gi, '-').slice(0, 60) || 'product-image'
      const extension = blob.type === 'image/webp' ? 'webp' : 'png'
      onApply(new File([blob], `${baseName}-crop.${extension}`, { type: blob.type }))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not crop this image. Upload a local file first.')
      setProcessing(false)
    }
  }

  return <dialog ref={dialogRef} className="admin-crop-dialog" aria-labelledby="crop-dialog-title" onCancel={onCancel}>
    <header><div><h2 id="crop-dialog-title">Crop product image</h2><p>Drag or use arrow keys to position the image inside the square frame.</p></div><button type="button" aria-label="Close crop editor" onClick={onCancel}><X size={21} /></button></header>
    <div className="admin-crop-viewport" ref={viewportRef} tabIndex={0} role="group" aria-label="Crop position. Use arrow keys to move image." onKeyDown={(event) => { const steps: Record<string, Position> = { ArrowLeft: { x: -10, y: 0 }, ArrowRight: { x: 10, y: 0 }, ArrowUp: { x: 0, y: -10 }, ArrowDown: { x: 0, y: 10 } }; const step = steps[event.key]; if (step) { event.preventDefault(); setPosition(clampPosition({ x: boundedPosition.x + step.x, y: boundedPosition.y + step.y })) } }} onPointerDown={moveStart} onPointerMove={move} onPointerUp={() => { dragRef.current = null }} onPointerCancel={() => { dragRef.current = null }}>
      <img ref={imageRef} src={src} crossOrigin="anonymous" alt="Crop preview" draggable={false} style={imageSize && viewportSize ? { width: displayWidth, height: displayHeight, left: `calc(50% + ${boundedPosition.x}px)`, top: `calc(50% + ${boundedPosition.y}px)` } : undefined} onLoad={(event) => setImageSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })} onError={() => setError('Could not load this image. Try selecting a local file first.')} />
    </div>
    <label className="admin-crop-zoom">Zoom <input type="range" min="1" max="3" step="0.05" value={zoom} onChange={(event) => { const nextZoom = Number(event.target.value); const ratio = nextZoom / zoom; setZoom(nextZoom); setPosition({ x: position.x * ratio, y: position.y * ratio }) }} /></label>
    {error && <p className="admin-crop-error" role="alert">{error}</p>}
    <footer><button className="admin-secondary" type="button" onClick={() => { setZoom(1); setPosition({ x: 0, y: 0 }) }}>Reset</button><span /><button className="admin-secondary" type="button" onClick={onCancel}>Cancel</button><button className="admin-primary" type="button" disabled={!imageSize || processing || Boolean(error)} onClick={() => void apply()}>{processing ? 'Cropping...' : 'Use crop'}</button></footer>
  </dialog>
}
