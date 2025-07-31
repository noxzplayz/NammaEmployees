"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FaceScanPage from "../face-scan-page"
import AdminPanel from "../admin-panel"
import AdminLogin from "../admin-login"

export default function Page() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  const handleAdminLogin = (success: boolean) => {
    setIsAdminLoggedIn(success)
  }

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false)
  }

  return (
    <div className="min-h-screen">
      <Tabs defaultValue="face-scan" className="w-full">
        <div className="border-b bg-white shadow-sm sticky top-0 z-10">
          <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
            <TabsList className="grid w-full max-w-sm grid-cols-2 my-2 sm:my-3">
              <TabsTrigger value="face-scan" className="text-xs sm:text-sm">
                Face Scan
              </TabsTrigger>
              <TabsTrigger value="admin" className="text-xs sm:text-sm">
                Admin Panel
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="face-scan" className="mt-0">
          <FaceScanPage />
        </TabsContent>

        <TabsContent value="admin" className="mt-0">
          {isAdminLoggedIn ? <AdminPanel onLogout={handleAdminLogout} /> : <AdminLogin onLogin={handleAdminLogin} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}
