"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  MessageCircle,
  Users,
  Briefcase,
  GraduationCap,
  Building2,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Heart,
  Share2,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Component() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-blue-900">Med Connect</span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#" className="text-blue-900 hover:text-blue-600 font-medium">
                Home
              </Link>
              <Link href="#" className="text-gray-600 hover:text-blue-600 font-medium">
                Jobs
              </Link>
              <Link href="#" className="text-gray-600 hover:text-blue-600 font-medium">
                Colleges
              </Link>
              <Link href="#" className="text-gray-600 hover:text-blue-600 font-medium">
                Hospitals
              </Link>
              <Link href="#" className="text-gray-600 hover:text-blue-600 font-medium">
                Connections
              </Link>
              <Link href="#" className="text-gray-600 hover:text-blue-600 font-medium">
                Messages
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search professionals, jobs, colleges..."
                  className="pl-10 bg-blue-50 border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <MessageCircle className="w-4 h-4 mr-2" />
                Messages
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-blue-100 text-blue-600">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6">Connect. Grow. Heal.</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your professional network in the medical world — doctors, students, hospitals, colleges, and
              opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Join Now
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3">
                Explore Jobs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow border-blue-100">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Jobs in Healthcare</CardTitle>
                <CardDescription>Find your next opportunity in hospitals, clinics, and research</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-blue-100">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Top Medical Colleges</CardTitle>
                <CardDescription>Connect with leading medical institutions and programs</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-blue-100">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Hospital Networks</CardTitle>
                <CardDescription>Partner with healthcare institutions worldwide</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-blue-100">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Connect with Professionals</CardTitle>
                <CardDescription>Build your network with doctors, nurses, and specialists</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Job Listing Preview */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-blue-900">Latest Medical Job Openings</h2>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-100">
              View All Jobs
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-blue-900">Senior Surgeon</CardTitle>
                    <CardDescription className="text-blue-600 font-medium">Apollo Hospitals</CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Full-time
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Mumbai, India</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Posted 2 days ago</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Seeking experienced surgeon for cardiac procedures. 10+ years experience required.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Apply Now</Button>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-blue-900">Nursing Staff</CardTitle>
                    <CardDescription className="text-blue-600 font-medium">Max Healthcare</CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Part-time
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Delhi, India</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Posted 1 day ago</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  ICU nursing position available. BSc Nursing degree required.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Apply Now</Button>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-blue-900">Research Associate</CardTitle>
                    <CardDescription className="text-blue-600 font-medium">AIIMS Research</CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    Contract
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Bangalore, India</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Posted 3 days ago</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Clinical research position in oncology department. PhD preferred.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Apply Now</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Colleges Showcase */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-blue-900">Explore Top Medical Colleges</h2>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-100">
              View All Colleges
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow border-blue-100">
              <CardHeader>
                <Image
                  src="/placeholder.svg?height=120&width=300"
                  alt="AIIMS Delhi"
                  width={300}
                  height={120}
                  className="w-full h-24 object-cover rounded-lg mb-4"
                />
                <CardTitle className="text-lg text-blue-900">AIIMS Delhi</CardTitle>
                <CardDescription>New Delhi, India</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">4.8 (2.1k reviews)</span>
                </div>
                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                  View More
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-blue-100">
              <CardHeader>
                <Image
                  src="/placeholder.svg?height=120&width=300"
                  alt="CMC Vellore"
                  width={300}
                  height={120}
                  className="w-full h-24 object-cover rounded-lg mb-4"
                />
                <CardTitle className="text-lg text-blue-900">CMC Vellore</CardTitle>
                <CardDescription>Vellore, Tamil Nadu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">4.7 (1.8k reviews)</span>
                </div>
                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                  View More
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-blue-100">
              <CardHeader>
                <Image
                  src="/placeholder.svg?height=120&width=300"
                  alt="JIPMER"
                  width={300}
                  height={120}
                  className="w-full h-24 object-cover rounded-lg mb-4"
                />
                <CardTitle className="text-lg text-blue-900">JIPMER</CardTitle>
                <CardDescription>Puducherry, India</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">4.6 (1.5k reviews)</span>
                </div>
                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                  View More
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-blue-100">
              <CardHeader>
                <Image
                  src="/placeholder.svg?height=120&width=300"
                  alt="PGIMER"
                  width={300}
                  height={120}
                  className="w-full h-24 object-cover rounded-lg mb-4"
                />
                <CardTitle className="text-lg text-blue-900">PGIMER</CardTitle>
                <CardDescription>Chandigarh, India</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">4.5 (1.2k reviews)</span>
                </div>
                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                  View More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Hospital Network Preview */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-blue-900">Hospital Partners</h2>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-100">
              View All Partners
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
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
                <p className="text-sm text-gray-600 mb-4">
                  Leading healthcare provider with expertise in cardiac care, oncology, and transplants.
                </p>
                <div className="flex space-x-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Cardiology
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Oncology
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
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
                <p className="text-sm text-gray-600 mb-4">
                  Comprehensive healthcare services with focus on clinical excellence and patient care.
                </p>
                <div className="flex space-x-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    Neurology
                  </Badge>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    Orthopedics
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
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
                <p className="text-sm text-gray-600 mb-4">
                  Premium healthcare with advanced medical technology and specialized treatments.
                </p>
                <div className="flex space-x-2">
                  <Badge variant="secondary" className="bg-red-100 text-red-700">
                    Emergency
                  </Badge>
                  <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                    Pediatrics
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Feed Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-blue-900">From the Med Connect Community</h2>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-100">
              View Feed
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow border-blue-100">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback className="bg-blue-100 text-blue-600">DS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-blue-900">Dr. Sarah Johnson</h4>
                    <p className="text-sm text-gray-600">Cardiologist at Apollo Hospitals</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Excited to share our latest research on minimally invasive cardiac procedures. The results show 40%
                  faster recovery times! #CardiacSurgery #MedicalInnovation
                </p>
                <div className="flex items-center space-x-4 text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-blue-600">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">24</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-600">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">8</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-600">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-blue-100">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback className="bg-green-100 text-green-600">MP</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-blue-900">Dr. Michael Patel</h4>
                    <p className="text-sm text-gray-600">AI Researcher at AIIMS</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  AI in diagnostics is revolutionizing healthcare! Our new algorithm can detect early-stage cancer with
                  95% accuracy. What are your thoughts on AI integration in clinical practice?
                </p>
                <div className="flex items-center space-x-4 text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-blue-600">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">42</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-600">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">15</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-600">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Signup/Login Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Create your Med Connect Profile</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of medical professionals building their careers and connections
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3">
              Sign Up as Student
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3"
            >
              Sign Up as Doctor
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3"
            >
              Sign Up as Institution
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Med Connect</span>
              </div>
              <p className="text-blue-200">
                Connecting medical professionals worldwide for better healthcare outcomes.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-blue-200">
                <li>
                  <Link href="#" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-blue-200">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <Link href="#" className="text-blue-200 hover:text-white">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-blue-200 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-blue-200 hover:text-white">
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-blue-200 hover:text-white">
                  <Instagram className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
            <p>&copy; {new Date().getFullYear()} Med Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
