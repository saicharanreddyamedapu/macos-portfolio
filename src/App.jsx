import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { ArrowUpRight, Award, BrainCircuit, ChevronLeft, Code2, FileText, Folder, Github, Mail, Moon, Settings2, Sun, Terminal, UserRound, X, Minus, Maximize2, Minimize2, BriefcaseBusiness } from 'lucide-react'
import data from './data/portfolioData.json'
import { useDesktop } from './store.js'
import { AppContent } from './Content.jsx'
import { appNames } from './appMeta.js'
import AppIcon from './AppIcon.jsx'

gsap.registerPlugin(Draggable)
const dockIds = ['finder', 'safari', 'gallery', 'skills', 'contact', 'settings', 'trash']
const desktopIds = ['about', 'projects', 'resume', 'skills']

function useMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => { const mq = matchMedia('(max-width: 767px)'); const update = () => setMobile(mq.matches); mq.addEventListener('change', update); return () => mq.removeEventListener('change', update) }, [])
  return mobile
}
function useClock() { const [now, setNow] = useState(new Date()); useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id) }, []); const date = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(now); const time = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(now); return { full: `${date} · ${time}`, time } }

function Hero({ mobile = false }) {
  const open = useDesktop(s => s.open)
  return <div className={'hero ' + (mobile ? 'mobile-hero' : '')}><div className="hero-intro"><span className="eyebrow"><span className="status-dot" /> AI / ML · FULL-STACK DEVELOPMENT</span><h1>Sai Charan<br /><em>Reddy.</em></h1><p className="hero-role">AI/ML & Full-Stack Developer</p><p className="hero-description">Building intelligent applications, scalable backend systems, and modern web experiences.</p><div className="hero-actions"><button className="primary-btn" onClick={() => open('projects')}>Explore work <ArrowUpRight size={18} /></button><button className="secondary-btn" onClick={() => open('resume')}>View resume</button></div></div><div className="hero-work"><div className="hero-work-top"><span>01 / FEATURED PROJECT</span><BrainCircuit size={22} /></div><div className="hero-work-visual"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="orbit-core"><BrainCircuit size={58} strokeWidth={1.2} /></span></div><div className="hero-work-bottom"><div><small>HYBRID RETRIEVAL · AI</small><h2>SkillLens</h2><p>Resume screening that goes beyond keyword matching.</p></div><button aria-label="Open SkillLens project" onClick={() => open('project:skilllens')}><ArrowUpRight size={22} /></button></div></div><div className="hero-side"><button className="hero-side-card" onClick={() => open('project:hirely')}><span>02 / FULL-STACK</span><BriefcaseBusiness size={25} /><strong>Hirely</strong><small>A job platform for three roles</small><ArrowUpRight size={18} /></button><button className="hero-side-card" onClick={() => open('project:gpt2-from-scratch')}><span>03 / DEEP LEARNING</span><Code2 size={25} /><strong>GPT-2, from scratch</strong><small>Transformer training in PyTorch</small><ArrowUpRight size={18} /></button></div></div>
}

function TopBar() {
  const open = useDesktop(s => s.open)
  const clock = useClock()
  return <header className="topbar"><div className="topbar-left"><button className="brand-button" onClick={() => open('about')} aria-label="Open About Me"><span className="apple-mark" aria-hidden="true"/><strong>Sai Charan Reddy</strong></button><nav aria-label="Main"><button onClick={() => open('projects')}>Projects</button><button onClick={() => open('resume')}>Resume</button><button onClick={() => open('contact')}>Contact</button></nav></div><div className="topbar-right"><button onClick={() => open('settings')} aria-label="Appearance settings"><Settings2 size={17} /></button><time>{clock.full}</time></div></header>
}

function DesktopIcons() { const open = useDesktop(s => s.open); return <div className="desktop-icons" aria-label="Desktop shortcuts">{desktopIds.map(id => <button key={id} onClick={() => open(id)} title={'Open ' + appNames[id]}><AppIcon id={id} className="desktop-icon-art"/><span>{appNames[id]}</span></button>)}</div> }

