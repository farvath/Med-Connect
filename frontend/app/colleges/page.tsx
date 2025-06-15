import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, MapPin, Star, Search, Users, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CollegesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Medical Colleges</h1>
          <p className="text-gray-600">Explore top medical institutions and programs</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search colleges" className="pl-10" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Program Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mbbs">MBBS</SelectItem>
                <SelectItem value="md">MD</SelectItem>
                <SelectItem value="nursing">Nursing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* College Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Image
                src="/placeholder.svg?height=120&width=300"
                alt="AIIMS Delhi"
                width={300}
                height={120}
                className="w-full h-24 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-blue-900">AIIMS Delhi</CardTitle>
                  <CardDescription>All India Institute of Medical Sciences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>New Delhi, India</span>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <Users className="w-4 h-4 mr-2" />
                <span>5,000+ students</span>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <BookOpen className="w-4 h-4 mr-2" />
                <span>Established 1956</span>
              </div>
              <div className="flex items-center mb-4">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">4.8 (2.1k reviews)</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="text-xs">
                  MBBS
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  MD
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Research
                </Badge>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">View Details</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Image
                src="/placeholder.svg?height=120&width=300"
                alt="CMC Vellore"
                width={300}
                height={120}
                className="w-full h-24 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-blue-900">CMC Vellore</CardTitle>
                  <CardDescription>Christian Medical College</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Vellore, Tamil Nadu</span>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <Users className="w-4 h-4 mr-2" />
                <span>3,000+ students</span>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <BookOpen className="w-4 h-4 mr-2" />
                <span>Established 1900</span>
              </div>
              <div className="flex items-center mb-4">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">4.7 (1.8k reviews)</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="text-xs">
                  MBBS
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Nursing
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Allied Health
                </Badge>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">View Details</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Image
                src="/placeholder.svg?height=120&width=300"
                alt="JIPMER"
                width={300}
                height={120}
                className="w-full h-24 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-blue-900">JIPMER</CardTitle>
                  <CardDescription>Jawaharlal Institute of Postgraduate Medical Education</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Puducherry, India</span>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <Users className="w-4 h-4 mr-2" />
                <span>2,500+ students</span>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <BookOpen className="w-4 h-4 mr-2" />
                <span>Established 1956</span>
              </div>
              <div className="flex items-center mb-4">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">4.6 (1.5k reviews)</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="text-xs">
                  MBBS
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  PG
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Super Specialty
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
