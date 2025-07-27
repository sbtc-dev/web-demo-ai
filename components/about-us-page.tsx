"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Users,
  MapPin,
  Truck,
  Store,
  Globe,
  Award,
  TrendingUp,
  Shield,
  Target,
  Smartphone,
  Network,
  CheckCircle,
} from "lucide-react"

export default function AboutUsPage() {
  const stats = [
    { label: "Years of Excellence", value: "43+", icon: Award },
    { label: "Trained Professionals", value: "1,500+", icon: Users },
    { label: "Retail Outlets Served", value: "70,000+", icon: Store },
    { label: "Vehicle Fleet", value: "285+", icon: Truck },
    { label: "Major Regions", value: "10+", icon: MapPin },
    { label: "Founded", value: "1981", icon: Building2 },
  ]

  const locations = [
    "Jeddah (Headquarters)",
    "Riyadh",
    "Dammam",
    "Makkah",
    "Madinah",
    "Taif",
    "Tabuk",
    "Qassim",
    "Jubail",
  ]

  const sectors = [
    { name: "Grocery Stores", icon: Store },
    { name: "Supermarkets", icon: Building2 },
    { name: "Pharmacies", icon: Shield },
    { name: "HORECA", icon: Users },
    { name: "Wholesale Markets", icon: Globe },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gray-900 text-white hover:bg-gray-800">Since 1981</Badge>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Said Bawazir Trading Corp.
              <br />
              <span className="text-gray-600">(SBTC)</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              A legacy of trust and excellence in distribution since 1981, powering growth across the Kingdom of Saudi
              Arabia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8">
                Our Products
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-gray-200">
                <CardContent className="p-6">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-gray-700" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage and Commitment */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Heritage and Commitment</h2>
              <div className="w-24 h-1 bg-gray-900 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  Founded in 1981, Said Bawazir Trading Corp. is one of the oldest and most respected distribution
                  companies in the Kingdom of Saudi Arabia. Today, we are a leading distributor of high-quality consumer
                  products across both food and non-food FMCG categories.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our Consumer Products Division offers a diverse portfolio, ranging from oral care and sweeteners to
                  essential foodstuffs—each product representing some of the most trusted names in the industry.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Upholding our core philosophy of quality, transparency, and operational excellence, we ensure that
                  every brand we represent is supported by a reliable and far-reaching commercial network across Saudi
                  Arabia.
                </p>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-6">Core Values</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>Quality Excellence</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>Transparency</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>Operational Excellence</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>Integrity</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>Sustainability</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* People and Vision */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our People, Our Vision</h2>
            <div className="w-24 h-1 bg-gray-900 mx-auto mb-12"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="border-gray-200">
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-700" />
                  <h3 className="text-xl font-semibold mb-4">Our People</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Backed by over 1,500 trained and committed professionals, our highly skilled sales force continues
                    to drive brand visibility, customer satisfaction, and long-term partnerships.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-8 text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-700" />
                  <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed">
                    As we grow our portfolio, our vision remains focused on being the preferred partner for renowned
                    global brands—anchored in integrity, sustainability, and shared success.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sales & Operational Reach */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Sales & Operational Reach</h2>
              <div className="w-24 h-1 bg-gray-900 mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                With our headquarters in Jeddah and branch offices in all major regions, we proudly serve over 70,000
                retail outlets across the Kingdom.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Regional Presence</h3>
                <div className="grid grid-cols-2 gap-3">
                  {locations.map((location, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{location}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Sectors Served</h3>
                <div className="space-y-4">
                  {sectors.map((sector, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <sector.icon className="w-6 h-6 text-gray-700" />
                      <span className="font-medium text-gray-900">{sector.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 bg-blue-50 rounded-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Operational Excellence</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Our operational focus remains on reducing lead times, minimizing stockouts, and continuously improving
                supply chain efficiency to deliver exceptional service to our customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Distribution Network */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Distribution Network</h2>
              <div className="w-24 h-1 bg-gray-900 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="border-gray-200">
                <CardContent className="p-8">
                  <Truck className="w-12 h-12 mb-4 text-gray-700" />
                  <h3 className="text-xl font-semibold mb-4">Advanced Logistics</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Our advanced logistics framework includes a fleet of 285+ vehicles, enabling agile and dependable
                    service across key sectors.
                  </p>
                  <div className="text-2xl font-bold text-gray-900">285+ Vehicles</div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-8">
                  <Network className="w-12 h-12 mb-4 text-gray-700" />
                  <h3 className="text-xl font-semibold mb-4">Direct Outlet Coverage</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Our DOC model, driven by van sales with ready-stock inventory, ensures high responsiveness and
                    market presence, even in remote locations.
                  </p>
                  <div className="text-2xl font-bold text-gray-900">70,000+ Outlets</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Transformation */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Digital Transformation</h2>
              <div className="w-24 h-1 bg-gray-900 mx-auto mb-6"></div>
              <p className="text-xl text-gray-600">B2B Application Development</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-8 lg:p-12 text-white mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <Smartphone className="w-12 h-12 mb-6 text-blue-400" />
                  <h3 className="text-2xl font-bold mb-4">Comprehensive B2B Platform</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    We are currently developing a comprehensive B2B application that will serve as the central hub for
                    our sales and distribution operations, designed to significantly broaden our customer reach.
                  </p>
                  <Button className="bg-white text-gray-900 hover:bg-gray-100">Learn More</Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Real-time inventory management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Flexible delivery options</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Integrated payment solutions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Third-party logistics integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>End-to-end digital experience</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                This transformation will further strengthen our distribution ecosystem, drive operational excellence,
                and solidify our leadership position in the FMCG market. At Said Bawazir Trading Corp., we go beyond
                distribution—we enable progress, build partnerships, and power growth through innovation and
                reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Partner with SBTC?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust SBTC for their FMCG distribution needs across Saudi Arabia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8">
              Become a Partner
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8"
            >
              Contact Sales Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}