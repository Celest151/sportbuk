import { ArrowDown, ArrowUp, CaretDown, CaretUp, ImageSquare, PencilSimple, Plus, Trash, X } from '@phosphor-icons/react'
import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '../../features/auth/AuthProvider'
import { apiRequest, resolveImageUrl } from '../../lib/api'
import { formatPrice } from '../../lib/format'
import type { Product, ProductGalleryImage } from '../../types'
import { AdminEmpty, AdminError, AdminPage, Status } from './AdminDashboardPage'

interface AdminCategory { _id: string; name: string; description?: string; image?: string | null; isActive: boolean; displayOrder: number; parent?: { _id: string; name: string } | string | null }
interface AdminCollection { _id: string; name: string; description: string; image?: string | null; productIds: string[]; productCount: number; isActive: boolean; isFeatured: boolean; displayOrder: number }
interface AdminSize { _id: string; name: string; code: string; usSize: string; euSize: string; height: string; weight: string; chest: string; waist: string; hip: string; fitNote: string; isActive: boolean }

function useAdminList<T>(path: string) {
  const { token } = useAuth()
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  async function load() {
    if (!token) return
    setLoading(true); setError('')
    try { setItems((await apiRequest<{ data: T[] }>(path, {}, token)).data) }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not load data.') }
    finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [path, token]) // eslint-disable-line react-hooks/exhaustive-deps
  return { items, loading, error, setError, load }
}

function Actions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return <div className="admin-row-actions"><button type="button" aria-label="Edit" title="Edit" onClick={onEdit}><PencilSimple size={18} /></button><button className="danger" type="button" aria-label="Delete" title="Delete" onClick={onDelete}><Trash size={18} /></button></div>
}

function Drawer({ title, close, children }: { title: string; close: () => void; children: React.ReactNode }) {
  return <><button className="admin-drawer-backdrop" type="button" aria-label="Close form" onClick={close} /><aside className="admin-drawer"><header><h2>{title}</h2><button type="button" aria-label="Close form" onClick={close}><X size={22} /></button></header>{children}</aside></>
}

const PRODUCT_SIZES = ['XXS', 'XS', 'S', 'S Tall', 'M', 'M Tall', 'L', 'L Tall', 'XL', 'XL Tall', 'XXL', 'XXL Tall', '3XL', '3XL Tall', '4XL', '4XL Tall', 'One Size']
let editorRowId = 0
const nextRowId = () => `editor-row-${editorRowId += 1}`

interface GalleryDraft extends Omit<ProductGalleryImage, 'url'> {
  id: string
  existingUrl: string
  file: File | null
  previewUrl: string
}

interface SizeVariantDraft {
  id: string
  size: string
  price: number
  stock: number
  sku: string | null
  originalKey: string
}

interface ColorVariantDraft {
  id: string
  name: string
  code: string
  sizes: SizeVariantDraft[]
}

function createGalleryDraft(image?: ProductGalleryImage): GalleryDraft {
  return { id: nextRowId(), existingUrl: image?.url || '', file: null, previewUrl: image?.url || '', color: image?.color || null, alt: image?.alt || '', isPrimary: image?.isPrimary ?? true }
}

function createSizeVariantDraft(variant?: NonNullable<Product['variants']>[number]): SizeVariantDraft {
  const size = variant?.size || 'M'
  return { id: nextRowId(), size, price: variant?.price ?? 0, stock: variant?.stock ?? 0, sku: variant?.sku || null, originalKey: variant ? `${variant.color}__${size}` : '' }
}

function createColorGroups(product: Product | null): ColorVariantDraft[] {
  if (!product?.variants?.length) return [{ id: nextRowId(), name: 'Default', code: '#111111', sizes: [createSizeVariantDraft()] }]
  const groups = new Map<string, ColorVariantDraft>()
  product.variants.forEach((variant) => {
    const existing = groups.get(variant.color)
    if (existing) existing.sizes.push(createSizeVariantDraft(variant))
    else groups.set(variant.color, { id: nextRowId(), name: variant.color, code: variant.colorCode || '#111111', sizes: [createSizeVariantDraft(variant)] })
  })
  return Array.from(groups.values())
}

