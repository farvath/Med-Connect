"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Youtube,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Stethoscope,
  UserPlus,
  Bell,
  ArrowUp,
  LinkIcon,
  Activity,
  Shield,
  Award,
  TrendingUp,
  Home,
  Rss,
  Plus,
  ArrowRight,
  Eye,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function Homepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const navItems = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "jobs", label: "Jobs", icon: Briefcase, href: "/jobs" },
    { id: "colleges", label: "Colleges", icon: GraduationCap, href: "/colleges" },
    { id: "hospitals", label: "Hospitals", icon: Building2, href: "/hospitals" },
    { id: "connections", label: "Connections", icon: Users, href: "/connections" },
    { id: "feed", label: "Feed", icon: Rss, href: "/feed" },
  ]

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif] antialiased">
        {/* Enhanced Glassmorphism Navbar */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-18">
              {/* Enhanced Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 hidden sm:block group-hover:text-blue-600 transition-colors duration-300">
                  Med Connect
                </span>
              </Link>

              {/* Enhanced Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeNavItem === item.id
                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          onClick={() => setActiveNavItem(item.id)}
                          className={`
                            flex items-center space-x-2 px-4 py-2.5 rounded-full font-medium transition-all duration-300 ease-in-out
                            ${
                              isActive
                                ? "bg-blue-100 text-blue-700 shadow-md scale-105"
                                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:scale-105"
                            }
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          `}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="hidden xl:block font-semibold">{item.label}</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent className="xl:hidden bg-gray-900 text-white">
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </nav>

              {/* Enhanced Search Bar */}
              <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search jobs, colleges, or professionals"
                    className="pl-12 pr-4 py-3.5 bg-gray-100/90 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-full transition-all duration-300 placeholder:text-gray-500 text-gray-700 font-medium"
                  />
                </div>
              </div>

              {/* Enhanced Right Side Actions */}
              <div className="flex items-center space-x-3">
                {/* Enhanced Primary CTA */}
                <Link href="/jobs">
                  <Button className="hidden md:flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold">
                    <Plus className="w-4 h-4" />
                    <span>Post Job</span>
                  </Button>
                </Link>

                {/* Enhanced Notifications */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative p-3 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Bell className="w-5 h-5 text-gray-600" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white">
                    <p>3 new notifications</p>
                  </TooltipContent>
                </Tooltip>

                {/* Enhanced Messages */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden md:flex items-center space-x-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-105 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <MessageCircle className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700 font-semibold">Messages</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white">
                    <p>5 unread messages</p>
                  </TooltipContent>
                </Tooltip>

                {/* Enhanced Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-11 w-11 rounded-full hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Avatar className="h-10 w-10 ring-2 ring-white shadow-lg">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Profile" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold">
                          JD
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-60 rounded-2xl shadow-xl border-gray-200 bg-white/95 backdrop-blur-lg"
                    align="end"
                    forceMount
                  >
                    <div className="p-4 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">Dr. John Doe</p>
                      <p className="text-sm text-gray-600">Cardiologist</p>
                    </div>
                    <DropdownMenuItem className="rounded-xl p-3 hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
                      <User className="mr-3 h-5 w-5 text-blue-600" />
                      <span className="font-medium">My Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl p-3 hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
                      <Settings className="mr-3 h-5 w-5 text-gray-600" />
                      <span className="font-medium">Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem className="rounded-xl p-3 hover:bg-red-50 transition-colors duration-200 cursor-pointer text-red-600">
                      <LogOut className="mr-3 h-5 w-5" />
                      <span className="font-medium">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Enhanced Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden p-3 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
              </div>
            </div>

            {/* Enhanced Mobile Slide-in Menu */}
            <div
              className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-gray-200/50 py-6 bg-white/90 backdrop-blur-lg rounded-b-2xl">
                <nav className="flex flex-col space-y-2 px-4">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeNavItem === item.id
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => {
                          setActiveNavItem(item.id)
                          setMobileMenuOpen(false)
                        }}
                        className={`
                          flex items-center space-x-3 px-4 py-3.5 rounded-xl font-semibold transition-all duration-300
                          ${
                            isActive
                              ? "bg-blue-100 text-blue-700"
                              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                  <div className="pt-4 border-t border-gray-200">
                    <Link href="/jobs">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 font-semibold transition-all duration-300 shadow-lg">
                        <Plus className="w-4 h-4 mr-2" />
                        Post Job
                      </Button>
                    </Link>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </header>

        {/* Add enhanced top padding */}
        <div className="pt-20">
          {/* Enhanced Hero Section */}
          <section className="relative bg-gradient-to-br from-blue-50 via-white to-teal-50 py-28 overflow-hidden">
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 w-20 h-20 bg-blue-600 rounded-full animate-pulse"></div>
              <div className="absolute top-32 right-20 w-16 h-16 bg-teal-500 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-400 rounded-full animate-pulse delay-500"></div>
              <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-teal-400 rounded-full animate-pulse delay-700"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="text-center">
                <div className="mb-10">
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-6 py-3 rounded-full font-semibold text-lg hover:bg-blue-200 transition-colors duration-300 shadow-sm">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Trusted by 10,000+ Medical Professionals
                  </Badge>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                  Connect. <span className="text-blue-600">Grow.</span> Heal.
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-14 max-w-4xl mx-auto leading-relaxed font-medium">
                  Your all-in-one platform for medical careers, education, and collaboration. Join the future of
                  healthcare networking.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg group"
                    >
                      <LinkIcon className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/jobs">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-10 py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg group"
                    >
                      <Briefcase className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Explore Jobs
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Section Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2"></div>

          {/* Enhanced Feature Cards */}
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Explore Our Platform</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
                  Discover opportunities, connect with professionals, and advance your medical career
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Link href="/jobs" className="group">
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-gray-200 hover:border-blue-300 rounded-3xl overflow-hidden group-hover:scale-103 transform relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader className="text-center p-10 relative z-10">
                      <div className="w-18 h-18 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                        <Briefcase className="w-9 h-9 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-4">
                        Jobs in Healthcare
                      </CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed font-medium">
                        Find your next opportunity in hospitals, clinics, and research institutions
                      </CardDescription>
                      <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="flex items-center justify-center text-blue-600 font-semibold">
                          <span>Explore Jobs</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/hospitals" className="group">
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-gray-200 hover:border-teal-300 rounded-3xl overflow-hidden group-hover:scale-103 transform relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader className="text-center p-10 relative z-10">
                      <div className="w-18 h-18 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                        <Building2 className="w-9 h-9 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors duration-300 mb-4">
                        Hospital Network
                      </CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed font-medium">
                        Partner with leading healthcare institutions worldwide
                      </CardDescription>
                      <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="flex items-center justify-center text-teal-600 font-semibold">
                          <span>View Hospitals</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/colleges" className="group">
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-gray-200 hover:border-purple-300 rounded-3xl overflow-hidden group-hover:scale-103 transform relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader className="text-center p-10 relative z-10">
                      <div className="w-18 h-18 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                        <GraduationCap className="w-9 h-9 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300 mb-4">
                        Medical Colleges
                      </CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed font-medium">
                        Connect with top medical institutions and educational programs
                      </CardDescription>
                      <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="flex items-center justify-center text-purple-600 font-semibold">
                          <span>Browse Colleges</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/connections" className="group">
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-gray-200 hover:border-green-300 rounded-3xl overflow-hidden group-hover:scale-103 transform relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader className="text-center p-10 relative z-10">
                      <div className="w-18 h-18 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                        <Users className="w-9 h-9 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300 mb-4">
                        Professional Network
                      </CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed font-medium">
                        Build connections with doctors, nurses, and specialists
                      </CardDescription>
                      <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="flex items-center justify-center text-green-600 font-semibold">
                          <span>Connect Now</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              </div>
            </div>
          </section>

          {/* Enhanced Section Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2"></div>

          {/* Enhanced Job Listings */}
          <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-16">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Latest Medical Job Openings</h2>
                  <p className="text-xl text-gray-600 font-medium">Discover your next career opportunity</p>
                </div>
                <Link href="/jobs">
                  <Button
                    variant="outline"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl px-8 py-4 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    View all jobs
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="bg-white hover:shadow-2xl transition-all duration-300 border-gray-200 hover:border-blue-300 rounded-3xl overflow-hidden group hover:scale-103 transform">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="p-8 relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                          Senior Cardiologist
                        </CardTitle>
                        <CardDescription className="text-blue-600 font-semibold text-lg">
                          Apollo Hospitals
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-200 rounded-full px-4 py-2 font-semibold">
                        Full-time
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 relative z-10">
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                        <span className="font-semibold">Mumbai, India</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-3 text-gray-400" />
                        <span className="font-medium">Posted 2 days ago</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                      Seeking experienced cardiologist for cardiac procedures. 10+ years experience required.
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105">
                      <Eye className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white hover:shadow-2xl transition-all duration-300 border-gray-200 hover:border-blue-300 rounded-3xl overflow-hidden group hover:scale-103 transform">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="p-8 relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                          ICU Nurse
                        </CardTitle>
                        <CardDescription className="text-blue-600 font-semibold text-lg">
                          Max Healthcare
                        </CardDescription>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 rounded-full px-4 py-2 font-semibold">
                        Part-time
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 relative z-10">
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                        <span className="font-semibold">Delhi, India</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-3 text-gray-400" />
                        <span className="font-medium">Posted 1 day ago</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                      ICU nursing position available. BSc Nursing degree required.
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105">
                      <Eye className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white hover:shadow-2xl transition-all duration-300 border-gray-200 hover:border-blue-300 rounded-3xl overflow-hidden group hover:scale-103 transform">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="p-8 relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                          Research Associate
                        </CardTitle>
                        <CardDescription className="text-blue-600 font-semibold text-lg">
                          AIIMS Research
                        </CardDescription>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-4 py-2 font-semibold">
                        Contract
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 relative z-10">
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                        <span className="font-semibold">Bangalore, India</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-3 text-gray-400" />
                        <span className="font-medium">Posted 3 days ago</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                      Clinical research position in oncology department. PhD preferred.
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105">
                      <Eye className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Enhanced Section Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2"></div>

          {/* Enhanced Medical Colleges Preview */}
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-16">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Top Medical Colleges</h2>
                  <p className="text-xl text-gray-600 font-medium">Explore premier medical education institutions</p>
                </div>
                <Link href="/colleges">
                  <Button
                    variant="outline"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl px-8 py-4 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    Explore Colleges
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="hover:shadow-2xl transition-all duration-300 border-gray-200 rounded-3xl overflow-hidden group hover:scale-103 transform">
                  <CardHeader className="p-8">
                    <Image
                      src="/placeholder.svg?height=160&width=320"
                      alt="KMC Mangalore"
                      width={320}
                      height={160}
                      className="w-full h-36 object-cover rounded-2xl mb-8 group-hover:scale-105 transition-transform duration-300"
                    />
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                      KMC Mangalore
                    </CardTitle>
                    <CardDescription className="text-gray-600 font-semibold">Mangalore, Karnataka</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <div className="flex items-center mb-6">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-gray-600 ml-2 font-semibold">4.8 (2.1k reviews)</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-8">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 rounded-full px-4 py-2 font-semibold"
                      >
                        MBBS
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 rounded-full px-4 py-2 font-semibold"
                      >
                        MD
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-700 rounded-full px-4 py-2 font-semibold"
                      >
                        Research
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl py-4 font-semibold transition-all duration-300"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-2xl transition-all duration-300 border-gray-200 rounded-3xl overflow-hidden group hover:scale-103 transform">
                  <CardHeader className="p-8">
                    <Image
                      src="/placeholder.svg?height=160&width=320"
                      alt="Yenepoya Medical College"
                      width={320}
                      height={160}
                      className="w-full h-36 object-cover rounded-2xl mb-8 group-hover:scale-105 transition-transform duration-300"
                    />
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                      Yenepoya Medical College
                    </CardTitle>
                    <CardDescription className="text-gray-600 font-semibold">Mangalore, Karnataka</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <div className="flex items-center mb-6">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-gray-600 ml-2 font-semibold">4.7 (1.8k reviews)</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-8">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 rounded-full px-4 py-2 font-semibold"
                      >
                        MBBS
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-teal-100 text-teal-700 rounded-full px-4 py-2 font-semibold"
                      >
                        Nursing
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-700 rounded-full px-4 py-2 font-semibold"
                      >
                        Allied Health
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl py-4 font-semibold transition-all duration-300"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-2xl transition-all duration-300 border-gray-200 rounded-3xl overflow-hidden group hover:scale-103 transform">
                  <CardHeader className="p-8">
                    <Image
                      src="/placeholder.svg?height=160&width=320"
                      alt="Father Muller Medical College"
                      width={320}
                      height={160}
                      className="w-full h-36 object-cover rounded-2xl mb-8 group-hover:scale-105 transition-transform duration-300"
                    />
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                      Father Muller Medical College
                    </CardTitle>
                    <CardDescription className="text-gray-600 font-semibold">Mangalore, Karnataka</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <div className="flex items-center mb-6">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-gray-600 ml-2 font-semibold">4.6 (1.5k reviews)</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-8">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 rounded-full px-4 py-2 font-semibold"
                      >
                        MBBS
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-700 rounded-full px-4 py-2 font-semibold"
                      >
                        PG
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-red-100 text-red-700 rounded-full px-4 py-2 font-semibold"
                      >
                        Super Specialty
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl py-4 font-semibold transition-all duration-300"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-2xl transition-all duration-300 border-gray-200 rounded-3xl overflow-hidden group hover:scale-103 transform">
                  <CardHeader className="p-8">
                    <Image
                      src="/placeholder.svg?height=160&width=320"
                      alt="K.S. Hegde Medical Academy"
                      width={320}
                      height={160}
                      className="w-full h-36 object-cover rounded-2xl mb-8 group-hover:scale-105 transition-transform duration-300"
                    />
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                      K.S. Hegde Medical Academy
                    </CardTitle>
                    <CardDescription className="text-gray-600 font-semibold">Mangalore, Karnataka</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <div className="flex items-center mb-6">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-gray-600 ml-2 font-semibold">4.5 (1.2k reviews)</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-8">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 rounded-full px-4 py-2 font-semibold"
                      >
                        MD
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 rounded-full px-4 py-2 font-semibold"
                      >
                        MS
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-700 rounded-full px-4 py-2 font-semibold"
                      >
                        DM
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl py-4 font-semibold transition-all duration-300"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Enhanced Section Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2"></div>

          {/* Enhanced Hospital Partners Preview */}
          <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-16">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Leading Hospital Networks</h2>
                  <p className="text-xl text-gray-600 font-medium">Partner with world-class healthcare institutions</p>
                </div>
                <Link href="/hospitals">
                  <Button
                    variant="outline"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl px-8 py-4 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    See All Hospitals
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="bg-white hover:shadow-2xl transition-all duration-300 border-gray-200 rounded-3xl overflow-hidden group hover:scale-103 transform">
                  <CardHeader className="p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg">
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          Apollo Hospitals
                        </CardTitle>
                        <CardDescription className="text-gray-600 font-semibold">
                          Multi-specialty Healthcare
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <div className="flex items-center text-gray-600 mb-6">
                      <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="font-semibold">Pan India • 70+ locations</span>
                    </div>
                    <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                      Leading healthcare provider with expertise in cardiac care, oncology, and transplants.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 rounded-full px-4 py-2 font-semibold">
                        Cardiology
                      </Badge>
                      <Badge className="bg-green-100 text-green-700 border-green-200 rounded-full px-4 py-2 font-semibold">
                        Oncology
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-4 py-2 font-semibold">
                        Transplants
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white hover:shadow-2xl transition-all duration-300 border-gray-200 rounded-3xl overflow-hidden group hover:scale-103 transform">
                  <CardHeader className="p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-lg">
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          Fortis Healthcare
                        </CardTitle>
                        <CardDescription className="text-gray-600 font-semibold">Integrated Healthcare</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <div className="flex items-center text-gray-600 mb-6">
                      <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="font-semibold">India • 36+ facilities</span>
                    </div>
                    <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                      Comprehensive healthcare services with focus on clinical excellence and patient care.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-4 py-2 font-semibold">
                        Neurology
                      </Badge>
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200 rounded-full px-4 py-2 font-semibold">
                        Orthopedics
                      </Badge>
                      <Badge className="bg-red-100 text-red-700 border-red-200 rounded-full px-4 py-2 font-semibold">
                        Emergency
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white hover:shadow-2xl transition-all duration-300 border-gray-200 rounded-3xl overflow-hidden group hover:scale-103 transform">
                  <CardHeader className="p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-lg">
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          Max Healthcare
                        </CardTitle>
                        <CardDescription className="text-gray-600 font-semibold">Super Specialty Care</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <div className="flex items-center text-gray-600 mb-6">
                      <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="font-semibold">North India • 17+ hospitals</span>
                    </div>
                    <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                      Premium healthcare with advanced medical technology and specialized treatments.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-red-100 text-red-700 border-red-200 rounded-full px-4 py-2 font-semibold">
                        Emergency
                      </Badge>
                      <Badge className="bg-teal-100 text-teal-700 border-teal-200 rounded-full px-4 py-2 font-semibold">
                        Pediatrics
                      </Badge>
                      <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 rounded-full px-4 py-2 font-semibold">
                        Maternity
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Enhanced Section Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2"></div>

          {/* Enhanced Community Feed Preview */}
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-16">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">From the Med Connect Community</h2>
                  <p className="text-xl text-gray-600 font-medium">
                    Stay connected with the latest updates and insights
                  </p>
                </div>
                <Link href="/feed">
                  <Button
                    variant="outline"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl px-8 py-4 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    Go to Community
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="hover:shadow-2xl transition-all duration-300 border-gray-200 rounded-3xl overflow-hidden">
                  <CardHeader className="p-8">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-14 h-14">
                        <AvatarImage src="/placeholder.svg?height=56&width=56" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg">
                          DR
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">Dr. Rajesh Rao</h4>
                        <p className="text-gray-600 font-medium">joined Apollo Hospitals as Chief Cardiologist</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <p className="text-gray-700 mb-8 leading-relaxed font-medium text-lg">
                      Excited to announce my new role at Apollo Hospitals! Looking forward to advancing cardiac care and
                      mentoring the next generation of cardiologists. #NewBeginnings #Cardiology
                    </p>
                    <div className="flex items-center space-x-8 text-gray-500">
                      <button className="flex items-center space-x-2 hover:text-red-500 transition-colors duration-200">
                        <Heart className="w-5 h-5" />
                        <span className="font-semibold">24 likes</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors duration-200">
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-semibold">8 comments</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors duration-200">
                        <Share2 className="w-5 h-5" />
                        <span className="font-semibold">Share</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-2xl transition-all duration-300 border-gray-200 rounded-3xl overflow-hidden">
                  <CardHeader className="p-8">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-14 h-14">
                        <AvatarImage src="/placeholder.svg?height=56&width=56" />
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-lg">
                          MP
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">Dr. Meera Patel</h4>
                        <p className="text-gray-600 font-medium">AI Researcher at AIIMS</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <p className="text-gray-700 mb-8 leading-relaxed font-medium text-lg">
                      New research on AI in diagnostics shows promising results! Our algorithm achieved 95% accuracy in
                      early cancer detection. The future of healthcare is here. #AIinHealthcare #Research
                    </p>
                    <div className="flex items-center space-x-8 text-gray-500">
                      <button className="flex items-center space-x-2 hover:text-red-500 transition-colors duration-200">
                        <Heart className="w-5 h-5" />
                        <span className="font-semibold">42 likes</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors duration-200">
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-semibold">15 comments</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors duration-200">
                        <Share2 className="w-5 h-5" />
                        <span className="font-semibold">Share</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Enhanced User Onboarding Section */}
          <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
              <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
              <div className="mb-10">
                <Badge className="bg-white/20 text-white border-white/30 px-6 py-3 rounded-full font-semibold text-lg">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Join 10,000+ Medical Professionals
                </Badge>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Start Your Med Connect Journey</h2>
              <p className="text-xl text-blue-100 mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
                Join thousands of medical professionals building their careers and connections. Choose your path and get
                started today.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Sign Up as Doctor
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
                  >
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Sign Up as Student
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
                  >
                    <Building2 className="w-5 h-5 mr-2" />
                    Sign Up as Institution
                  </Button>
                </Link>
              </div>
              <Link
                href="/login"
                className="text-blue-200 hover:text-white underline font-semibold text-lg transition-colors duration-200"
              >
                Already have an account? Login here
              </Link>
            </div>
          </section>

          {/* Enhanced Footer */}
          <footer className="bg-gray-900 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="md:col-span-1">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg">
                      <Stethoscope className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-2xl font-bold">Med Connect</span>
                  </div>
                  <p className="text-gray-400 mb-8 leading-relaxed font-medium">
                    Connecting medical professionals worldwide for better healthcare outcomes and career advancement.
                  </p>
                  <Select>
                    <SelectTrigger className="w-44 bg-gray-800 border-gray-700 rounded-2xl hover:bg-gray-700 transition-colors duration-300">
                      <SelectValue placeholder="🌐 Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="hi">🇮🇳 हिंदी</SelectItem>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-8">Company</h4>
                  <ul className="space-y-5 text-gray-400">
                    <li>
                      <Link
                        href="#"
                        className="hover:text-white transition-colors duration-200 flex items-center group font-medium"
                      >
                        <Activity className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="hover:text-white transition-colors duration-200 flex items-center group font-medium"
                      >
                        <Users className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                        Careers
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="hover:text-white transition-colors duration-200 flex items-center group font-medium"
                      >
                        <Award className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                        Press
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="hover:text-white transition-colors duration-200 flex items-center group font-medium"
                      >
                        <TrendingUp className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                        Blog
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-8">Support</h4>
                  <ul className="space-y-5 text-gray-400">
                    <li>
                      <Link
                        href="#"
                        className="hover:text-white transition-colors duration-200 flex items-center group font-medium"
                      >
                        <MessageCircle className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                        Contact
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="hover:text-white transition-colors duration-200 flex items-center group font-medium"
                      >
                        <Search className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                        Help Center
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="hover:text-white transition-colors duration-200 flex items-center group font-medium"
                      >
                        <Shield className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="hover:text-white transition-colors duration-200 flex items-center group font-medium"
                      >
                        <Settings className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                        Terms
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-8">Follow Us</h4>
                  <div className="flex space-x-4">
                    <Link
                      href="#"
                      className="w-14 h-14 bg-gray-800 rounded-3xl flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    >
                      <Linkedin className="w-6 h-6" />
                    </Link>
                    <Link
                      href="#"
                      className="w-14 h-14 bg-gray-800 rounded-3xl flex items-center justify-center hover:bg-blue-400 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    >
                      <Twitter className="w-6 h-6" />
                    </Link>
                    <Link
                      href="#"
                      className="w-14 h-14 bg-gray-800 rounded-3xl flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    >
                      <Youtube className="w-6 h-6" />
                    </Link>
                    <Link
                      href="#"
                      className="w-14 h-14 bg-gray-800 rounded-3xl flex items-center justify-center hover:bg-blue-800 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    >
                      <Facebook className="w-6 h-6" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 mt-16 pt-10 text-center text-gray-400">
                <p className="font-medium">
                  &copy; {new Date().getFullYear()} Med Connect. All rights reserved. Made with ❤️ for healthcare
                  professionals.
                </p>
              </div>
            </div>
          </footer>

          {/* Enhanced Back to Top Button */}
          {showBackToTop && (
            <Button
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50 group"
              size="sm"
            >
              <ArrowUp className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </Button>
          )}

          {/* Enhanced Mobile Floating Action Button */}
          <div className="lg:hidden fixed bottom-6 right-6 z-40">
            <Link href="/jobs">
              <Button className="w-18 h-18 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group">
                <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
