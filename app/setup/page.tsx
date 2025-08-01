"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function SetupPage() {
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()

  const handleSelectRole = (selectedRole: string) => {
    setRole(selectedRole)
    // Save role in sessionStorage for simplicity
    sessionStorage.setItem("userRole", selectedRole)
    // Redirect to appropriate page
    if (selectedRole === "admin") {
      router.push("/admin-panel")
    } else {
      router.push("/face-scan-page")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6">Select Your Role</h1>
      <div className="flex gap-6">
        <Button onClick={() => handleSelectRole("admin")} className="px-8 py-4 text-lg">
          Admin (Host)
        </Button>
        <Button onClick={() => handleSelectRole("client")} className="px-8 py-4 text-lg">
          Client
        </Button>
      </div>
    </div>
  )
}
