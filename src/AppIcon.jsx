import React from 'react'
import { iconAssets } from './appMeta.js'

export default function AppIcon({ id, context = 'default', className = '' }) {
  const asset = context === 'dock' && id === 'skills' ? 'terminal' : (iconAssets[id] || 'folder')
  return <img className={'app-icon ' + className} src={'/icons/' + asset + '.svg'} alt="" aria-hidden="true" draggable="false" />
}
