export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }
  
  export function formatDate(date: string): string {
    return new Intl.DateTimeFormat('en-NG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date))
  }
  
  export function generateReferralCode(name: string): string {
    const cleanName = name.replace(/\s+/g, '').toUpperCase().slice(0, 4)
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `${cleanName}${random}`
  }
  
  export function calculateCommission(amount: number): number {
    return amount * 0.1
  }
  
  export function getTimeAgo(date: string): string {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now.getTime() - past.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
  
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return formatDate(date)
  }