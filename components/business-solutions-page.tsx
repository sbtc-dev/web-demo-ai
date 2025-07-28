"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  TrendingDown,
  Users,
  Clock,
  Shield,
  Truck,
  Phone,
  Mail,
  CheckCircle,
  Star,
  ArrowRight,
  Package,
  Calculator,
  Headphones,
} from "lucide-react"

interface BulkInquiryForm {
  companyName: string
  contactPerson: string
  email: string
  phone: string
  businessType: string
  monthlyVolume: string
  productCategories: string[]
  specificProducts: string
  deliveryLocation: string
  paymentTerms: string
  additionalRequirements: string
}

export default function BusinessSolutionsPage() {
  const [formData, setFormData] = useState<BulkInquiryForm>({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    businessType: "",
    monthlyVolume: "",
    productCategories: [],
    specificProducts: "",
    deliveryLocation: "",
    paymentTerms: "",
    additionalRequirements: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      productCategories: checked
        ? [...prev.productCategories, category]
        : prev.productCategories.filter((c) => c !== category),
    }))
  }

  const pricingTiers = [
    {
      name: "Starter Business",
      minOrder: "SAR 5,000",
      discount: "5-8%",
      features: ["Standard delivery", "Email support", "Monthly invoicing", "Basic reporting"],
      badge: "Bronze",
      bgColor: 'bg-amber-700',
    },
    {
      name: "Growth Business",
      minOrder: "SAR 15,000",
      discount: "10-15%",
      features: [
        "Priority delivery",
        "Dedicated account manager",
        "Flexible payment terms",
        "Advanced analytics",
        "Custom packaging",
      ],
      badge: "Silver",
      bgColor: 'bg-gray-500',
    },
    {
      name: "Enterprise",
      minOrder: "SAR 50,000",
      discount: "18-25%",
      features: [
        "Express delivery",
        "24/7 priority support",
        "Custom solutions",
        "White-label options",
        "API integration",
        "Quarterly business reviews",
      ],
      badge: "Gold",
      bgColor: 'bg-yellow-600',
    },
  ]

  const benefits = [
    {
      icon: TrendingDown,
      title: "Volume Discounts",
      description: "Save up to 25% on bulk orders with our tiered pricing structure",
    },
    {
      icon: Users,
      title: "Dedicated Account Manager",
      description: "Personal support from experienced FMCG professionals",
    },
    {
      icon: Clock,
      title: "Priority Processing",
      description: "Fast-track your orders with priority handling and delivery",
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "100% quality assurance with full product traceability",
    },
    {
      icon: Truck,
      title: "Flexible Delivery",
      description: "Customized delivery schedules to match your business needs",
    },
    {
      icon: Calculator,
      title: "Custom Solutions",
      description: "Tailored product mixes and packaging for your specific requirements",
    },
  ]

  const brands = ["Ajinomoto", "Indomie", "Indofood", "Siwak-F", "Steviana"]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-4">
                Your bulk inquiry has been submitted successfully. Our business solutions team will contact you within
                24 hours.
              </p>
              <Button onClick={() => setIsSubmitted(false)}>Submit Another Inquiry</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-600 hover:bg-blue-700">Business Solutions</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bulk Orders Made
              <span className="block text-blue-300">Simple & Profitable</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              Partner with SBTC for your bulk FMCG needs. Get exclusive discounts, dedicated support, and customized
              solutions for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
                <Package className="mr-2 h-5 w-5" />
                Get Bulk Quote
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-900"
              >
                <Phone className="mr-2 h-5 w-5" />
                Speak to Expert
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose SBTC for Bulk Orders?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We understand the unique needs of businesses and provide tailored solutions to help you succeed in the
              competitive FMCG market.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <benefit.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Bulk Pricing Tiers</h2>
            <p className="text-xl text-gray-600">
              Choose the tier that best fits your business volume and unlock exclusive benefits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`relative ${index === 1 ? "ring-2 ring-blue-500 scale-105" : ""}`}>
                {tier.badge && (
                  <Badge className={`${tier.bgColor} absolute -top-3 left-1/2 transform -translate-x-1/2`}>
                    {tier.badge}
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold text-blue-600">{tier.discount}</span>
                    <span className="text-gray-600"> discount</span>
                  </CardDescription>
                  <p className="text-sm text-gray-500">Minimum order: {tier.minOrder}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant={index === 1 ? "default" : "outline"}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Leading Businesses</h2>
            <p className="text-xl text-gray-600">
              See how our business solutions have helped companies across Saudi Arabia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                company: "Al-Rashid Supermarkets",
                industry: "Retail Chain",
                savings: "22% cost reduction",
                quote: "SBTC's bulk solutions helped us optimize our supply chain and reduce costs significantly.",
                rating: 5,
              },
              {
                company: "Najd Hospitality Group",
                industry: "Hotels & Restaurants",
                savings: "18% savings",
                quote: "Reliable delivery and quality products. Their dedicated support team is exceptional.",
                rating: 5,
              },
              {
                company: "Eastern Province Distributors",
                industry: "Distribution",
                savings: "25% efficiency gain",
                quote: "The custom packaging and flexible delivery options perfectly match our business needs.",
                rating: 5,
              },
            ].map((story, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{story.quote}"</p>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold">{story.company}</h4>
                    <p className="text-sm text-gray-500">{story.industry}</p>
                    <Badge variant="secondary" className="mt-2">
                      {story.savings}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Inquiry Form */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Request a Bulk Quote</h2>
            <p className="text-xl text-gray-600">
              Fill out the form below and our business solutions team will contact you within 24 hours
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))}
                      placeholder="Full Name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email">Business Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="business@company.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+966 XX XXX XXXX"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, businessType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retailer">Retailer</SelectItem>
                        <SelectItem value="distributor">Distributor</SelectItem>
                        <SelectItem value="restaurant">Restaurant/Cafe</SelectItem>
                        <SelectItem value="hotel">Hotel/Hospitality</SelectItem>
                        <SelectItem value="catering">Catering Service</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="monthlyVolume">Expected Monthly Volume *</Label>
                    <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, monthlyVolume: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select volume range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5k-15k">SAR 5,000 - 15,000</SelectItem>
                        <SelectItem value="15k-50k">SAR 15,000 - 50,000</SelectItem>
                        <SelectItem value="50k-100k">SAR 50,000 - 100,000</SelectItem>
                        <SelectItem value="100k+">SAR 100,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Brands of Interest *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={formData.productCategories.includes(brand)}
                          onCheckedChange={(checked) => handleCategoryChange(brand, checked as boolean)}
                        />
                        <Label htmlFor={brand} className="text-sm">
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="specificProducts">Specific Products or Brands</Label>
                  <Textarea
                    id="specificProducts"
                    value={formData.specificProducts}
                    onChange={(e) => setFormData((prev) => ({ ...prev, specificProducts: e.target.value }))}
                    placeholder="List any specific products, brands, or SKUs you're interested in..."
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="deliveryLocation">Primary Delivery Location *</Label>
                    <Input
                      id="deliveryLocation"
                      required
                      value={formData.deliveryLocation}
                      onChange={(e) => setFormData((prev) => ({ ...prev, deliveryLocation: e.target.value }))}
                      placeholder="City, Region"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentTerms">Preferred Payment Terms</Label>
                    <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentTerms: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate Payment</SelectItem>
                        <SelectItem value="net15">Net 15 Days</SelectItem>
                        <SelectItem value="net30">Net 30 Days</SelectItem>
                        <SelectItem value="net60">Net 60 Days</SelectItem>
                        <SelectItem value="custom">Custom Terms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="additionalRequirements">Additional Requirements</Label>
                  <Textarea
                    id="additionalRequirements"
                    value={formData.additionalRequirements}
                    onChange={(e) => setFormData((prev) => ({ ...prev, additionalRequirements: e.target.value }))}
                    placeholder="Any special requirements, custom packaging needs, delivery schedules, etc."
                    rows={4}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Bulk Inquiry
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Immediate Assistance?</h2>
            <p className="text-xl text-gray-300">
              Our business solutions team is ready to help you with your bulk ordering needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <Phone className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Call Us</h3>
                <p className="text-gray-300 mb-2">Business Solutions Hotline</p>
                <p className="text-blue-400 font-semibold">+966 11 XXX XXXX</p>
                <p className="text-sm text-gray-400 mt-2">Mon-Fri: 8AM-6PM</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <Mail className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Email Us</h3>
                <p className="text-gray-300 mb-2">Business Inquiries</p>
                <p className="text-blue-400 font-semibold">business@sbtcgroup.com</p>
                <p className="text-sm text-gray-400 mt-2">Response within 24 hours</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <Headphones className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Live Chat</h3>
                <p className="text-gray-300 mb-2">Instant Support</p>
                <Button className="bg-blue-600 hover:bg-blue-700 mt-2">Start Chat</Button>
                <p className="text-sm text-gray-400 mt-2">Available 24/7</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}