import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Building2, MapPin, Star, Search, Users, Bed } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HospitalsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Hospital Networks</h1>
          <p className="text-gray-600">Connect with leading healthcare institutions worldwide</p>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search hospitals by name or location" className="pl-10" />
          </div>
        </div>

        {/* Hospital Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Image
                src="/placeholder.svg?height=120&width=300"
                alt="Apollo Hospitals"
                width={300}
                height={120}
                className="w-full h-24 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-blue-900">Apollo Hospitals</CardTitle>
                  <CardDescription>Multi-specialty Healthcare</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Pan India • 70+ locations</span>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <Bed className="w-4 h-4 mr-2" />
                <span>10,000+ beds</span>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <Users className="w-4 h-4 mr-2" />
                <span>50,000+ employees</span>
              </div>
              <div className="flex items-center mb-4">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">4.8 (2.1k reviews)</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                  Cardiology
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                  Oncology
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                  Transplants
                </Badge>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">View Details</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Image
                src="/placeholder.svg?height=120&width=300"
                alt="Fortis Healthcare"
                width={300}
                height={120}
                className="w-full h-24 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-blue-900">Fortis Healthcare</CardTitle>
                  <CardDescription>Integrated Healthcare</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>India • 36+ facilities</span>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <Bed className="w-4 h-4 mr-2" />
                <span>4,000+ beds</span>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <Users className="w-4 h-4 mr-2" />
                <span>23,000+ employees</span>
              </div>
              <div className="flex items-center mb-4">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">4.7 (1.8k reviews)</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                  Neurology
                </Badge>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                  Orthopedics
                </Badge>
                <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                  Emergency
                </Badge>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">View Details</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Image
                src="/placeholder.svg?height=120&width=300"
                alt="Max Healthcare"
                width={300}
                height={120}
                className="w-full h-24 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-blue-900">Max Healthcare</CardTitle>
                  <CardDescription>Super Specialty Care</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>North India • 17+ hospitals</span>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <Bed className="w-4 h-4 mr-2" />
                <span>3,500+ beds</span>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <Users className="w-4 h-4 mr-2" />
                <span>15,000+ employees</span>
              </div>
              <div className="flex items-center mb-4">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">4.6 (1.5k reviews)</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                  Emergency
                </Badge>
                <Badge variant="secondary" className="bg-teal-100 text-teal-700 text-xs">
                  Pediatrics
                </Badge>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 text-xs">
                  Maternity
                </Badge>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">View Details</Button>
            </CardContent>
          </Card>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
