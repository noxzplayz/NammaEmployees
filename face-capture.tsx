"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, CheckCircle, Loader2, AlertCircle, RotateCcw } from "lucide-react"

interface FaceCaptureProps {
  onFaceCaptured: (faceData: string) => void
  onCancel: () => void
}

export default function FaceCapture({ onFaceCaptured, onCancel }: FaceCaptureProps) {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [captureCount, setCaptureCount] = useState(0)
  const [capturedImages, setCapturedImages] = useState<string[]>([])

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const requiredCaptures = 3 // Require 3 face captures for better recognition

  useEffect(() => {
    startCamera()
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

  const handleCapture = async () => {
    if (!isCameraActive) return

    setIsCapturing(true)

    try {
      // Simulate face detection processing
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const imageData = captureFrame()
      if (imageData) {
        const newCapturedImages = [...capturedImages, imageData]
        setCapturedImages(newCapturedImages)
        setCaptureCount(captureCount + 1)
        setCapturedImage(imageData)

        if (captureCount + 1 >= requiredCaptures) {
          // Process all captured images into face data
          const faceData = JSON.stringify({
            images: newCapturedImages,
            timestamp: Date.now(),
            captureCount: requiredCaptures,
          })
          onFaceCaptured(faceData)
        }
      }
    } catch (error) {
      console.error("Capture error:", error)
    } finally {
      setIsCapturing(false)
    }
  }

  const resetCapture = () => {
    setCapturedImages([])
    setCaptureCount(0)
    setCapturedImage(null)
  }

  return (
    <div className="space-y-6">
      {cameraError && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{cameraError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Camera className="h-5 w-5" />
            Face Enrollment
          </CardTitle>
          <CardDescription>
            Capture {requiredCaptures} clear photos of your face for enrollment ({captureCount}/{requiredCaptures}{" "}
            completed)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Camera View */}
          <div className="relative mx-auto w-full max-w-md aspect-[4/3] bg-gray-900 rounded-2xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover ${isCameraActive ? "block" : "hidden"}`}
            />

            <canvas ref={canvasRef} className="hidden" />

            {!isCameraActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-300">Starting camera...</p>
                </div>
              </div>
            )}

            {isCapturing && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-600/20">
                <div className="text-center text-white">
                  <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-blue-400" />
                  <p className="text-blue-200">Capturing...</p>
                </div>
              </div>
            )}

            {/* Face detection frame */}
            {isCameraActive && (
              <>
                <div className="absolute inset-4 border-2 border-dashed border-blue-400/50 rounded-lg"></div>
                <div className="absolute top-6 left-6 w-4 h-4 border-l-2 border-t-2 border-blue-400"></div>
                <div className="absolute top-6 right-6 w-4 h-4 border-r-2 border-t-2 border-blue-400"></div>
                <div className="absolute bottom-6 left-6 w-4 h-4 border-l-2 border-b-2 border-blue-400"></div>
                <div className="absolute bottom-6 right-6 w-4 h-4 border-r-2 border-b-2 border-blue-400"></div>
              </>
            )}
          </div>

          {/* Captured Images Preview */}
          {capturedImages.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 text-center">Captured Images:</h4>
              <div className="flex gap-2 justify-center flex-wrap">
                {capturedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Capture ${index + 1}`}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded border-2 border-green-400"
                    />
                    <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 text-green-600 bg-white rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {captureCount < requiredCaptures && (
              <Button
                onClick={handleCapture}
                disabled={!isCameraActive || isCapturing}
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                size="lg"
              >
                {isCapturing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Capturing...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    Capture Face ({captureCount + 1}/{requiredCaptures})
                  </>
                )}
              </Button>
            )}

            {captureCount > 0 && captureCount < requiredCaptures && (
              <Button onClick={resetCapture} variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            )}

            <Button onClick={onCancel} variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
              Cancel
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Instructions:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Position your face clearly within the frame</li>
              <li>• Ensure good lighting on your face</li>
              <li>• Look directly at the camera</li>
              <li>• Capture {requiredCaptures} different angles for better recognition</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
