import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

/**
 * Minimal toast system used by the admin portal for save, publish and error
 * feedback. Toasts stack bottom-right and dismiss themselves.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => setToasts((current) => current.filter((toast) => toast.id !== id)), [])

  const push = useCallback((message, tone = 'info', timeout = 4800) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`
    setToasts((current) => [...current, { id, message, tone }])
    if (timeout) setTimeout(() => dismiss(id), timeout)
    return id
  }, [dismiss])

  const value = useMemo(() => ({
    push,
    success: (message) => push(message, 'success'),
    error: (message) => push(message, 'error'),
    info: (message) => push(message, 'info')
  }), [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.length ? (
        <div className="toast-stack" role="status" aria-live="polite">
          {toasts.map((toast) => (
            <div className={`toast is-${toast.tone}`} key={toast.id}>
              {toast.tone === 'success' ? <CheckCircle2 size={16} /> : toast.tone === 'error' ? <AlertTriangle size={16} /> : <Info size={16} />}
              <span style={{ flex: 1 }}>{toast.message}</span>
              <button onClick={() => dismiss(toast.id)} aria-label="Dismiss" style={{ color: 'inherit', opacity: 0.6 }}><X size={14} /></button>
            </div>
          ))}
        </div>
      ) : null}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside a ToastProvider')
  return context
}
