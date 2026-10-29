import React, { useState, useRef, useEffect } from 'react'
import { ArrowLeft, ArrowUpRight, Download, FileText, Folder, Github, Linkedin, Mail, Copy, Check, ExternalLink, Search, GraduationCap, Award, Code2, BrainCircuit, Terminal, UserRound, BriefcaseBusiness } from 'lucide-react'
import data from './data/portfolioData.json'
import { useDesktop } from './store.js'
import MobilePdfPreview from './MobilePdfPreview.jsx'
import { categories } from './appMeta.js'
import AppIcon from './AppIcon.jsx'
import { Safari, Gallery } from './PersonalApps.jsx'

const external = (url) => ({ href: url, target: '_blank', rel: 'noopener noreferrer' })

export function Avatar({ large = false }) {
  const [broken, setBroken] = useState(false)
  return <span className={'avatar ' + (large ? 'avatar-large' : '')}>{broken ? 'SCR' : <img src={data.personal.photo.publicPath} alt={data.personal.photo.alt} onError={() => setBroken(true)} />}</span>
}

function ActionLink({ href, children, icon: Icon = ArrowUpRight, download }) {
  return <a className="action-link" {...(download ? { href, download } : external(href))}><Icon size={17} aria-hidden="true" />{children}</a>
}

export function About() {
  const open = useDesktop(s => s.open)
  return <div className="app-pad about-layout"><div className="about-portrait"><Avatar large /></div><div className="about-copy"><span className="eyebrow">HELLO, I'M</span><h2>{data.personal.name}</h2><p className="lead">{data.personal.positioning}</p><p>{data.personal.professionalSummary}</p><div className="about-highlights"><span>AI applications</span><span>Backend systems</span><span>Modern web</span></div><div className="action-row"><button className="primary-btn" onClick={() => open('projects')}>Explore projects</button><button className="secondary-btn" onClick={() => open('resume')}>View resumes</button><button className="secondary-btn" onClick={() => open('contact')}>Get in touch</button></div></div></div>
}

export function Projects({ initialProject = null }) {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(initialProject)
  const projects = data.projects.filter(p => filter === 'All' || p.category === filter)
  const project = data.projects.find(p => p.id === selected)
  return <div className="app-pad project-app">{project ? <div className="project-detail"><button className="back-link" onClick={() => setSelected(null)}><ArrowLeft size={17} /> All projects</button><div className={'project-banner art-' + project.id}><span className="art-mark">{project.category === 'AI / Machine Learning' ? <BrainCircuit /> : <Code2 />}</span><span>{project.subtitle}</span><strong>{project.title}</strong></div><div className="detail-header"><div><span className="eyebrow">{project.category} · {project.date}</span><h2>{project.title}</h2><p className="lead">{project.description}</p></div><div className="action-row"><ActionLink href={project.repositoryUrl} icon={Github}>Repository</ActionLink>{project.liveDemoUrl && <ActionLink href={project.liveDemoUrl}>Live demo</ActionLink>}</div></div><div className="chip-row">{project.technologies.map(t => <span className="chip" key={t}>{t}</span>)}</div><div className="detail-columns"><section><h3>What it does</h3><ul>{project.features.map(f => <li key={f}>{f}</li>)}</ul></section><section><h3>Architecture</h3><ul>{project.architecture.map(f => <li key={f}>{f}</li>)}</ul>{project.metrics?.length > 0 && <><h3>Documented result</h3><ul>{project.metrics.map(m => <li key={m}>{m}</li>)}</ul></>}</section></div></div> : <><div className="section-head"><div><span className="eyebrow">SELECTED WORK</span><h2>Projects</h2><p>Six projects across AI, full-stack engineering, and system design.</p></div><span className="count-label">06 / 06</span></div><div className="filter-row" aria-label="Filter projects">{categories.map(c => <button key={c} onClick={() => setFilter(c)} className={filter === c ? 'selected' : ''} aria-pressed={filter === c}>{c}</button>)}</div><div className="project-grid">{projects.map((p, i) => <button className="project-tile" key={p.id} onClick={() => setSelected(p.id)}><div className={'tile-art art-' + p.id}><span>0{i + 1}</span>{p.category === 'AI / Machine Learning' ? <BrainCircuit /> : <Code2 />}</div><div className="tile-copy"><small>{p.category}</small><strong>{p.title}</strong><span>{p.subtitle}</span></div><ArrowUpRight size={18} /></button>)}</div></>}</div>
}

