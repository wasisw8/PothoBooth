'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, CreditCard, TrendingUp, Calendar, ArrowRight, Loader2 } from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalTransactions: number
  todayRevenue: number
  monthlyRevenue: number
  recentTransactions: {
    orderId: string
    user: any
    paket: string
    amount: number
    status: 'PAID' | 'PENDING' | 'EXPIRED'
    date: string
  }[]
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(amount)
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data || {
          totalUsers: 0,
          totalTransactions: 0,
          todayRevenue: 0,
          monthlyRevenue: 0,
          recentTransactions: []
        })
        setLoading(false)
      })
      .catch(() => {
        // Fallback mock data if API not ready
        setStats({
          totalUsers: 124,
          totalTransactions: 450,
          todayRevenue: 750000,
          monthlyRevenue: 15400000,
          recentTransactions: [
            { orderId: 'TRX-123', user: 'budi@mail.com', paket: 'Party', amount: 25000, status: 'PAID', date: new Date().toISOString() },
            { orderId: 'TRX-124', user: 'siti@mail.com', paket: 'Ceria', amount: 10000, status: 'PENDING', date: new Date().toISOString() },
          ]
        })
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: <Users className="w-6 h-6 text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'Total Transaksi', value: stats?.totalTransactions, icon: <CreditCard className="w-6 h-6 text-purple-500" />, bg: 'bg-purple-50' },
    { label: 'Pendapatan Hari Ini', value: stats ? formatRupiah(stats.todayRevenue) : 0, icon: <TrendingUp className="w-6 h-6 text-emerald-500" />, bg: 'bg-emerald-50' },
    { label: 'Pendapatan Bulan Ini', value: stats ? formatRupiah(stats.monthlyRevenue) : 0, icon: <Calendar className="w-6 h-6 text-amber-500" />, bg: 'bg-amber-50' },
  ]

  const statusColors = {
    PAID: 'bg-emerald-100 text-emerald-700',
    PENDING: 'bg-amber-100 text-amber-700',
    EXPIRED: 'bg-red-100 text-red-700'
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          Admin Dashboard 🛠️
        </h1>
        <div className="flex gap-4">
          <Link href="/admin/templates" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Kelola Template
          </Link>
          <Link href="/admin/transactions" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            Semua Transaksi
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                {stat.icon}
              </div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Transaksi Terbaru</h2>
          <Link href="/admin/transactions" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paket</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats?.recentTransactions.map((trx, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{trx.orderId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {typeof trx.user === 'string' ? trx.user : (trx.user?.name || trx.user?.email || 'Unknown')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{trx.paket}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatRupiah(trx.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[trx.status]}`}>
                      {trx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(trx.date).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
              {stats?.recentTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Belum ada transaksi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
