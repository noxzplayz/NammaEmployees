"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { io, Socket } from "socket.io-client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  UserPlus,
  Edit,
  Trash2,
  Search,
  Download,
  Clock,
  TrendingUp,
  UserCheck,
  LogOut,
  Camera,
} from "lucide-react"
import FaceCapture from "./face-capture"

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
  workingHours: {
    startTime: string
    endTime: string
    breakDuration: number // in minutes
    workDays: string[] // ["monday", "tuesday", etc.]
  }
}

interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  checkIn: string
  checkOut: string
  status: "present" | "absent" | "late"
  totalHours: string
}

interface AdminPanelProps {
  onLogout: () => void
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [showFaceCapture, setShowFaceCapture] = useState(false)
  const [pendingEmployeeData, setPendingEmployeeData] = useState<Partial<Employee> | null>(null)

  const [employees, setEmployees] = useState<Employee[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])

  const [socket, setSocket] = useState<Socket | null>(null)

  // Initialize socket connection and in-memory data on mount
  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:4000")
    setSocket(newSocket)

    // Initialize in-memory data
    let inMemoryEmployees: Employee[] = []
    let inMemoryAttendanceRecords: AttendanceRecord[] = []

    // Listen for client requests to get data
    newSocket.on("request-data", (role) => {
      if (role === "client") {
        newSocket.emit("update-action", { type: "employees", payload: inMemoryEmployees })
        newSocket.emit("update-action", { type: "attendanceRecords", payload: inMemoryAttendanceRecords })
      }
    })

    // Listen for admin actions to update data
    newSocket.on("admin-action", (data) => {
      if (data.type === "employees") {
        inMemoryEmployees = data.payload
        setEmployees(inMemoryEmployees)
        // Broadcast to clients - removed from client side
        // Server handles broadcasting
      } else if (data.type === "attendanceRecords") {
        inMemoryAttendanceRecords = data.payload
        setAttendanceRecords(inMemoryAttendanceRecords)
        // Broadcast to clients - removed from client side
        // Server handles broadcasting
      }
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  // Emit admin actions on employees change
  useEffect(() => {
    if (socket) {
      socket.emit("admin-action", { type: "employees", payload: employees })
    }
  }, [employees, socket])

  const handleAddEmployee = (employeeData: Partial<Employee>) => {
    setPendingEmployeeData(employeeData)
    setShowFaceCapture(true)
    setIsAddEmployeeOpen(false)
  }
  
  // Emit admin actions on attendanceRecords change
  useEffect(() => {
    if (socket) {
      socket.emit("admin-action", { type: "attendanceRecords", payload: attendanceRecords })
    }
  }, [attendanceRecords, socket])

  const handleFaceCaptured = (faceData: string) => {
    if (pendingEmployeeData) {
      const newEmployee: Employee = {
        id: `EMP${String(employees.length + 1).padStart(3, "0")}`,
        name: pendingEmployeeData.name || "",
        email: pendingEmployeeData.email || "",
        department: pendingEmployeeData.department || "",
        position: pendingEmployeeData.position || "",
        joinDate: new Date().toISOString().split("T")[0],
        status: "active",
        avatar: `/placeholder.svg?height=40&width=40&text=${
          pendingEmployeeData.name
            ?.split(" ")
            .map((n) => n[0])
            .join("") || "NA"
        }`,
        faceData: faceData,
        workingHours: {
          startTime: "09:00",
          endTime: "18:00",
          breakDuration: 60,
          workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        },
      }
      setEmployees([...employees, newEmployee])
    }
    setShowFaceCapture(false)
    setPendingEmployeeData(null)
  }

  const handleCancelFaceCapture = () => {
    setShowFaceCapture(false)
    setPendingEmployeeData(null)
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
  }

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployees(employees.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp)))
    setEditingEmployee(null)
  }

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(employees.filter((emp) => emp.id !== employeeId))
    // Also remove related attendance records
    setAttendanceRecords(attendanceRecords.filter((record) => record.employeeId !== employeeId))
  }

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const departments = [...new Set(employees.map((emp) => emp.department))]

  const todayAttendance = attendanceRecords.filter((record) => record.date === new Date().toISOString().split("T")[0])
  const presentToday = todayAttendance.filter((record) => record.status === "present").length
  const lateToday = todayAttendance.filter((record) => record.status === "late").length

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        {/* Face Capture Modal */}
        {showFaceCapture && (
          <Dialog open={showFaceCapture} onOpenChange={() => setShowFaceCapture(false)}>
            <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Capture Employee Face</DialogTitle>
                <DialogDescription className="text-sm">
                  Capture face data for {pendingEmployeeData?.name} to enable face recognition attendance.
                </DialogDescription>
              </DialogHeader>
              <FaceCapture onFaceCaptured={handleFaceCaptured} onCancel={handleCancelFaceCapture} />
            </DialogContent>
          </Dialog>
        )}

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage employees and attendance records</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="gap-2 bg-transparent text-sm sm:text-base">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 text-sm sm:text-base">
                  <UserPlus className="h-4 w-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription className="text-sm">
                    Enter employee details. Face capture will be required after submitting the form.
                  </DialogDescription>
                </DialogHeader>
                <AddEmployeeForm onSubmit={handleAddEmployee} />
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              onClick={onLogout}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent text-sm sm:text-base"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="rounded-full bg-blue-100 p-2 sm:p-3 flex-shrink-0">
                      <Users className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Employees</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">{employees.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-green-100 p-3">
                      <UserCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Present Today</p>
                      <p className="text-2xl font-bold text-gray-900">{presentToday}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-orange-100 p-3">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Late Today</p>
                      <p className="text-2xl font-bold text-gray-900">{lateToday}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-purple-100 p-3">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {employees.length > 0 ? Math.round((presentToday / employees.length) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Attendance</CardTitle>
                <CardDescription>Latest check-ins and check-outs</CardDescription>
              </CardHeader>
              <CardContent>
                {attendanceRecords.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No attendance records yet</p>
                    <p className="text-sm">Records will appear here when employees use face scanning</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {attendanceRecords
                      .slice(-5)
                      .reverse()
                      .map((record) => (
                        <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage
                                src={`/placeholder.svg?height=40&width=40&text=${record.employeeName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}`}
                              />
                              <AvatarFallback>
                                {record.employeeName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{record.employeeName}</p>
                              <p className="text-sm text-gray-500">{record.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                record.status === "present"
                                  ? "default"
                                  : record.status === "late"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {record.status}
                            </Badge>
                            <p className="text-sm text-gray-500 mt-1">
                              {record.checkIn} - {record.checkOut}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Employees Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Employee Management</CardTitle>
                <CardDescription className="text-sm">
                  Manage your organization's employees with face recognition enrollment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {employees.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Users className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No employees enrolled</h3>
                    <p className="text-gray-500 mb-4 text-sm sm:text-base px-4">
                      Add your first employee to get started with face recognition attendance.
                    </p>
                    <Button onClick={() => setIsAddEmployeeOpen(true)} className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Add First Employee
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[200px]">Employee</TableHead>
                          <TableHead className="hidden sm:table-cell">Department</TableHead>
                          <TableHead className="hidden md:table-cell">Position</TableHead>
                          <TableHead className="hidden lg:table-cell">Join Date</TableHead>
                          <TableHead className="hidden lg:table-cell">Working Hours</TableHead>
                          <TableHead className="hidden sm:table-cell">Face Data</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEmployees.map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                                  <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs sm:text-sm">
                                    {employee.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="font-medium text-sm sm:text-base truncate">{employee.name}</p>
                                  <p className="text-xs sm:text-sm text-gray-500 truncate">{employee.email}</p>
                                  <div className="sm:hidden text-xs text-gray-500 mt-1">
                                    {employee.department} • {employee.position}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-sm">{employee.department}</TableCell>
                            <TableCell className="hidden md:table-cell text-sm">{employee.position}</TableCell>
                            <TableCell className="hidden lg:table-cell text-sm">
                              {new Date(employee.joinDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-sm">
                              <div className="text-xs">
                                <div>
                                  {employee.workingHours?.startTime || "09:00"} -{" "}
                                  {employee.workingHours?.endTime || "18:00"}
                                </div>
                                <div className="text-gray-500">
                                  {employee.workingHours?.breakDuration || 60}min break
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <div className="flex items-center gap-2">
                                <Camera className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                  Enrolled
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={employee.status === "active" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {employee.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1 sm:gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditEmployee(employee)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteEmployee(employee.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Records</CardTitle>
                <CardDescription>View and manage attendance data from face recognition scans</CardDescription>
              </CardHeader>
              <CardContent>
                {attendanceRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records</h3>
                    <p className="text-gray-500">
                      Attendance records will appear here when employees use face scanning.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Total Hours</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceRecords
                        .slice()
                        .reverse()
                        .map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage
                                    src={`/placeholder.svg?height=32&width=32&text=${record.employeeName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}`}
                                  />
                                  <AvatarFallback>
                                    {record.employeeName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{record.employeeName}</span>
                              </div>
                            </TableCell>
                            <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                            <TableCell>{record.checkIn}</TableCell>
                            <TableCell>{record.checkOut}</TableCell>
                            <TableCell>{record.totalHours}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  record.status === "present"
                                    ? "default"
                                    : record.status === "late"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {record.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Employee Dialog */}
        {editingEmployee && (
          <Dialog open={!!editingEmployee} onOpenChange={() => setEditingEmployee(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Employee</DialogTitle>
                <DialogDescription>Update employee information.</DialogDescription>
              </DialogHeader>
              <EditEmployeeForm
                employee={editingEmployee}
                onSubmit={handleUpdateEmployee}
                onCancel={() => setEditingEmployee(null)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

// Add Employee Form Component
function AddEmployeeForm({ onSubmit }: { onSubmit: (data: Partial<Employee>) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    workingHours: {
      startTime: "09:00",
      endTime: "18:00",
      breakDuration: 60,
      workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    },
  })

  const handleWorkDayToggle = (day: string) => {
    const updatedDays = formData.workingHours.workDays.includes(day)
      ? formData.workingHours.workDays.filter((d) => d !== day)
      : [...formData.workingHours.workDays, day]

    setFormData({
      ...formData,
      workingHours: {
        ...formData.workingHours,
        workDays: updatedDays,
      },
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      name: "",
      email: "",
      department: "",
      position: "",
      workingHours: {
        startTime: "09:00",
        endTime: "18:00",
        breakDuration: 60,
        workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      },
    })
  }

  const weekDays = [
    { key: "monday", label: "Mon" },
    { key: "tuesday", label: "Tue" },
    { key: "wednesday", label: "Wed" },
    { key: "thursday", label: "Thu" },
    { key: "friday", label: "Fri" },
    { key: "saturday", label: "Sat" },
    { key: "sunday", label: "Sun" },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="position">Position</Label>
        <Input
          id="position"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          required
        />
      </div>

      {/* Working Hours Section */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-3">Working Hours</h4>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.workingHours.startTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  workingHours: { ...formData.workingHours, startTime: e.target.value },
                })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={formData.workingHours.endTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  workingHours: { ...formData.workingHours, endTime: e.target.value },
                })
              }
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
          <Select
            value={formData.workingHours.breakDuration.toString()}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                workingHours: { ...formData.workingHours, breakDuration: Number.parseInt(value) },
              })
            }
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

        <div>
          <Label>Working Days</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {weekDays.map((day) => (
              <Button
                key={day.key}
                type="button"
                variant={formData.workingHours.workDays.includes(day.key) ? "default" : "outline"}
                size="sm"
                onClick={() => handleWorkDayToggle(day.key)}
                className="text-xs"
              >
                {day.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" className="gap-2">
          <Camera className="h-4 w-4" />
          Continue to Face Capture
        </Button>
      </DialogFooter>
    </form>
  )
}

// Edit Employee Form Component
function EditEmployeeForm({
  employee,
  onSubmit,
  onCancel,
}: {
  employee: Employee
  onSubmit: (data: Employee) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    ...employee,
    workingHours: employee.workingHours || {
      startTime: "09:00",
      endTime: "18:00",
      breakDuration: 60,
      workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    },
  })

  const handleWorkDayToggle = (day: string) => {
    const updatedDays = formData.workingHours.workDays.includes(day)
      ? formData.workingHours.workDays.filter((d) => d !== day)
      : [...formData.workingHours.workDays, day]

    setFormData({
      ...formData,
      workingHours: {
        ...formData.workingHours,
        workDays: updatedDays,
      },
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const weekDays = [
    { key: "monday", label: "Mon" },
    { key: "tuesday", label: "Tue" },
    { key: "wednesday", label: "Wed" },
    { key: "thursday", label: "Thu" },
    { key: "friday", label: "Fri" },
    { key: "saturday", label: "Sat" },
    { key: "sunday", label: "Sun" },
  ]

  const calculateWorkHours = () => {
    const start = new Date(`2000-01-01 ${formData.workingHours.startTime}`)
    const end = new Date(`2000-01-01 ${formData.workingHours.endTime}`)
    const diffMs = end.getTime() - start.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    return diffHours
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div>
        <Label htmlFor="edit-name">Full Name</Label>
        <Input
          id="edit-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="edit-email">Email</Label>
        <Input
          id="edit-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="edit-department">Department</Label>
        <Input
          id="edit-department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="edit-position">Position</Label>
        <Input
          id="edit-position"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="edit-status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Working Hours Section */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-3">Working Hours</h4>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="edit-startTime">Start Time</Label>
            <Input
              id="edit-startTime"
              type="time"
              value={formData.workingHours.startTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  workingHours: { ...formData.workingHours, startTime: e.target.value },
                })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-endTime">End Time</Label>
            <Input
              id="edit-endTime"
              type="time"
              value={formData.workingHours.endTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  workingHours: { ...formData.workingHours, endTime: e.target.value },
                })
              }
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="edit-breakDuration">Break Duration (minutes)</Label>
          <Select
            value={formData.workingHours.breakDuration.toString()}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                workingHours: { ...formData.workingHours, breakDuration: Number.parseInt(value) },
              })
            }
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

        <div className="mb-4">
          <Label>Working Days</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {weekDays.map((day) => (
              <Button
                key={day.key}
                type="button"
                variant={formData.workingHours.workDays.includes(day.key) ? "default" : "outline"}
                size="sm"
                onClick={() => handleWorkDayToggle(day.key)}
                className="text-xs"
              >
                {day.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-800">
            <p>
              <strong>Total work hours:</strong> {calculateWorkHours()} hours/day
            </p>
            <p>
              <strong>Break time:</strong> {formData.workingHours.breakDuration} minutes
            </p>
            <p>
              <strong>Working days:</strong> {formData.workingHours.workDays.length} days/week
            </p>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Update Employee</Button>
      </DialogFooter>
    </form>
  )
}
