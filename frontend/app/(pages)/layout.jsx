"use client"

import BottomNavbar from "../../component/bottomNavbar.jsx";

const Layout = ({ children }) => {
  return (
    <div className="h-screen bg-white">
      {children}
      <BottomNavbar />
    </div>
  )
}

export default Layout;