import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MapPin, Users, UserPlus, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function ConnectionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Professional Network</h1>
          <p className="text-gray-600">Connect with medical professionals worldwide</p>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search professionals by name or specialty" className="pl-10" />
          </div>
        </div>

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">DS</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg text-blue-900">Dr. Sarah Johnson</CardTitle>
                  <CardDescription>Cardiologist</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Apollo Hospitals, Mumbai</span>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <Users className="w-4 h-4 mr-2" />
                <span>500+ connections</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Experienced cardiologist specializing in minimally invasive cardiac procedures with 15+ years of
                experience.
              </p>
              <div className="flex space-x-2 mb-4">
                <Badge variant="secondary" className="text-xs">
                  Cardiology
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Surgery
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Connect
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback className="bg-green-100 text-green-600 text-lg">MP</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg text-blue-900">Dr. Michael Patel</CardTitle>
                  <CardDescription>AI Researcher</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>AIIMS, Delhi</span>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <Users className="w-4 h-4 mr-2" />
                <span>750+ connections</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Leading researcher in AI applications for medical diagnostics and healthcare automation.
              </p>
              <div className="flex space-x-2 mb-4">
                <Badge variant="secondary" className="text-xs">
                  AI
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Research
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Connect
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback className="bg-purple-100 text-purple-600 text-lg">AS</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg text-blue-900">Dr. Anita Sharma</CardTitle>
                  <CardDescription>Pediatrician</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Fortis Healthcare, Bangalore</span>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <Users className="w-4 h-4 mr-2" />
                <span>320+ connections</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Dedicated pediatrician with expertise in child development and preventive healthcare.
              </p>
              <div className="flex space-x-2 mb-4">
                <Badge variant="secondary" className="text-xs">
                  Pediatrics
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Child Care
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Connect
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
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
