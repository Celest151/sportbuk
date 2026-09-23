import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { Link, useParams } from 'react-router-dom'
import { articles } from '../features/journal/articles'

export function JournalPage() {
  const [lead, ...more] = articles
  return (
    <div className="page-shell page-top">
      <div className="page-intro"><h1>Football journal</h1><p>Practical notes for choosing, using, and caring for your gear.</p></div>
      <Link className="journal-lead" to={`/journal/${lead.slug}`}><img src={lead.image} alt="Football match kit ready for play" /><span><small>{lead.category} / {lead.readTime}</small><strong>{lead.title}</strong><p>{lead.summary}</p><b>Read article <ArrowRight size={17} /></b></span></Link>
      <div className="journal-grid">{more.map((article) => <article key={article.slug}><img src={article.image} alt="Football equipment in use" loading="lazy" /><small>{article.category} / {article.readTime}</small><h2>{article.title}</h2><p>{article.summary}</p><Link className="text-link" to={`/journal/${article.slug}`}>Read article <ArrowRight size={17} /></Link></article>)}</div>
    </div>
  )
}

export function JournalArticlePage() {
  const { slug } = useParams()
  const article = articles.find((item) => item.slug === slug)
  if (!article) return <div className="page-shell page-top empty-state"><h1>Article not found</h1><Link className="button button-dark" to="/journal">Back to journal</Link></div>
  return <article className="article-page page-shell page-top"><Link className="back-link" to="/journal"><ArrowLeft size={17} /> Football journal</Link><header><small>{article.category} / {article.readTime}</small><h1>{article.title}</h1><p>{article.summary}</p></header><img src={article.image} alt={article.title} /> <div className="article-body">{article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></article>
}
