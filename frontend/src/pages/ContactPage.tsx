import { CheckCircle } from '@phosphor-icons/react'
import { useEffect, useState, type FormEvent } from 'react'
import { SelectField } from '../components/ui/SelectField'

const DRAFT_KEY = 'sportbuk_contact_draft'
interface Draft { name: string; email: string; topic: string; message: string }
const emptyDraft: Draft = { name: '', email: '', topic: 'Product sizing', message: '' }

export function ContactPage() {
  const [draft, setDraft] = useState<Draft>(() => {
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null') as Draft || emptyDraft } catch { return emptyDraft }
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
      if (draft.name || draft.email || draft.message) setSaved(true)
    }, 400)
    return () => window.clearTimeout(timer)
  }, [draft])

  function submit(event: FormEvent) {
    event.preventDefault()
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    setSaved(true)
  }

  return (
    <div className="page-shell page-top contact-layout">
      <div className="contact-copy"><h1>Talk football with us.</h1><p>Ask about shirt sizing, goalkeeper gloves, team kits, stock, or partnerships. This course-project form saves a private draft in your browser.</p><div className="contact-note"><strong>Draft only</strong><span>Nothing is sent to a server. Return on this device to continue writing.</span></div></div>
      <form className="form-panel" onSubmit={submit} onChange={() => setSaved(false)}>
        <div className="field"><label htmlFor="contact-name">Name</label><input id="contact-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} autoComplete="name" required /></div>
        <div className="field"><label htmlFor="contact-email">Email</label><input id="contact-email" type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} autoComplete="email" required /></div>
        <div className="field"><label htmlFor="contact-topic">Topic</label><SelectField id="contact-topic" value={draft.topic} onValueChange={(topic) => { setDraft({ ...draft, topic }); setSaved(false) }} options={[{ value: 'Product sizing', label: 'Product sizing' }, { value: 'Product stock', label: 'Product stock' }, { value: 'Team and bulk kits', label: 'Team and bulk kits' }, { value: 'Partnerships', label: 'Partnerships' }, { value: 'Other', label: 'Other' }]} /></div>
        <div className="field"><label htmlFor="contact-message">Message</label><textarea id="contact-message" rows={7} value={draft.message} onChange={(event) => setDraft({ ...draft, message: event.target.value })} required /></div>
        <button className="button button-dark" type="submit">Save draft</button>
        {saved && <p className="form-success"><CheckCircle size={19} weight="fill" /> Draft saved on this device.</p>}
      </form>
    </div>
  )
}