export function Resume() {
  const selectedId = useDesktop(s => s.selectedResume)
  const select = useDesktop(s => s.selectResume)
  const resume = data.resumes.find(r => r.id === selectedId) || data.resumes[0]
  return <div className="resume-app"><aside className="resume-sidebar"><span className="sidebar-label">YOUR DOCUMENTS</span>{data.resumes.map(r => <button key={r.id} className={'resume-item ' + (r.id === resume.id ? 'selected' : '')} onClick={() => select(r.id)} aria-current={r.id === resume.id ? 'true' : undefined}><FileText size={20} /><span><strong>{r.label}</strong><small>PDF document</small></span></button>)}</aside><div className="resume-main"><div className="resume-toolbar"><div><span className="eyebrow">PREVIEW</span><strong>{resume.label}</strong></div><div className="action-row"><ActionLink href={resume.publicPath} icon={ExternalLink}>Open</ActionLink><ActionLink href={resume.publicPath} icon={Download} download={resume.filename}>Download</ActionLink></div></div><div className="resume-mobile-select"><label htmlFor="resume-choice">Select a resume</label><select id="resume-choice" value={resume.id} onChange={e => select(e.target.value)}>{data.resumes.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}</select></div>{window.innerWidth < 768 ? <MobilePdfPreview url={resume.publicPath} label={resume.label} /> : <iframe key={resume.id} className="pdf-frame" src={encodeURI(resume.publicPath) + '#view=Fit'} title={'Preview: ' + resume.label} />}<p className="pdf-fallback">If the preview does not load, <a href={encodeURI(resume.publicPath)} target="_blank" rel="noopener noreferrer">open the PDF in a new tab</a>.</p></div></div>
}

const groupNames = { languages: 'Languages', frontend: 'Frontend', backendAndApis: 'Backend & APIs', aiMl: 'AI / Machine Learning', aiLibrariesAndPlatforms: 'AI Libraries & Platforms', databases: 'Databases', cloudAndInfrastructure: 'Cloud & Infrastructure', developerTools: 'Developer Tools', coreConcepts: 'Core Concepts' }
const commandList = ['help', 'whoami', 'about', 'skills [group]', 'projects [category]', 'education', 'certifications', 'contact', 'resume [id]', 'clear']

