import React from 'react'
import Header from './Header'
import CartOverview from "../features/cart/CartOverview"
import { Outlet } from 'react-router-dom'

export default function AppLayout({ children }) {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>

      <CartOverview />
    </div>
  )
}
