"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Progress } from "@/components/ui/progress"
import { Clock, CalendarIcon, TrendingUp, CheckCircle, XCircle, MapPin, Timer, Award, BarChart3 } from "lucide-react"

export default function AttendancePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())

  // Update time every second
  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  })

  const handleCheckIn = () => {
    setIsCheckedIn(true)
  }

  const handleCheckOut = () => {
    setIsCheckedIn(false)
  }

  const attendanceData = [
    { date: "2024-01-29", status: "present", checkIn: "09:15", checkOut: "18:30" },
    { date: "2024-01-28", status: "present", checkIn: "09:00", checkOut: "18:15" },
    { date: "2024-01-27", status: "absent", checkIn: "-", checkOut: "-" },
    { date: "2024-01-26", status: "present", checkIn: "09:30", checkOut: "18:45" },
    { date: "2024-01-25", status: "present", checkIn: "08:45", checkOut: "18:00" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
              <AvatarImage src="/placeholder.svg?height=64&width=64&text=JD" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, John Doe</h1>
              <p className="text-gray-600">Software Engineer • Engineering Team</p>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">San Francisco Office</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono font-bold text-gray-900">{currentTime}</div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-white/20 p-3">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {isCheckedIn ? "You're checked in" : "Ready to start your day?"}
                  </h3>
                  <p className="text-blue-100">{isCheckedIn ? "Checked in at 09:15 AM" : "Click below to check in"}</p>
                </div>
              </div>
              <div className="flex gap-3">
                {!isCheckedIn ? (
                  <Button
                    onClick={handleCheckIn}
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8"
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Check In
                  </Button>
                ) : (
                  <Button
                    onClick={handleCheckOut}
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 bg-transparent"
                  >
                    <XCircle className="mr-2 h-5 w-5" />
                    Check Out
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Stats Cards */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-100 p-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">22/23</p>
                  <p className="text-xs text-green-600">95.7% attendance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-100 p-3">
                  <Timer className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Hours</p>
                  <p className="text-2xl font-bold text-gray-900">8.5h</p>
                  <p className="text-xs text-blue-600">+0.5h from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-purple-100 p-3">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Streak</p>
                  <p className="text-2xl font-bold text-gray-900">12 days</p>
                  <p className="text-xs text-purple-600">Personal best!</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-orange-100 p-3">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Late Days</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                  <p className="text-xs text-orange-600">This month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <Card className="border-0 shadow-lg lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Attendance Calendar
              </CardTitle>
              <CardDescription>Track your monthly attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border-0" />
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-600">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-gray-600">Late</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Attendance</CardTitle>
              <CardDescription>Your attendance history for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendanceData.map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          record.status === "present" ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(record.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-gray-500">{record.status === "present" ? "Present" : "Absent"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {record.checkIn} - {record.checkOut}
                      </p>
                      {record.status === "present" && (
                        <Badge variant="secondary" className="text-xs">
                          {record.checkIn !== "-" ? "8h 15m" : "-"}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Progress */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Monthly Progress</CardTitle>
            <CardDescription>Your attendance goal for January 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Attendance Rate</span>
                <span className="text-sm font-bold text-gray-900">22/23 days (95.7%)</span>
              </div>
              <Progress value={95.7} className="h-3" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Goal: 90%</span>
                <span className="text-green-600 font-medium">Excellent! 🎉</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