export function Skills() {
  const open = useDesktop(s => s.open)
  const selectResume = useDesktop(s => s.selectResume)
  const [lines, setLines] = useState([{ command: 'welcome', result: ['Sai Charan Reddy / Skills Terminal', 'Type help to explore.'] }])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const endRef = useRef(null)
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'nearest' }) }, [lines])
  function run(raw) {
    const [cmd, ...args] = raw.trim().toLowerCase().split(/\s+/)
    if (!cmd) return
    if (cmd === 'clear') { setLines([]); setHistory(prev => [raw, ...prev].slice(0, 50)); setHistoryIndex(-1); setInput(''); return }
    let result
    switch (cmd) {
      case 'help': result = commandList; break
      case 'whoami': case 'about': result = [data.personal.name, data.personal.positioning, data.personal.professionalSummary]; break
      case 'skills': result = Object.entries(data.skills).filter(([key]) => !args.length || key.toLowerCase().includes(args.join('')) || groupNames[key].toLowerCase().includes(args.join(' '))).map(([key, values]) => `${groupNames[key]}: ${values.join(', ')}`); break
      case 'projects': result = data.projects.filter(p => !args.length || p.category.toLowerCase().includes(args.join(' ')) || p.title.toLowerCase().includes(args.join(' '))).map(p => `${p.title} — ${p.category}`); break
      case 'education': result = data.education.map(e => `${e.degree}, ${e.institution} — Sep 2023 to ${e.status}`); break
      case 'certifications': result = data.certifications.map(c => c.name); break
      case 'contact': result = [data.personal.email, ...Object.entries(data.profiles).map(([k, v]) => `${k}: ${v}`)]; break
      case 'resume': {
        const r = data.resumes.find(x => x.id === args.join('-')) || data.resumes.find(x => x.id.startsWith(args[0]))
        if (r) { selectResume(r.id); open('resume'); result = [`Opened ${r.label}`] }
        else { open('resume'); result = ['Opened Resume. Choose from three documents.'] }
        break
      }
      default: result = ['Command not found. Type help.']
    }
    setLines(prev => [...prev, { command: raw, result: result.length ? result : ['No matching results.'] }].slice(-50))
    setHistory(prev => [raw, ...prev].slice(0, 50)); setHistoryIndex(-1); setInput('')
  }
  return <div className="terminal-app"><div className="terminal-caption"><span className="terminal-light" /> portfolio@saicharan:~ <span>interactive profile</span></div><div className="terminal-output" aria-live="polite">{lines.map((line, i) => <div className="terminal-entry" key={i}><div><span className="terminal-prompt">➜</span> {line.command}</div>{line.result.map((s, j) => <p key={j}>{s}</p>)}</div>)}<div ref={endRef} /></div><form className="terminal-input" onSubmit={e => { e.preventDefault(); run(input) }}><label htmlFor="command">➜</label><input id="command" autoComplete="off" spellCheck="false" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'ArrowUp' && history.length) { e.preventDefault(); const n = Math.min(historyIndex + 1, history.length - 1); setHistoryIndex(n); setInput(history[n]) } else if (e.key === 'ArrowDown') { e.preventDefault(); const n = historyIndex - 1; setHistoryIndex(n); setInput(n < 0 ? '' : history[n]) } }} placeholder="Type a command…" /></form><div className="skill-groups">{Object.entries(data.skills).map(([key, values]) => <div key={key}><strong>{groupNames[key]}</strong><span>{values.join(' · ')}</span></div>)}</div></div>
}

