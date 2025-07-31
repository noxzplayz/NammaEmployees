"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, Save, Settings } from "lucide-react"

interface WorkSettings {
  startTime: string
  endTime: string
  breakDuration: number // in minutes
  overtimeThreshold: number // in minutes after end time
  lateThreshold: number // in minutes after start time
  earlyThreshold: number // in minutes before start time
}

interface WorkSettingsProps {
  onSettingsChange: (settings: WorkSettings) => void
}

export default function WorkSettingsComponent({ onSettingsChange }: WorkSettingsProps) {
  const [settings, setSettings] = useState<WorkSettings>({
    startTime: "09:00",
    endTime: "18:00",
    breakDuration: 60,
    overtimeThreshold: 30,
    lateThreshold: 15,
    earlyThreshold: 30,
  })

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem("workSettings")
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings)
      setSettings(parsed)
      onSettingsChange(parsed)
    }
  }, [onSettingsChange])

  const handleSave = () => {
    localStorage.setItem("workSettings", JSON.stringify(settings))
    onSettingsChange(settings)

    // Play success sound
    const audio = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApG",
    )
    audio.play().catch(() => {})
  }

  const calculateWorkHours = () => {
    const start = new Date(`2000-01-01 ${settings.startTime}`)
    const end = new Date(`2000-01-01 ${settings.endTime}`)
    const diffMs = end.getTime() - start.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    return diffHours
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Work Hours Settings
        </CardTitle>
        <CardDescription>Configure work hours, break time, and attendance thresholds</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Work Hours */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Work Schedule</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={settings.startTime}
                  onChange={(e) => setSettings({ ...settings, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={settings.endTime}
                  onChange={(e) => setSettings({ ...settings, endTime: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Total work hours: {calculateWorkHours()} hours</span>
            </div>
          </div>

          {/* Break Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Break Settings</h4>
            <div>
              <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
              <Select
                value={settings.breakDuration.toString()}
                onValueChange={(value) => setSettings({ ...settings, breakDuration: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-600">Employees can take breaks anytime during work hours</div>
          </div>
        </div>

        {/* Thresholds */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Attendance Thresholds</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="lateThreshold">Late Threshold (minutes)</Label>
              <Select
                value={settings.lateThreshold.toString()}
                onValueChange={(value) => setSettings({ ...settings, lateThreshold: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="earlyThreshold">Early Arrival (minutes)</Label>
              <Select
                value={settings.earlyThreshold.toString()}
                onValueChange={(value) => setSettings({ ...settings, earlyThreshold: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="overtimeThreshold">Overtime Threshold (minutes)</Label>
              <Select
                value={settings.overtimeThreshold.toString()}
                onValueChange={(value) => setSettings({ ...settings, overtimeThreshold: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Current Settings Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-3">Current Settings Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <Badge variant="outline" className="mb-1">
                Work Hours
              </Badge>
              <p className="text-blue-800">
                {settings.startTime} - {settings.endTime}
              </p>
            </div>
            <div>
              <Badge variant="outline" className="mb-1">
                Break Time
              </Badge>
              <p className="text-blue-800">{settings.breakDuration} minutes</p>
            </div>
            <div>
              <Badge variant="outline" className="mb-1">
                Late After
              </Badge>
              <p className="text-blue-800">{settings.lateThreshold} minutes</p>
            </div>
            <div>
              <Badge variant="outline" className="mb-1">
                Overtime After
              </Badge>
              <p className="text-blue-800">{settings.overtimeThreshold} minutes</p>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full gap-2">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </CardContent>
    </Card>
  )
}
