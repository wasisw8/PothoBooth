const KLIKQRIS_BASE = 'https://klikqris.com/api'

export async function createQrisTransaction({
  orderId,
  amount,
  keterangan,
  callbackUrl,
}: {
  orderId: string
  amount: number
  keterangan: string
  callbackUrl?: string
}) {
  const res = await fetch(`${KLIKQRIS_BASE}/qris/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.KLIKQRIS_API_KEY!,
      'id_merchant': process.env.KLIKQRIS_MERCHANT_ID!,
    },
    body: JSON.stringify({
      order_id: orderId,
      amount,
      id_merchant: process.env.KLIKQRIS_MERCHANT_ID!,
      keterangan,
      callback_url: callbackUrl || process.env.KLIKQRIS_CALLBACK_URL,
    }),
  })
  return res.json()
}

export async function checkQrisStatus(orderId: string) {
  const res = await fetch(`${KLIKQRIS_BASE}/qris/status/${orderId}`, {
    headers: {
      'x-api-key': process.env.KLIKQRIS_API_KEY!,
      'id_merchant': process.env.KLIKQRIS_MERCHANT_ID!,
    },
  })
  return res.json()
}

// Package config
export const PACKAGES = {
  CERIA: { name: '🌸 Ceria', price: 10000, duration: 15, description: 'Cocok untuk selfie cepat' },
  SERU: { name: '🌈 Seru', price: 15000, duration: 20, description: 'Lebih santai' },
  PARTY: { name: '🎉 Party', price: 25000, duration: 30, description: 'Foto sepuasnya setengah jam' },
  VIP: { name: '🎪 VIP', price: 50000, duration: 60, description: 'Sesi panjang, unlimited foto' },
} as const

export type PackageKey = keyof typeof PACKAGES