export function Education() { return <div className="app-pad simple-app"><span className="eyebrow">ACADEMIC RECORD</span><h2>Education</h2>{data.education.map(e => <article className="education-record" key={e.institution}><GraduationCap size={30} /><div><span className="eyebrow">SEP 2023 — {e.status.toUpperCase()}</span><h3>{e.institution}</h3><p>{e.degree}</p><p>Specialization: {e.specialization}</p><small>{e.location}</small></div></article>)}</div> }
export function Certificates() { return <div className="app-pad simple-app"><span className="eyebrow">CREDENTIALS</span><h2>Certificates</h2><p>Four credentials with links from the original resumes.</p><div className="certificate-list">{data.certifications.map((c, i) => <a key={c.name} {...external(c.url)}><span className="certificate-number">0{i + 1}</span><Award size={23} /><strong>{c.name}</strong><ArrowUpRight size={18} /></a>)}</div></div> }
export function Contact() {
  const [copied, setCopied] = useState(false)
  async function copy() { try { await navigator.clipboard.writeText(data.personal.email); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {} }
  return <div className="app-pad contact-app"><Avatar /><span className="eyebrow">LET'S CONNECT</span><h2>Have something to build?</h2><p>Reach out about AI applications, backend systems, or full-stack engineering.</p><div className="contact-email"><Mail size={22} /><a href={'mailto:' + data.personal.email}>{data.personal.email}</a><button onClick={copy} aria-label="Copy email address">{copied ? <Check size={18} /> : <Copy size={18} />}</button></div><div className="contact-links"><ActionLink href={data.profiles.linkedin} icon={Linkedin}>LinkedIn</ActionLink><ActionLink href={data.profiles.github} icon={Github}>GitHub</ActionLink><ActionLink href={data.profiles.leetcode} icon={Code2}>LeetCode</ActionLink></div></div>
}

export function Settings() { const theme = useDesktop(s => s.theme); const setTheme = useDesktop(s => s.setTheme); return <div className="app-pad simple-app"><span className="eyebrow">PERSONALIZE YOUR SPACE</span><h2>Appearance</h2><p>Choose the view that feels comfortable.</p><div className="setting-options">{['light', 'dark', 'system'].map(t => <label key={t}><input type="radio" name="theme" value={t} checked={theme === t} onChange={() => setTheme(t)} /><span><strong>{t[0].toUpperCase() + t.slice(1)}</strong><small>{t === 'system' ? 'Match your device preference' : t === 'dark' ? 'Deep slate surfaces' : 'Soft daylight surfaces'}</small></span></label>)}</div></div> }

export function Trash() { return <div className="trash-app"><AppIcon id="trash" className="trash-empty-icon"/><h2>Trash is Empty</h2><p>There are no items in the Trash.</p></div> }

const finderFolders = [
  { id: 'about', title: 'About Me', icon: UserRound }, { id: 'projects', title: 'Projects', icon: BriefcaseBusiness }, { id: 'resume', title: 'Resumes', icon: FileText }, { id: 'skills', title: 'Skills', icon: Terminal }, { id: 'education', title: 'Education', icon: GraduationCap }, { id: 'certificates', title: 'Certificates', icon: Award }, { id: 'contact', title: 'Contact', icon: Mail }
]
export function Finder() {
  const path = useDesktop(s => s.finderPath)
  const setPath = useDesktop(s => s.setFinderPath)
  const open = useDesktop(s => s.open)
  const selectResume = useDesktop(s => s.selectResume)
  const [query, setQuery] = useState('')
  const group = categories.slice(1)
  let items = path === 'home' ? finderFolders.map(f => ({ ...f, kind: 'folder' })) : path === 'projects' ? group.map((c, i) => ({ id: 'category:' + i, title: c, kind: 'folder', icon: Folder })) : path.startsWith('category:') ? data.projects.filter(p => p.category === group[Number(path.split(':')[1])]).map(p => ({ id: 'project:' + p.id, title: p.title, kind: 'project', icon: Code2 })) : path === 'resume' ? data.resumes.map(r => ({ id: 'resume:' + r.id, title: r.label, kind: 'document', icon: FileText })) : []
  items = items.filter(i => i.title.toLowerCase().includes(query.toLowerCase()))
  function activate(item) { if (item.id.startsWith('category:')) setPath(item.id); else if (item.id.startsWith('project:')) open(item.id); else if (item.id.startsWith('resume:')) { selectResume(item.id.slice(7)); open('resume') } else if (item.id === 'projects' || item.id === 'resume') setPath(item.id); else open(item.id) }
  const title = path === 'home' ? 'Home' : path === 'projects' ? 'Projects' : path === 'resume' ? 'Resumes' : path.startsWith('category:') ? group[Number(path.split(':')[1])] : path
  return <div className="finder-app"><aside className="finder-sidebar"><span className="sidebar-label">FAVORITES</span>{[{ id: 'home', title: 'Home', icon: Folder }, ...finderFolders].map(f => <button key={f.id} className={path === f.id ? 'active' : ''} onClick={() => f.id === 'projects' || f.id === 'resume' || f.id === 'home' ? setPath(f.id) : open(f.id)}><f.icon size={17} />{f.title}</button>)}</aside><div className="finder-main"><div className="finder-toolbar"><button onClick={() => setPath(path.startsWith('category:') ? 'projects' : 'home')} disabled={path === 'home'} aria-label="Back"><ArrowLeft size={18} /></button><strong>Home <span>/ {title}</span></strong><label className="finder-search"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search this folder" aria-label="Search this folder" /></label></div><div className="finder-items">{items.map(item => <button key={item.id} onClick={() => activate(item)}><span className={'finder-item-icon ' + item.kind}>{item.kind === 'folder' ? <AppIcon id={item.id.startsWith('category:') ? 'projects' : item.id}/> : <item.icon size={29} />}</span><strong>{item.title}</strong><small>{item.kind}</small></button>)}{!items.length && <p className="empty-state">No items match your search.</p>}</div><div className="finder-footer">{items.length} item{items.length === 1 ? '' : 's'} · {title}</div></div></div>
}

export function AppContent({ id }) {
  if (id.startsWith('project:')) return <Projects initialProject={id.slice(8)} />
  switch (id) { case 'finder': return <Finder />; case 'safari': return <Safari />; case 'gallery': return <Gallery />; case 'about': return <About />; case 'projects': return <Projects />; case 'resume': return <Resume />; case 'skills': return <Skills />; case 'education': return <Education />; case 'certificates': return <Certificates />; case 'contact': return <Contact />; case 'settings': return <Settings />; case 'trash': return <Trash />; default: return null }
}
