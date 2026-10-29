import React, { useState } from 'react'
import { ArrowLeft, ArrowUpRight, Code2, Github, Linkedin } from 'lucide-react'
import data from './data/portfolioData.json'

const profiles = [
  { name: 'LinkedIn', label: 'PROFESSIONAL PROFILE', description: 'Connect with Sai and explore his professional background.', url: data.profiles.linkedin, Icon: Linkedin, className: 'linkedin' },
  { name: 'GitHub', label: 'CODE & PROJECTS', description: 'Explore repositories and the projects behind the portfolio.', url: data.profiles.github, Icon: Github, className: 'github' },
  { name: 'LeetCode', label: 'PROBLEM SOLVING', description: 'Visit Sai’s coding and problem-solving profile.', url: data.profiles.leetcode, Icon: Code2, className: 'leetcode' },
]

export function Safari() {
  return <div className="safari-app">
    <div className="safari-toolbar"><div className="safari-address">Professional profiles · Sai Charan Reddy</div></div>
    <div className="safari-content"><div className="safari-intro"><span className="eyebrow">EXPLORE ONLINE</span><h2>Find me on the web.</h2><p>Three places to connect, explore my projects, and see my problem-solving work.</p></div>
      <div className="profile-articles">{profiles.map(({ name, label, description, url, Icon, className }) => <article className="profile-article" key={name}>
        <span className={'profile-article-icon ' + className}><Icon size={26} /></span><div><span className="eyebrow">{label}</span><h3>{name}</h3><p>{description}</p><a href={url} target="_blank" rel="noopener noreferrer">Visit {name} <ArrowUpRight size={15} aria-hidden="true"/></a></div>
      </article>)}</div>
    </div>
  </div>
}

const images = [
  { id: 'portrait', title: 'Sai Charan Reddy', subtitle: 'Portrait', src: data.personal.photo.publicPath, alt: data.personal.photo.alt },
  { id: 'campus', title: 'Bennett University', subtitle: 'A-Block, Greater Noida', src: '/images/bennett-campus.jpg', alt: 'A-Block at Bennett University, surrounded by trees and landscaped grounds', source: 'https://www.bennett.edu.in/bennett-life/gallery/' },
]

export function Gallery() {
  const [selected, setSelected] = useState(null)
  const photo = images.find(item => item.id === selected)
  return <div className="gallery-app">
    {photo ? <div className="photo-detail"><div className="gallery-detail-bar"><button className="back-link" onClick={() => setSelected(null)}><ArrowLeft size={17}/> All photos</button><span>{photo.subtitle}</span></div><div className="gallery-viewer"><img src={photo.src} alt={photo.alt}/></div><div className="gallery-caption"><div><strong>{photo.title}</strong><span>{photo.subtitle}</span></div>{photo.source && <a href={photo.source} target="_blank" rel="noopener noreferrer">Image source <ArrowUpRight size={15}/></a>}</div></div> : <div className="gallery-content"><div className="gallery-heading"><div><span className="eyebrow">PHOTO LIBRARY</span><h2>Gallery</h2><p>A little more about me and where I study.</p></div><span className="gallery-count">{images.length} photos</span></div><div className="gallery-grid">{images.map(item => <button className={'gallery-tile gallery-' + item.id} key={item.id} onClick={() => setSelected(item.id)} aria-label={'View photo: ' + item.title}><img src={item.src} alt={item.alt}/><span><strong>{item.title}</strong><small>{item.subtitle}</small></span></button>)}</div><p className="gallery-credit">Campus photograph from <a href="https://www.bennett.edu.in/bennett-life/gallery/" target="_blank" rel="noopener noreferrer">Bennett University</a>.</p></div>}
  </div>
}
