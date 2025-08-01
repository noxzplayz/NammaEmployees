"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { io, Socket } from "socket.io-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, CheckCircle, XCircle, Scan, User, Clock, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  joinDate: string
  status: "active" | "inactive"
  avatar: string
  faceData: string
  workingHours?: {
    startTime: string
    endTime: string
    breakDuration: number
    workDays: string[]
  }
}

export default function FaceScanPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<{
    success: boolean
    employee?: Employee
    action?: "check-in" | "check-out"
    time?: string
    attendanceStatus?: {
      status: string
      message: string
    }
  } | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())
  const [employees, setEmployees] = useState<Employee[]>([])

  const [socket, setSocket] = useState<Socket | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Load employees from localStorage
  useEffect(() => {
    const storedEmployees = localStorage.getItem("employees")
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees))
    }

    // Initialize socket connection
    const newSocket = io("http://localhost:4000")
    setSocket(newSocket)

    // Listen for update-action events from server
    newSocket.on("update-action", (data) => {
      if (data.type === "employees") {
        setEmployees(data.payload)
      }
      // Could add attendanceRecords update here if needed
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      setCameraError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsCameraActive(true)
      }
    } catch (error) {
      console.error("Camera access error:", error)
      setCameraError("Unable to access camera. Please ensure camera permissions are granted.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)
  }

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0)
        return canvas.toDataURL("image/jpeg", 0.8)
      }
    }
    return null
  }

  const detectFace = async (imageData: string): Promise<boolean> => {
    // Simulate face detection processing
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock face detection - in real app, you'd use face-api.js or similar
        const hasValidFace = Math.random() > 0.2 // 80% success rate
        resolve(hasValidFace)
      }, 1000)
    })
  }

  const recognizeFace = async (imageData: string): Promise<Employee | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (employees.length === 0) {
          resolve(null)
          return
        }

        const recognitionSuccess = Math.random() > 0.3 // 70% recognition rate
        if (recognitionSuccess) {
          const randomEmployee = employees[Math.floor(Math.random() * employees.length)]
          resolve(randomEmployee)
        } else {
          resolve(null)
        }
      }, 1500)
    })
  }

  const checkAttendanceStatus = (employee: Employee) => {
    const now = new Date()
    const currentTime = now.toTimeString().slice(0, 5) // HH:MM format
    const currentDay = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()

    const workingHours = employee.workingHours || {
      startTime: "09:00",
      endTime: "18:00",
      breakDuration: 60,
      workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    }

    // Check if today is a working day
    if (!workingHours.workDays.includes(currentDay)) {
      return {
        status: "non-working-day",
        message: "Today is not a working day for this employee",
      }
    }

    const startTime = workingHours.startTime
    const endTime = workingHours.endTime

    // Convert times to minutes for comparison
    const currentMinutes = Number.parseInt(currentTime.split(":")[0]) * 60 + Number.parseInt(currentTime.split(":")[1])
    const startMinutes = Number.parseInt(startTime.split(":")[0]) * 60 + Number.parseInt(startTime.split(":")[1])
    const endMinutes = Number.parseInt(endTime.split(":")[0]) * 60 + Number.parseInt(endTime.split(":")[1])

    // Check attendance status
    if (currentMinutes < startMinutes - 30) {
      // 30 minutes early threshold
      return {
        status: "early",
        message: `Early arrival - work starts at ${startTime}`,
      }
    } else if (currentMinutes > startMinutes + 15) {
      // 15 minutes late threshold
      return {
        status: "late",
        message: `Late arrival - work started at ${startTime}`,
      }
    } else if (currentMinutes > endMinutes + 30) {
      // 30 minutes overtime threshold
      return {
        status: "overtime",
        message: `Working overtime - work ends at ${endTime}`,
      }
    } else {
      return {
        status: "on-time",
        message: "On time",
      }
    }
  }

  const startScanning = async () => {
    if (!isCameraActive) {
      await startCamera()
      return
    }

    if (employees.length === 0) {
      setCameraError("No employees enrolled. Please add employees through the admin panel first.")
      return
    }

    setIsScanning(true)
    setScanResult(null)

    try {
      // Capture frame from video
      const imageData = captureFrame()
      if (!imageData) {
        throw new Error("Failed to capture image")
      }

      // Step 1: Detect if there's a face in the image
      const faceDetected = await detectFace(imageData)
      if (!faceDetected) {
        setScanResult({
          success: false,
        })
        setIsScanning(false)
        return
      }

      // Step 2: Try to recognize the face against enrolled employees
      const recognizedEmployee = await recognizeFace(imageData)
      if (recognizedEmployee) {
        const attendanceStatus = checkAttendanceStatus(recognizedEmployee)
        const isCurrentlyCheckedIn = Math.random() > 0.5

        setScanResult({
          success: true,
          employee: recognizedEmployee,
          action: isCurrentlyCheckedIn ? "check-out" : "check-in",
          time: new Date().toLocaleTimeString(),
          attendanceStatus: attendanceStatus,
        })

        // Create notification for admin if needed
        if (
          attendanceStatus.status === "late" ||
          attendanceStatus.status === "early" ||
          attendanceStatus.status === "overtime"
        ) {
          const notification = {
            id: `NOTIF${Date.now()}`,
            type: attendanceStatus.status as "late" | "early" | "overtime",
            title: `${attendanceStatus.status.charAt(0).toUpperCase() + attendanceStatus.status.slice(1)} Alert`,
            message: `${recognizedEmployee.name} - ${attendanceStatus.message}`,
            employeeName: recognizedEmployee.name,
            employeeId: recognizedEmployee.id,
            timestamp: new Date().toISOString(),
            read: false,
            actionRequired: attendanceStatus.status === "overtime",
          }

          // Dispatch notification event
          window.dispatchEvent(new CustomEvent("newNotification", { detail: notification }))
        }

        // Store attendance record with individual working hours
        const attendanceRecord = {
          id: `ATT${Date.now()}`,
          employeeId: recognizedEmployee.id,
          employeeName: recognizedEmployee.name,
          date: new Date().toISOString().split("T")[0],
          checkIn: isCurrentlyCheckedIn ? "-" : new Date().toLocaleTimeString(),
          checkOut: isCurrentlyCheckedIn ? new Date().toLocaleTimeString() : "-",
          status: attendanceStatus.status === "late" ? "late" : ("present" as const),
          totalHours: isCurrentlyCheckedIn ? "8h 00m" : "-",
          workingHours: recognizedEmployee.workingHours,
          attendanceStatus: attendanceStatus,
        }

        // Store in localStorage
        const existingRecords = JSON.parse(localStorage.getItem("attendanceRecords") || "[]")
        existingRecords.push(attendanceRecord)
        localStorage.setItem("attendanceRecords", JSON.stringify(existingRecords))
      } else {
        setScanResult({
          success: false,
        })
      }
    } catch (error) {
      console.error("Scanning error:", error)
      setScanResult({
        success: false,
      })
    } finally {
      setIsScanning(false)
    }
  }

  const resetScan = () => {
    setScanResult(null)
    setCameraError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-3 sm:p-4 lg:p-6">
      <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center text-white py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Face Recognition Attendance</h1>
          <p className="text-blue-200 text-sm sm:text-base">Secure and contactless attendance tracking</p>
          <div className="mt-4">
            <div className="text-xl sm:text-2xl font-mono font-bold">{currentTime}</div>
            <div className="text-xs sm:text-sm text-blue-200">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Employee Count Info */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{employees.length} Employees Enrolled</span>
              </div>
              {employees.length === 0 && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  No employees enrolled - Add employees in Admin Panel
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Camera Error Alert */}
        {cameraError && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{cameraError}</AlertDescription>
          </Alert>
        )}

        {/* Main Scanning Interface */}
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Camera className="h-6 w-6" />
              Face Recognition Scanner
            </CardTitle>
            <CardDescription>
              Position your face in the camera frame and click scan to record attendance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Camera/Scanning Area */}
            <div className="relative mx-auto w-full max-w-md aspect-[4/3] bg-gray-900 rounded-2xl overflow-hidden">
              {/* Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover ${isCameraActive ? "block" : "hidden"}`}
              />

              {/* Canvas for capturing frames */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Camera Inactive State */}
              {!isCameraActive && !isScanning && !scanResult && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-300">Click "Start Camera" to begin</p>
                  </div>
                </div>
              )}

              {/* Scanning Overlay */}
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-600/20">
                  <div className="text-center text-white">
                    <div className="relative">
                      <div className="w-32 h-32 border-4 border-blue-400 rounded-full animate-pulse mx-auto mb-4"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Scan className="h-8 w-8 text-blue-400 animate-spin" />
                      </div>
                    </div>
                    <p className="text-blue-200">Scanning face...</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Processing</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Result Overlay */}
              {scanResult && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  {scanResult.success ? (
                    <div className="text-center text-white">
                      <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-400" />
                      <p className="text-green-300">Recognition Successful!</p>
                    </div>
                  ) : (
                    <div className="text-center text-white">
                      <XCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
                      <p className="text-red-300">Face not recognized</p>
                    </div>
                  )}
                </div>
              )}

              {/* Scanning Frame Overlay */}
              {isCameraActive && (
                <>
                  <div className="absolute inset-4 border-2 border-dashed border-blue-400/50 rounded-xl"></div>
                  {/* Corner markers */}
                  <div className="absolute top-8 left-8 w-6 h-6 border-l-4 border-t-4 border-blue-400"></div>
                  <div className="absolute top-8 right-8 w-6 h-6 border-r-4 border-t-4 border-blue-400"></div>
                  <div className="absolute bottom-8 left-8 w-6 h-6 border-l-4 border-b-4 border-blue-400"></div>
                  <div className="absolute bottom-8 right-8 w-6 h-6 border-r-4 border-b-4 border-blue-400"></div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="text-center space-y-4">
              {!isCameraActive && !scanResult && (
                <Button
                  onClick={startCamera}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
                  disabled={employees.length === 0}
                >
                  <Camera className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Start Camera
                </Button>
              )}

              {isCameraActive && !scanResult && (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button
                    onClick={startScanning}
                    disabled={isScanning || employees.length === 0}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Scan className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        Scan Face
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    size="lg"
                    className="px-6 sm:px-8 py-3 text-base sm:text-lg bg-transparent"
                  >
                    Stop Camera
                  </Button>
                </div>
              )}

              {scanResult && (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button
                    onClick={resetScan}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 px-6 sm:px-8 py-3 text-base sm:text-lg"
                  >
                    Scan Again
                  </Button>
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    size="lg"
                    className="px-6 sm:px-8 py-3 text-base sm:text-lg bg-transparent"
                  >
                    Stop Camera
                  </Button>
                </div>
              )}
            </div>

            {/* Result Display */}
            {scanResult && scanResult.success && scanResult.employee && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                      <AvatarImage src={scanResult.employee.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-green-100 text-green-700 text-sm sm:text-base">
                        {scanResult.employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg sm:text-xl font-semibold text-green-900">
                        Welcome, {scanResult.employee.name}!
                      </h3>
                      <p className="text-green-700 text-sm sm:text-base">{scanResult.employee.department}</p>
                      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-2 justify-center sm:justify-start">
                        <Badge
                          variant={scanResult.action === "check-in" ? "default" : "secondary"}
                          className={`${scanResult.action === "check-in" ? "bg-green-600" : "bg-orange-600"} text-xs sm:text-sm`}
                        >
                          {scanResult.action === "check-in" ? "Checked In" : "Checked Out"}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-green-600">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          {scanResult.time}
                        </div>
                      </div>
                      {scanResult.attendanceStatus &&
                        scanResult.attendanceStatus.status !== "on-time" &&
                        scanResult.attendanceStatus.status !== "non-working-day" && (
                          <div className="mt-2 text-orange-700 text-sm">{scanResult.attendanceStatus.message}</div>
                        )}
                      {scanResult.attendanceStatus && scanResult.attendanceStatus.status === "non-working-day" && (
                        <div className="mt-2 text-gray-700 text-sm">{scanResult.attendanceStatus.message}</div>
                      )}
                    </div>
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            )}

            {scanResult && !scanResult.success && (
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-6 text-center">
                  <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Recognition Failed</h3>
                  <p className="text-red-700">
                    Face not recognized or no face detected. Please ensure you are enrolled in the system and try again.
                  </p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 p-2 mt-1 flex-shrink-0">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Position Yourself</h4>
                  <p className="text-gray-600">Center your face in the camera frame within the markers</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 p-2 mt-1 flex-shrink-0">
                  <Camera className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Good Lighting</h4>
                  <p className="text-gray-600">Ensure adequate lighting on your face for better recognition</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2 lg:col-span-1">
                <div className="rounded-full bg-blue-100 p-2 mt-1 flex-shrink-0">
                  <Scan className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Stay Still</h4>
                  <p className="text-gray-600">Keep still during the scanning process for accurate results</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