function NumberStepper({ value, label, onChange, name, max }: { value: number; label: string; onChange: (value: number) => void; name?: string; max?: number }) {
  const clamp = (nextValue: number) => Math.min(max ?? Number.POSITIVE_INFINITY, Math.max(0, nextValue))
  return <div className="admin-number-stepper"><input aria-label={label} name={name} type="number" min="0" max={max} value={value} required onChange={(event) => onChange(clamp(Number(event.target.value)))} /><span><button type="button" aria-label={`Increase ${label}`} disabled={max !== undefined && value >= max} onClick={() => onChange(clamp(value + 1))}><CaretUp size={12} weight="bold" /></button><button type="button" aria-label={`Decrease ${label}`} disabled={value <= 0} onClick={() => onChange(clamp(value - 1))}><CaretDown size={12} weight="bold" /></button></span></div>
}

function ProductEditor({ product, categories, saving, onSave }: { product: Product | null; categories: AdminCategory[]; saving: boolean; onSave: (data: FormData) => Promise<void> }) {
  const existingImages = product?.images?.length ? product.images : product?.image ? [{ url: product.image, color: null, alt: product.name, isPrimary: true }] : []
  const [gallery, setGallery] = useState<GalleryDraft[]>(existingImages.length ? existingImages.map(createGalleryDraft) : [createGalleryDraft()])
  const [colorGroups, setColorGroups] = useState<ColorVariantDraft[]>(() => createColorGroups(product))
  const [discount, setDiscount] = useState(product?.discount ?? 0)
  const [formError, setFormError] = useState('')

  function updateGallery(id: string, patch: Partial<GalleryDraft>) {
    setGallery((rows) => rows.map((row) => row.id === id ? { ...row, ...patch } : row))
  }

  function chooseFile(id: string, file: File | null) {
    if (!file) return updateGallery(id, { file: null, previewUrl: gallery.find((row) => row.id === id)?.existingUrl || '' })
    const reader = new FileReader()
    reader.onload = () => updateGallery(id, { file, previewUrl: String(reader.result || '') })
    reader.readAsDataURL(file)
  }

  function removeGallery(id: string) {
    setGallery((rows) => {
      const next = rows.filter((row) => row.id !== id)
      if (next.length && !next.some((row) => row.isPrimary)) next[0] = { ...next[0], isPrimary: true }
      return next
    })
  }

  function moveGallery(index: number, offset: number) {
    setGallery((rows) => {
      const next = [...rows]
      const target = index + offset
      if (target < 0 || target >= next.length) return rows
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function updateColorGroup(id: string, patch: Partial<Pick<ColorVariantDraft, 'name' | 'code'>>) {
    const previousName = colorGroups.find((group) => group.id === id)?.name
    setColorGroups((groups) => groups.map((group) => group.id === id ? { ...group, ...patch } : group))
    if (patch.name !== undefined && previousName) {
      setGallery((rows) => rows.map((row) => row.color === previousName ? { ...row, color: patch.name || null } : row))
    }
  }

  function updateSizeVariant(colorId: string, sizeId: string, patch: Partial<SizeVariantDraft>) {
    setColorGroups((groups) => groups.map((group) => group.id === colorId ? { ...group, sizes: group.sizes.map((row) => row.id === sizeId ? { ...row, ...patch } : row) } : group))
  }

  function addSizeVariant(colorId: string) {
    setColorGroups((groups) => groups.map((group) => {
      if (group.id !== colorId) return group
      const nextSize = PRODUCT_SIZES.find((size) => !group.sizes.some((row) => row.size === size))
      if (!nextSize) return group
      const reference = group.sizes[0]
      return { ...group, sizes: [...group.sizes, { ...createSizeVariantDraft(), size: nextSize, price: reference?.price ?? 0 }] }
    }))
  }

  function removeColorGroup(id: string) {
    const removedName = colorGroups.find((group) => group.id === id)?.name
    setColorGroups((groups) => groups.filter((group) => group.id !== id))
    if (removedName) setGallery((rows) => rows.map((row) => row.color === removedName ? { ...row, color: null } : row))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    const data = new FormData(event.currentTarget)
    const imageRows = gallery.filter((row) => row.file || row.existingUrl)
    if (!imageRows.length) return setFormError('Add at least one product image.')
    if (!colorGroups.length || colorGroups.some((group) => !group.name.trim() || !group.sizes.length)) return setFormError('Each color requires a name and at least one size.')
    const colorNames = colorGroups.map((group) => group.name.trim().toLowerCase())
    if (new Set(colorNames).size !== colorNames.length) return setFormError('Each color name must be unique.')
    const variants = colorGroups.flatMap((group) => group.sizes.map((row) => ({ ...row, color: group.name.trim(), colorCode: group.code })))
    const variantKeys = variants.map((row) => `${row.color.toLowerCase()}__${row.size}`)
    if (new Set(variantKeys).size !== variantKeys.length) return setFormError('Each color and size combination must be unique.')

    let uploadIndex = 0
    const galleryEntries = imageRows.map((row) => {
      const entry: { url?: string; uploadIndex?: number; color: string | null; alt: string; isPrimary: boolean } = { color: row.color?.trim() || null, alt: row.alt.trim() || String(data.get('name') || ''), isPrimary: row.isPrimary }
      if (row.file) {
        data.append('galleryImages', row.file)
        entry.uploadIndex = uploadIndex
        uploadIndex += 1
      } else entry.url = row.existingUrl
      return entry
    })
    if (!galleryEntries.some((entry) => entry.isPrimary)) galleryEntries[0].isPrimary = true

    data.set('galleryEntries', JSON.stringify(galleryEntries))
    data.set('variants', JSON.stringify(variants.map((row) => ({ color: row.color, colorCode: row.colorCode, size: row.size, price: Number(row.price), stock: Number(row.stock), sku: row.originalKey === `${row.color}__${row.size}` ? row.sku : null }))))
    data.set('isActive', String(data.has('isActive')))
    data.set('isFeatured', String(data.has('isFeatured')))
    try {
      await onSave(data)
    } catch (reason) {
      setFormError(reason instanceof Error ? reason.message : 'Could not save product.')
    }
  }

  return <form className="admin-form" onSubmit={(event) => void submit(event)}>
    {formError && <AdminError message={formError} />}
    <label>Name<input name="name" defaultValue={product?.name} required /></label>
    <label>Description<textarea name="description" defaultValue={product?.description} rows={4} required /></label>
    <label>Category<select name="category" defaultValue={typeof product?.category === 'object' ? product.category?._id : product?.category || ''} required><option value="">Select category</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select></label>
    <div className="admin-form-grid"><label>Size guide<select name="sizeGuideType" defaultValue={product?.sizeGuideType || 'none'}><option value="tops">Men's tops</option><option value="bottoms">Men's bottoms</option><option value="none">No apparel guide</option></select></label><label>Discount %<NumberStepper name="discount" label="Discount percentage" value={discount} max={100} onChange={setDiscount} /></label></div>

    <fieldset className="admin-builder"><legend>Colors and sizes</legend><p>Create each color once, then add its available sizes, prices, and stock.</p>
      <div className="admin-color-builder">{colorGroups.map((group, groupIndex) => <article className="admin-color-group" key={group.id}>
        <header><span className="admin-color-index">Color {groupIndex + 1}</span><div className="admin-color-fields"><label>Color name<input value={group.name} required onChange={(event) => updateColorGroup(group.id, { name: event.target.value })} /></label><label>Swatch<input type="color" value={group.code} onChange={(event) => updateColorGroup(group.id, { code: event.target.value })} /></label></div><button className="admin-icon-danger" type="button" aria-label={`Remove ${group.name || 'color'}`} disabled={colorGroups.length === 1} onClick={() => removeColorGroup(group.id)}><Trash size={17} /></button></header>
        <div className="admin-size-heading"><span>Size</span><span>Price</span><span>Stock</span><span>SKU</span><span /></div>
        <div className="admin-size-rows">{group.sizes.map((row) => <div className="admin-size-row" key={row.id}><label><span>Size</span><select aria-label={`${group.name} size`} value={row.size} onChange={(event) => updateSizeVariant(group.id, row.id, { size: event.target.value })}>{PRODUCT_SIZES.map((size) => <option disabled={group.sizes.some((item) => item.id !== row.id && item.size === size)} key={size}>{size}</option>)}</select></label><label><span>Price</span><NumberStepper label={`${group.name} ${row.size} price`} value={row.price} onChange={(price) => updateSizeVariant(group.id, row.id, { price })} /></label><label><span>Stock</span><NumberStepper label={`${group.name} ${row.size} stock`} value={row.stock} onChange={(stock) => updateSizeVariant(group.id, row.id, { stock })} /></label><label className="admin-size-sku"><span>SKU</span><input aria-label={`${group.name} ${row.size} SKU`} value={row.sku || 'Generated on save'} readOnly /></label><button className="admin-icon-danger" type="button" aria-label={`Remove size ${row.size}`} disabled={group.sizes.length === 1} onClick={() => setColorGroups((groups) => groups.map((item) => item.id === group.id ? { ...item, sizes: item.sizes.filter((size) => size.id !== row.id) } : item))}><Trash size={17} /></button></div>)}</div>
        <button className="admin-secondary" type="button" disabled={group.sizes.length === PRODUCT_SIZES.length} onClick={() => addSizeVariant(group.id)}><Plus size={16} /> Add size</button>
      </article>)}</div>
      <button className="admin-secondary" type="button" onClick={() => setColorGroups((groups) => [...groups, { id: nextRowId(), name: '', code: '#111111', sizes: [createSizeVariantDraft()] }])}><Plus size={16} /> Add color</button>
    </fieldset>

    <fieldset className="admin-builder"><legend>Preview images</legend><p>Choose which color each image belongs to, or keep it shared across every color.</p>
      <div className="admin-gallery-builder">{gallery.map((row, index) => <article className="admin-gallery-row" key={row.id}>
        <div className="admin-gallery-preview">{row.previewUrl ? <img src={row.previewUrl.startsWith('data:') ? row.previewUrl : resolveImageUrl(row.previewUrl)} alt="" /> : <ImageSquare size={26} />}</div>
        <div className="admin-gallery-fields"><label>Image<input type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={(event) => chooseFile(row.id, event.target.files?.[0] || null)} /></label><div className="admin-form-grid"><label>Show for<select value={row.color || ''} onChange={(event) => updateGallery(row.id, { color: event.target.value || null })}><option value="">All colors</option>{colorGroups.filter((group) => group.name.trim()).map((group) => <option key={group.id} value={group.name}>{group.name}</option>)}</select></label><label>Alt text<input value={row.alt} placeholder={product?.name || 'Product view'} onChange={(event) => updateGallery(row.id, { alt: event.target.value })} /></label></div><label className="admin-checkbox"><input type="radio" name="primaryGallery" checked={row.isPrimary} onChange={() => setGallery((rows) => rows.map((item) => ({ ...item, isPrimary: item.id === row.id })))} /> Primary image</label></div>
        <div className="admin-builder-actions"><button type="button" aria-label="Move image up" disabled={index === 0} onClick={() => moveGallery(index, -1)}><ArrowUp size={17} /></button><button type="button" aria-label="Move image down" disabled={index === gallery.length - 1} onClick={() => moveGallery(index, 1)}><ArrowDown size={17} /></button><button className="danger" type="button" aria-label="Remove image" onClick={() => removeGallery(row.id)}><Trash size={17} /></button></div>
      </article>)}</div>
      <button className="admin-secondary" type="button" disabled={gallery.length >= 20} onClick={() => setGallery((rows) => [...rows, createGalleryDraft()])}><Plus size={16} /> Add image</button>
    </fieldset>

    <div className="admin-checks"><label><input name="isActive" type="checkbox" value="true" defaultChecked={product?.isActive !== false} /> Active</label><label><input name="isFeatured" type="checkbox" value="true" defaultChecked={product?.isFeatured} /> Featured</label></div>
    <button className="admin-primary" disabled={saving}>{saving ? 'Saving...' : 'Save product'}</button>
  </form>
}

export function AdminProductsPage() {
  const { token } = useAuth()
  const { items, loading, error, setError, load } = useAdminList<Product>('/products?limit=1000')
  const categories = useAdminList<AdminCategory>('/categories')
  const [editing, setEditing] = useState<Product | null | undefined>(undefined)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const shown = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))

  async function save(raw: FormData) {
    if (!token) return
    setSaving(true); setError('')
    try { await apiRequest(editing ? `/products/${editing._id}` : '/products', { method: editing ? 'PUT' : 'POST', body: raw }, token); setEditing(undefined); await load() }
    finally { setSaving(false) }
  }

  async function remove(id: string) { if (!token || !confirm('Delete this product?')) return; try { await apiRequest(`/products/${id}`, { method: 'DELETE' }, token); await load() } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not delete product.') } }
  return <AdminPage title="Products" description="Manage catalog, pricing, stock, and availability." action={<button className="admin-primary" type="button" onClick={() => setEditing(null)}><Plus size={18} /> Add product</button>}>
    <div className="admin-toolbar"><input aria-label="Search products" placeholder="Search products" value={search} onChange={(event) => setSearch(event.target.value)} /><span>{shown.length} products</span></div>{error && <AdminError message={error} />}
    <section className="admin-panel"><div className="admin-table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th /></tr></thead><tbody>{shown.map((product) => <tr key={product._id}><td><div className="admin-product-cell"><img src={resolveImageUrl(product.image, product.slug)} alt="" /><strong>{product.name}</strong></div></td><td>{typeof product.category === 'object' ? product.category?.name : '-'}</td><td>{formatPrice(product.finalPrice || product.price)}</td><td>{product.stock}</td><td><Status value={(product as Product & { isActive?: boolean }).isActive !== false} /></td><td><Actions onEdit={() => setEditing(product)} onDelete={() => void remove(product._id)} /></td></tr>)}</tbody></table></div>{!loading && !shown.length && <AdminEmpty message="No products found." />}</section>
    {editing !== undefined && <Drawer title={editing ? 'Edit product' : 'New product'} close={() => setEditing(undefined)}><ProductEditor key={editing?._id || 'new'} product={editing} categories={categories.items} saving={saving} onSave={save} /></Drawer>}
  </AdminPage>
}

export function AdminCategoriesPage() {
  const { token } = useAuth(); const state = useAdminList<AdminCategory>('/categories'); const [editing, setEditing] = useState<AdminCategory | null | undefined>(undefined); const [saving, setSaving] = useState(false)
  async function save(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!token) return; setSaving(true); const data = new FormData(event.currentTarget); data.set('isActive', String(data.has('isActive'))); const image = data.get('image') as File; if (!image?.size) data.delete('image'); try { await apiRequest(editing ? `/categories/${editing._id}` : '/categories', { method: editing ? 'PUT' : 'POST', body: data }, token); setEditing(undefined); await state.load() } catch (reason) { state.setError(reason instanceof Error ? reason.message : 'Could not save category.') } finally { setSaving(false) } }
  async function remove(id: string) { if (!token || !confirm('Delete this category?')) return; try { await apiRequest(`/categories/${id}`, { method: 'DELETE' }, token); await state.load() } catch (reason) { state.setError(reason instanceof Error ? reason.message : 'Could not delete category.') } }
  return <AdminPage title="Categories" description="Organize products into customer-facing groups." action={<button className="admin-primary" onClick={() => setEditing(null)}><Plus size={18} /> Add category</button>}>{state.error && <AdminError message={state.error} />}<section className="admin-panel"><div className="admin-table-wrap"><table><thead><tr><th>Name</th><th>Parent</th><th>Description</th><th>Order</th><th>Status</th><th /></tr></thead><tbody>{state.items.map((item) => <tr key={item._id}><td><strong>{item.name}</strong></td><td>{typeof item.parent === 'object' ? item.parent?.name : '-'}</td><td>{item.description || '-'}</td><td>{item.displayOrder}</td><td><Status value={item.isActive} /></td><td><Actions onEdit={() => setEditing(item)} onDelete={() => void remove(item._id)} /></td></tr>)}</tbody></table></div>{!state.loading && !state.items.length && <AdminEmpty message="No categories yet." />}</section>{editing !== undefined && <Drawer title={editing ? 'Edit category' : 'New category'} close={() => setEditing(undefined)}><form className="admin-form" onSubmit={save}><label>Name<input name="name" defaultValue={editing?.name} required /></label><label>Parent category<select name="parent" defaultValue={typeof editing?.parent === 'object' ? editing.parent?._id : editing?.parent || ''}><option value="">No parent</option>{state.items.filter((category) => category._id !== editing?._id).map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select></label><label>Description<textarea name="description" defaultValue={editing?.description} rows={4} /></label><label>Display order<input name="displayOrder" type="number" defaultValue={editing?.displayOrder || 0} /></label>{editing?.image && <img className="admin-current-image" src={resolveImageUrl(editing.image)} alt="Current category" />}<label>Image<input name="image" type="file" accept="image/jpeg,image/png,image/gif,image/webp" /></label><label className="admin-checkbox"><input name="isActive" type="checkbox" value="true" defaultChecked={editing?.isActive !== false} /> Active</label><button className="admin-primary" disabled={saving}>{saving ? 'Saving...' : 'Save category'}</button></form></Drawer>}</AdminPage>
}

export function AdminCollectionsPage() {
  const { token } = useAuth(); const state = useAdminList<AdminCollection>('/collections'); const products = useAdminList<Product>('/products?limit=1000'); const [editing, setEditing] = useState<AdminCollection | null | undefined>(undefined); const [saving, setSaving] = useState(false)
  async function save(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!token) return; setSaving(true); const data = new FormData(event.currentTarget); data.set('productIds', JSON.stringify(data.getAll('productIds'))); data.set('isActive', String(data.has('isActive'))); data.set('isFeatured', String(data.has('isFeatured'))); const image = data.get('image') as File; if (!image?.size) data.delete('image'); try { await apiRequest(editing ? `/collections/${editing._id}` : '/collections', { method: editing ? 'PUT' : 'POST', body: data }, token); setEditing(undefined); await state.load() } catch (reason) { state.setError(reason instanceof Error ? reason.message : 'Could not save collection.') } finally { setSaving(false) } }
  async function remove(id: string) { if (!token || !confirm('Delete this collection?')) return; try { await apiRequest(`/collections/${id}`, { method: 'DELETE' }, token); await state.load() } catch (reason) { state.setError(reason instanceof Error ? reason.message : 'Could not delete collection.') } }
  return <AdminPage title="Collections" description="Curate themed football edits and their products." action={<button className="admin-primary" onClick={() => setEditing(null)}><Plus size={18} /> Add collection</button>}>{state.error && <AdminError message={state.error} />}{products.error && <AdminError message={products.error} />}<section className="admin-panel"><div className="admin-table-wrap"><table><thead><tr><th>Name</th><th>Products</th><th>Featured</th><th>Status</th><th /></tr></thead><tbody>{state.items.map((item) => <tr key={item._id}><td><strong>{item.name}</strong></td><td>{item.productCount}</td><td>{item.isFeatured ? 'Yes' : 'No'}</td><td><Status value={item.isActive} /></td><td><Actions onEdit={() => setEditing(item)} onDelete={() => void remove(item._id)} /></td></tr>)}</tbody></table></div></section>{editing !== undefined && <Drawer title={editing ? 'Edit collection' : 'New collection'} close={() => setEditing(undefined)}><form className="admin-form" onSubmit={save}><label>Name<input name="name" defaultValue={editing?.name} required /></label><label>Description<textarea name="description" defaultValue={editing?.description} rows={4} /></label><label>Display order<input name="displayOrder" type="number" defaultValue={editing?.displayOrder || 0} /></label>{editing?.image && <img className="admin-current-image" src={resolveImageUrl(editing.image)} alt="Current collection" />}<label>Image<input name="image" type="file" accept="image/jpeg,image/png,image/gif,image/webp" /></label><fieldset><legend>Products</legend><div className="admin-product-picker">{products.items.map((product) => <label key={product._id}><input name="productIds" type="checkbox" value={product._id} defaultChecked={editing?.productIds?.includes(product._id)} /> {product.name}</label>)}</div></fieldset><div className="admin-checks"><label><input name="isActive" type="checkbox" value="true" defaultChecked={editing?.isActive !== false} /> Active</label><label><input name="isFeatured" type="checkbox" value="true" defaultChecked={editing?.isFeatured} /> Featured</label></div><button className="admin-primary" disabled={saving || products.loading || Boolean(products.error)}>{saving ? 'Saving...' : 'Save collection'}</button></form></Drawer>}</AdminPage>
}

export function AdminSizesPage() {
  const { token } = useAuth(); const state = useAdminList<AdminSize>('/sizes'); const [editing, setEditing] = useState<AdminSize | null | undefined>(undefined); const [saving, setSaving] = useState(false)
  async function save(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!token) return; setSaving(true); const entries = Object.fromEntries(new FormData(event.currentTarget)); const values = { ...entries, isActive: entries.isActive === 'true' }; try { await apiRequest(editing ? `/sizes/${editing._id}` : '/sizes', { method: editing ? 'PUT' : 'POST', body: JSON.stringify(values) }, token); setEditing(undefined); await state.load() } catch (reason) { state.setError(reason instanceof Error ? reason.message : 'Could not save size.') } finally { setSaving(false) } }
  async function remove(id: string) { if (!token || !confirm('Delete this size?')) return; try { await apiRequest(`/sizes/${id}`, { method: 'DELETE' }, token); await state.load() } catch (reason) { state.setError(reason instanceof Error ? reason.message : 'Could not delete size.') } }
  const fields: Array<[keyof AdminSize, string]> = [['chest', 'Chest (cm, tops)'], ['waist', 'Waist (cm)'], ['hip', 'Hip (cm)'], ['height', 'Height (cm)']]
  return <AdminPage title="Men's size guides" description="Maintain measurements used by men's tops and bottoms." action={<button className="admin-primary" onClick={() => setEditing(null)}><Plus size={18} /> Add size</button>}>{state.error && <AdminError message={state.error} />}<section className="admin-panel"><div className="admin-table-wrap"><table><thead><tr><th>Size</th><th>Chest (cm)</th><th>Waist (cm)</th><th>Hip (cm)</th><th>Height (cm)</th><th>Status</th><th /></tr></thead><tbody>{state.items.map((item) => <tr key={item._id}><td><strong>{item.name}</strong></td><td>{item.chest}</td><td>{item.waist}</td><td>{item.hip}</td><td>{item.height}</td><td><Status value={item.isActive} /></td><td><Actions onEdit={() => setEditing(item)} onDelete={() => void remove(item._id)} /></td></tr>)}</tbody></table></div></section>{editing !== undefined && <Drawer title={editing ? 'Edit size' : 'New size'} close={() => setEditing(undefined)}><form className="admin-form" onSubmit={save}><label>Size<select name="name" defaultValue={editing?.name || 'M'}>{['XXS','XS','S','S Tall','M','M Tall','L','L Tall','XL','XL Tall','XXL','XXL Tall','3XL','3XL Tall','4XL','4XL Tall'].map((size) => <option key={size}>{size}</option>)}</select></label><div className="admin-form-grid">{fields.map(([name, label]) => <label key={name}>{label}<input name={name} defaultValue={editing?.[name] as string} required /></label>)}</div><label>Fit note<textarea name="fitNote" defaultValue={editing?.fitNote} rows={3} /></label><label className="admin-checkbox"><input name="isActive" type="checkbox" value="true" defaultChecked={editing?.isActive !== false} /> Active</label><button className="admin-primary" disabled={saving}>{saving ? 'Saving...' : 'Save size'}</button></form></Drawer>}</AdminPage>
}
