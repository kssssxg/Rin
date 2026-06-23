import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import Modal from 'react-modal'
import 'remixicon/fonts/remixicon.css'
import App from './App'
import './index.css'
import './components.css'
import { GlobalErrorBoundary } from './components/error-boundary.tsx'
import { bootstrapApp } from './app/bootstrap'

bootstrapApp()

// 背景图组件
function BackgroundLayer() {
  const [bgUrl, setBgUrl] = useState('https://img.8845.top/acg')
  
  useEffect(() => {
    // 从 API 获取随机背景图
    fetch('https://img.8845.top/acg', { redirect: 'follow' })
      .then(res => {
        if (res.ok) {
          setBgUrl(res.url)
        }
      })
      .catch(() => {
        // 使用默认背景
        setBgUrl('https://img.8845.top/acg')
      })
  }, [])
  
  return (
    <>
      <div 
        className="bg-layer" 
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
      <div className="overlay" />
    </>
  )
}

// Toast 组件
function Toast() {
  const [show, setShow] = useState(false)
  const [message, setMessage] = useState('')
  
  useEffect(() => {
    // 全局 showToast 函数
    (window as any).showToast = (msg: string) => {
      setMessage(msg)
      setShow(true)
      setTimeout(() => setShow(false), 3000)
    }
  }, [])
  
  return (
    <div className={`toast ${show ? 'show' : ''}`}>
      {message}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <BackgroundLayer />
      <Toast />
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>
)
Modal.setAppElement('#root');
