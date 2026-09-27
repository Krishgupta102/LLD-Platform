interface StatusMessageProps {
  icon: 'loading' | 'empty' | 'error'
  title: string
  message?: string
  action?: React.ReactNode
}

export function StatusMessage({ icon, title, message, action }: StatusMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4">
        {icon === 'loading' && (
          <div className="w-10 h-10 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
        )}
        {icon === 'empty' && (
          <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center">
            <svg className="w-6 h-6 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.75 7.5h16.5" />
            </svg>
          </div>
        )}
        {icon === 'error' && (
          <div className="w-12 h-12 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-danger" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
        )}
      </div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      {message && <p className="text-sm text-muted max-w-md">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
