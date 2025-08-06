'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')

      if (token) {
        router.replace('/dashboard')
      } else {
        router.replace('/login')
      }

      setLoading(false)
    }
  }, [router])

  if (loading) {
    return <p>Redirecting...</p> // Atau spinner jika mau
  }

  return null
}
