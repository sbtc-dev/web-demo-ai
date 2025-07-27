"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, User, Building2, Eye, EyeOff, Upload, Handshake, Star, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [accountType, setAccountType] = useState("individual")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    saudiNationalId: "",
    dateOfBirth: "",
    preferredLanguage: "english",
    password: "",
    confirmPassword: "",

    // Contact Details
    phoneNumber: "",
    alternatePhone: "",

    // National Address
    buildingNumber: "",
    streetName: "",
    district: "",
    city: "",
    postalCode: "",
    additionalNumber: "",

    // Business Info
    companyName: "",
    businessType: "",
    commercialRegistration: "",
    taxNumber: "",
    businessLicense: "",
    businessAddress: "",
    businessCity: "",
    businessDistrict: "",
    businessPostalCode: "",

    // Agreements
    termsAccepted: false,
    marketingConsent: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back to Home */}
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-600">
              Or{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                sign in to your existing account
              </Link>
            </p>
          </div>

          {/* Partner CTA Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Handshake className="w-6 h-6 mr-2" />
                  <h3 className="text-xl font-bold">Looking to become a supplier?</h3>
                </div>
                <p className="text-blue-100 mb-4">
                  Join our partner network and grow your business with SBTC's extensive distribution network
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    <span>Premium Benefits</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>Wide Network</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>Growth Support</span>
                  </div>
                </div>
              </div>
              <div className="ml-6">
                <Link href="/partner-registration">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Handshake className="w-5 h-5 mr-2" />
                    Become a Partner
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Account Type Selection */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Register as Customer</h2>
                <p className="text-gray-600">Fill in your information to create a new customer account</p>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Account Type *</Label>
                  <RadioGroup value={accountType} onValueChange={setAccountType} className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual" className="flex items-center cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Individual Account
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="business" id="business" />
                      <Label htmlFor="business" className="flex items-center cursor-pointer">
                        <Building2 className="w-4 h-4 mr-2" />
                        Business Account
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Form Tabs */}
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="contact">Contact Details</TabsTrigger>
                  <TabsTrigger value="address">National Address</TabsTrigger>
                  {accountType === "business" && <TabsTrigger value="business">Business Info</TabsTrigger>}
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                {/* Personal Info Tab */}
                <TabsContent value="personal" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="saudiNationalId">Saudi National ID *</Label>
                    <Input
                      id="saudiNationalId"
                      placeholder="1234567890"
                      value={formData.saudiNationalId}
                      onChange={(e) => handleInputChange("saudiNationalId", e.target.value)}
                      maxLength={10}
                      required
                    />
                    <p className="text-sm text-gray-500">10 digits starting with 1 or 2</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferredLanguage">Preferred Language</Label>
                      <Select onValueChange={(value) => handleInputChange("preferredLanguage", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="English" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">🇺🇸 English</SelectItem>
                          <SelectItem value="arabic">🇸🇦 العربية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Contact Details Tab */}
                <TabsContent value="contact" className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      placeholder="+966 50 123 4567"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alternatePhone">Alternate Phone Number</Label>
                    <Input
                      id="alternatePhone"
                      placeholder="+966 50 123 4567"
                      value={formData.alternatePhone}
                      onChange={(e) => handleInputChange("alternatePhone", e.target.value)}
                    />
                  </div>
                </TabsContent>

                {/* National Address Tab */}
                <TabsContent value="address" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="buildingNumber">Building Number *</Label>
                      <Input
                        id="buildingNumber"
                        placeholder="1234"
                        value={formData.buildingNumber}
                        onChange={(e) => handleInputChange("buildingNumber", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="streetName">Street Name *</Label>
                      <Input
                        id="streetName"
                        placeholder="King Fahd Road"
                        value={formData.streetName}
                        onChange={(e) => handleInputChange("streetName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="district">District *</Label>
                      <Input
                        id="district"
                        placeholder="Al Olaya"
                        value={formData.district}
                        onChange={(e) => handleInputChange("district", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Select onValueChange={(value) => handleInputChange("city", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="riyadh">Riyadh</SelectItem>
                          <SelectItem value="jeddah">Jeddah</SelectItem>
                          <SelectItem value="dammam">Dammam</SelectItem>
                          <SelectItem value="makkah">Makkah</SelectItem>
                          <SelectItem value="madinah">Madinah</SelectItem>
                          <SelectItem value="taif">Taif</SelectItem>
                          <SelectItem value="tabuk">Tabuk</SelectItem>
                          <SelectItem value="qassim">Qassim</SelectItem>
                          <SelectItem value="jubail">Jubail</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        placeholder="12345"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange("postalCode", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="additionalNumber">Additional Number *</Label>
                      <Input
                        id="additionalNumber"
                        placeholder="1234"
                        value={formData.additionalNumber}
                        onChange={(e) => handleInputChange("additionalNumber", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Business Info Tab */}
                {accountType === "business" && (
                  <TabsContent value="business" className="space-y-6 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        placeholder="ABC Trading Company"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select onValueChange={(value) => handleInputChange("businessType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="supermarket">Supermarket</SelectItem>
                          <SelectItem value="grocery">Grocery Store</SelectItem>
                          <SelectItem value="pharmacy">Pharmacy</SelectItem>
                          <SelectItem value="wholesale">Wholesale</SelectItem>
                          <SelectItem value="distributor">Distributor</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="commercialRegistration">Commercial Registration *</Label>
                        <Input
                          id="commercialRegistration"
                          placeholder="1010123456"
                          value={formData.commercialRegistration}
                          onChange={(e) => handleInputChange("commercialRegistration", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxNumber">Tax Number</Label>
                        <Input
                          id="taxNumber"
                          placeholder="300123456789003"
                          value={formData.taxNumber}
                          onChange={(e) => handleInputChange("taxNumber", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessAddress">Business Address *</Label>
                      <Input
                        id="businessAddress"
                        placeholder="Building 123, King Fahd Road, Al Olaya District"
                        value={formData.businessAddress}
                        onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessCity">City *</Label>
                        <Select onValueChange={(value) => handleInputChange("businessCity", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="riyadh">Riyadh</SelectItem>
                            <SelectItem value="jeddah">Jeddah</SelectItem>
                            <SelectItem value="dammam">Dammam</SelectItem>
                            <SelectItem value="makkah">Makkah</SelectItem>
                            <SelectItem value="madinah">Madinah</SelectItem>
                            <SelectItem value="taif">Taif</SelectItem>
                            <SelectItem value="tabuk">Tabuk</SelectItem>
                            <SelectItem value="qassim">Qassim</SelectItem>
                            <SelectItem value="jubail">Jubail</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessDistrict">District *</Label>
                        <Input
                          id="businessDistrict"
                          placeholder="Al Olaya"
                          value={formData.businessDistrict}
                          onChange={(e) => handleInputChange("businessDistrict", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessPostalCode">Postal Code *</Label>
                        <Input
                          id="businessPostalCode"
                          placeholder="12345"
                          value={formData.businessPostalCode}
                          onChange={(e) => handleInputChange("businessPostalCode", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </TabsContent>
                )}

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Required Documents</h3>

                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="font-medium">National ID Copy *</Label>
                          <Button variant="outline" size="sm">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500">Upload a clear copy of your Saudi National ID</p>
                      </div>

                      {accountType === "business" && (
                        <>
                          <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Label className="font-medium">Commercial Registration *</Label>
                              <Button variant="outline" size="sm">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                              </Button>
                            </div>
                            <p className="text-sm text-gray-500">Upload your commercial registration certificate</p>
                          </div>

                          <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Label className="font-medium">Business License</Label>
                              <Button variant="outline" size="sm">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                              </Button>
                            </div>
                            <p className="text-sm text-gray-500">Upload your business license (if applicable)</p>
                          </div>

                          <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Label className="font-medium">VAT Certificate</Label>
                              <Button variant="outline" size="sm">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                              </Button>
                            </div>
                            <p className="text-sm text-gray-500">
                              Upload your VAT registration certificate (if applicable)
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Terms and Conditions */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => handleInputChange("termsAccepted", checked as boolean)}
                    required
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
                      Privacy Policy
                    </Link>
                    *
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="marketing"
                    checked={formData.marketingConsent}
                    onCheckedChange={(checked) => handleInputChange("marketingConsent", checked as boolean)}
                  />
                  <Label htmlFor="marketing" className="text-sm leading-relaxed">
                    I would like to receive marketing communications and product updates from SBTC
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3" size="lg">
                Create Customer Account
              </Button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Secondary Partner CTA */}
          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interested in becoming a supplier partner?</h3>
              <p className="text-gray-600 mb-4">
                Join our network of trusted suppliers and expand your reach across Saudi Arabia
              </p>
              <Link href="/partner-registration">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  <Handshake className="w-4 h-4 mr-2" />
                  Learn About Partnership
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}