function Dock() {
  const open = useDesktop(s => s.open)
  const windows = useDesktop(s => s.windows)
  const [hover, setHover] = useState(-1)
  const minimized = Object.values(windows).filter(w => w.minimized && !dockIds.includes(w.id))
  const labelFor = id => id.startsWith('project:') ? data.projects.find(p => p.id === id.slice(8))?.title || 'Project' : appNames[id]
  const entries = [...dockIds.slice(0, -1), ...minimized.map(w => w.id), 'trash']
  return <div className="dock-wrap"><nav className="dock" aria-label="Application dock" onMouseLeave={() => setHover(-1)}>{entries.map((id, i) => { const w = windows[id]; const scale = hover === i ? 1.33 : hover >= 0 && Math.abs(hover - i) === 1 ? 1.13 : 1; const label = labelFor(id); return <React.Fragment key={id}>{(id === 'trash' || (minimized.length > 0 && id === minimized[0].id)) && <span className="dock-divider" aria-hidden="true"/>}<button className={'dock-item dock-' + id.replace(':', '-')} style={{ '--dock-scale': scale }} onMouseEnter={() => setHover(i)} onClick={() => open(id)} aria-label={(w?.minimized ? 'Restore ' : 'Open ') + label} title={label}><AppIcon id={id} context="dock"/><span className="dock-tooltip">{label}</span>{w && <i className={w.minimized ? 'minimized' : ''} />}</button></React.Fragment>})}</nav></div>
}

function WindowFrame({ item, active }) {
  const el = useRef(null)
  const header = useRef(null)
  const open = useDesktop(s => s.open)
  const close = useDesktop(s => s.close)
  const focus = useDesktop(s => s.focus)
  const minimize = useDesktop(s => s.minimize)
  const maximize = useDesktop(s => s.maximize)
  const setBounds = useDesktop(s => s.bounds)
  const id = item.id
  useEffect(() => { if (item.minimized) return; const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; if (!reduce) gsap.fromTo(el.current, { opacity: 0, scale: .98, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: .22, ease: 'power2.out', clearProps: 'transform,opacity' }) }, [])
  useEffect(() => { if (item.minimized || item.maximized || !el.current || !header.current) return; const drag = Draggable.create(el.current, { type: 'x,y', trigger: header.current, allowEventDefault: true, onPress() { focus(id) }, onDragEnd() { const rect = el.current.getBoundingClientRect(); setBounds(id, { ...item.bounds, x: Math.max(16, Math.min(rect.left, innerWidth - rect.width - 16)), y: Math.max(50, Math.min(rect.top, innerHeight - rect.height - 68)) }); gsap.set(el.current, { x: 0, y: 0 }) } })[0]; return () => drag.kill() }, [item.minimized, item.maximized, item.bounds, id])
  function startResize(e) { e.preventDefault(); e.stopPropagation(); focus(id); const startX = e.clientX, startY = e.clientY, start = { ...item.bounds }; const move = ev => setBounds(id, { ...start, width: Math.min(innerWidth - start.x - 16, Math.max(480, start.width + ev.clientX - startX)), height: Math.min(innerHeight - start.y - 65, Math.max(350, start.height + ev.clientY - startY)) }); const stop = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', stop) }; window.addEventListener('pointermove', move); window.addEventListener('pointerup', stop) }
  const title = id.startsWith('project:') ? data.projects.find(p => p.id === id.slice(8))?.title || 'Project' : appNames[id]
  return <section ref={el} className={'window ' + (active ? 'active' : '') + (item.maximized ? ' maximized' : '')} style={{ left: item.bounds.x, top: item.bounds.y, width: item.bounds.width, height: item.bounds.height, zIndex: item.z, display: item.minimized ? 'none' : undefined }} onPointerDown={() => !active && focus(id)} role="dialog" aria-label={title} tabIndex={-1}><div className="window-header" ref={header}><div className="window-controls" onPointerDown={e => e.stopPropagation()}><button className="control close" onClick={() => close(id)} aria-label={'Close ' + title} title="Close"><X size={10} /></button><button className="control minimize" onClick={() => minimize(id)} aria-label={'Minimize ' + title} title="Minimize"><Minus size={10} /></button><button className="control maximize" onClick={() => maximize(id)} aria-label={(item.maximized ? 'Restore ' : 'Maximize ') + title} title={item.maximized ? 'Restore' : 'Maximize'}>{item.maximized ? <Minimize2 size={10} /> : <Maximize2 size={10} />}</button></div><strong>{title}</strong><span className="window-header-end" /></div><div className="window-body"><AppContent id={id} /></div>{!item.maximized && <div className="resize-handle" onPointerDown={startResize} role="separator" aria-label={'Resize ' + title} />}</section>
}

function Desktop() {
  const windows = useDesktop(s => s.windows)
  const activeId = useDesktop(s => s.activeId)
  const close = useDesktop(s => s.close)
  const clamp = useDesktop(s => s.clampWindows)
  useEffect(() => { const onResize = () => clamp(); window.addEventListener('resize', onResize); return () => window.removeEventListener('resize', onResize) }, [clamp])
  useEffect(() => { const onKey = e => { if (e.key === 'Escape' && activeId) close(activeId) }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) }, [activeId, close])
  return <div className="desktop-shell"><div className="wallpaper" aria-hidden="true"/><TopBar /><DesktopIcons /><Hero /><div className="window-layer">{Object.values(windows).map(w => <WindowFrame key={w.id} item={w} active={w.id === activeId} />)}</div><Dock /></div>
}

