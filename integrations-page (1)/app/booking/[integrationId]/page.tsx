"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { integrations } from "@/app/data/integrations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function BookingPage({ params }: { params: { integrationId: string } }) {
  const router = useRouter()
  const [integration, setIntegration] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: null as Date | null,
  })
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
  })

  useEffect(() => {
    const foundIntegration = integrations.find((i) => i.id === params.integrationId)
    if (foundIntegration) {
      setIntegration(foundIntegration)
    } else {
      router.push("/integrations")
    }
  }, [params.integrationId, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, date }))
    if (errors.date) {
      setErrors((prev) => ({ ...prev, date: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      name: formData.name ? "" : "Name is required",
      phone: formData.phone ? "" : "Phone number is required",
      email: formData.email ? "" : "Email is required",
      date: formData.date ? "" : "Date is required",
    }

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // In a real application, you would submit the form data to your backend
      alert("Booking submitted successfully!")
      router.push("/integrations")
    }
  }

  if (!integration) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  const Icon = integration.icon

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${integration.color}20` }}
            >
              <Icon className="w-5 h-5" style={{ color: integration.color }} />
            </div>
            <div>
              <CardTitle>Book {integration.name}</CardTitle>
              <CardDescription>Fill out the form below to book this integration</CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date for Booking *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground",
                      errors.date && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : <span>Select a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={handleDateChange}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/integrations")}>
              Cancel
            </Button>
            <Button type="submit">Submit Booking</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

