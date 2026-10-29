import React, { useEffect, useRef, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

export default function MobilePdfPreview({ url, label }) {
  const wrapper = useRef(null)
  const canvas = useRef(null)
  const [width, setWidth] = useState(0)
  const [error, setError] = useState(false)
  const [text, setText] = useState('')
  const [zoom, setZoom] = useState(1)

  useEffect(() => { setZoom(1); setText(''); if (canvas.current) canvas.current.width = 0 }, [url])

  useEffect(() => {
    if (!wrapper.current) return
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)))
    observer.observe(wrapper.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!width || !canvas.current) return
    let cancelled = false
    let documentTask, documentProxy, renderTask
    async function render() {
      try {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
        documentTask = pdfjs.getDocument({ url })
        documentProxy = await documentTask.promise
        const page = await documentProxy.getPage(1)
        const base = page.getViewport({ scale: 1 })
        const ratio = Math.min(window.devicePixelRatio || 1, 2)
        const viewport = page.getViewport({ scale: (width * zoom / base.width) * ratio })
        if (cancelled || !canvas.current) return
        const node = canvas.current
        node.width = Math.ceil(viewport.width)
        node.height = Math.ceil(viewport.height)
        node.style.width = width * zoom + 'px'
        node.style.height = Math.ceil(viewport.height / ratio) + 'px'
        renderTask = page.render({ canvas: node, canvasContext: node.getContext('2d'), viewport })
        await renderTask.promise
        const content = await page.getTextContent()
        if (!cancelled) setText(content.items.map(item => item.str || '').join(' '))
      } catch (e) {
        if (!cancelled && e.name !== 'RenderingCancelledException' && e.message !== 'Loading aborted') {
          console.error('PDF preview render failed', e)
          setError(true)
        }
      }
    }
    setError(false)
    render()
    return () => { cancelled = true; renderTask?.cancel(); documentTask?.destroy() }
  }, [url, width, zoom])

  return <div ref={wrapper} className="mobile-pdf-preview" aria-label={'Preview: ' + label}>
    <div className="pdf-zoom-toolbar"><span>Page 1 of 1</span><div><button onClick={() => setZoom(z => Math.max(1, +(z - .25).toFixed(2)))} disabled={zoom === 1} aria-label="Zoom out"><Minus size={16} /></button><span>{Math.round(zoom * 100)}%</span><button onClick={() => setZoom(z => Math.min(2, +(z + .25).toFixed(2)))} disabled={zoom === 2} aria-label="Zoom in"><Plus size={16} /></button></div></div>
    {error ? <p>Preview unavailable. Use Open to read this PDF in your browser.</p> : <><canvas ref={canvas} role="img" aria-label={'First page of ' + label} /><span className="sr-only">{text}</span></>}
  </div>
}