function Mobile() {
  const open = useDesktop(s => s.open)
  const id = useDesktop(s => s.mobileApp)
  const close = useDesktop(s => s.closeMobile)
  const clock = useClock()
  useEffect(() => { const onKey = e => { if (e.key === 'Escape' && id) close() }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) }, [id, close])
  useEffect(() => { document.body.style.overflow = id ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [id])
  const apps = ['projects', 'resume', 'skills', 'contact', 'about', 'education', 'certificates', 'finder', 'safari', 'gallery']
  return <div className="mobile-shell"><div className="wallpaper" aria-hidden="true"/><div className="mobile-status"><strong>{clock.time}</strong><button onClick={() => open('settings')} aria-label="Appearance settings"><Settings2 size={18} /></button></div><div className="mobile-greeting"><span className="eyebrow">SAI'S WORKSPACE</span><h1>Build things<br /><em>that matter.</em></h1></div><div className="mobile-icon-grid">{apps.map(app => <button key={app} onClick={() => open(app)}><AppIcon id={app} className="mobile-app-icon"/><small>{appNames[app]}</small></button>)}</div><Hero mobile /><div className="mobile-bottom-dock">{['finder', 'safari', 'gallery', 'contact'].map(app => <button key={app} onClick={() => open(app)} aria-label={'Open ' + appNames[app]}><AppIcon id={app}/></button>)}</div>{id && <main className="mobile-sheet" tabIndex={-1}><header className="mobile-sheet-header"><button onClick={close}><ChevronLeft size={21} /> Done</button><strong>{id.startsWith('project:') ? 'Project' : appNames[id]}</strong><span /></header><div className="mobile-sheet-body" key={id}><AppContent id={id} /></div></main>}</div>
}

export default function App() {
  const mobile = useMobile()
  const theme = useDesktop(s => s.theme)
  const activeId = useDesktop(s => s.activeId)
  const mobileApp = useDesktop(s => s.mobileApp)
  const close = useDesktop(s => s.close)
  const closeMobile = useDesktop(s => s.closeMobile)
  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  useEffect(() => { window.portfolioBoot?.ready() }, [])
  useEffect(() => { if (mobile && activeId) useDesktop.setState({ mobileApp: activeId }); else if (!mobile && mobileApp) useDesktop.setState({ mobileApp: null }) }, [mobile])
  useEffect(() => { const selector = mobile ? '.mobile-sheet' : '.window.active'; if ((mobile ? mobileApp : activeId)) requestAnimationFrame(() => document.querySelector(selector)?.focus?.()) }, [activeId, mobileApp, mobile])
  return mobile ? <Mobile /> : <Desktop />
}
