"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import api from "../lib/api";
import { useCallback, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, MessageCircle, Plus, Menu, X, Stethoscope, User, Settings, LogOut, Home, Users, Briefcase, GraduationCap, Building2, Rss, LogIn, UserPlus } from "lucide-react";
import Image from "next/image";
import { useAuth } from "./AuthContext";

// Reusable NavbarItem component
function NavbarItem({ href, label, active, Icon }: { href: string; label: string; active?: boolean; Icon?: any }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-full font-medium transition-all duration-300 ease-in-out ${active ? "bg-blue-600 text-white shadow-md scale-105" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:scale-105"} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {Icon && <Icon className="w-4 h-4" />}
          <span className="hidden xl:block font-semibold">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent className="xl:hidden bg-gray-900 text-white">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

// Enhanced SearchBar
function SearchBar() {
  return (
    <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
      <div className="relative w-full">
        <Input
          placeholder="Search jobs, colleges, or professionals"
          className="pl-12 pr-4 py-3.5 bg-gray-100/90 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-full transition-all duration-300 placeholder:text-gray-500 text-gray-700 font-medium"
        />
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Bell className="w-5 h-5" />
        </span>
      </div>
    </div>
  );
}

// Enhanced NotificationBar
function NotificationBar() {
  return (
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
  );
}

// Enhanced MessageBar
function MessageBar() {
  return (
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
  );
}

// Enhanced ProfileBar
function ProfileBar() {
  return (
      <div className="flex flex-col items-center ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 p-0"
            >
              <Avatar className="h-9 w-9 ring-2 ring-white shadow-lg">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Profile" />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold">JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-2xl shadow-xl border-gray-200 bg-white/95 backdrop-blur-lg"
            align="end"
            forceMount
          >
            <div className="p-4 border-b border-gray-100">
              <p className="font-semibold text-gray-900">Dr. John Doe</p>
              <p className="text-sm text-gray-600">Cardiologist</p>
            </div>
            <DropdownMenuItem className="rounded-xl p-2.5 hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
              <User className="mr-3 h-5 w-5 text-blue-600" />
              <span className="font-medium">My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl p-2.5 hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
              <Plus className="mr-3 h-5 w-5 text-blue-600" />
              <span className="font-medium">Post a Job</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl p-2.5 hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
              <Settings className="mr-3 h-5 w-5 text-gray-600" />
              <span className="font-medium">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem
              className="rounded-xl p-2.5 hover:bg-red-50 transition-colors duration-200 cursor-pointer text-red-600"
              onClick={async () => {
          await api.post("/auth/logout");
          window.location.href = "/login";
              }}
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span className="font-medium">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="flex items-center mt-0.5 text-gray-700 text-xs font-bold select-none">
          me
          <svg className="ml-1 w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
          </svg>
        </span>
        
      </div>
   
  );
}

export default function Header() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = useCallback(async () => {
    await api.post("/api/auth/logout");
    setUser(null);
    router.push("/");
  }, [router, setUser]);

  // Define nav items for both states
  const navItemsLoggedIn = [
    { href: "/feed", label: "Feed", Icon: Rss },
    { href: "/connections", label: "Connections", Icon: Users },
    { href: "/jobs", label: "Jobs", Icon: Briefcase },
  ];
  const navItemsLoggedOut = [
    { href: "/feed", label: "Feed", Icon: Rss },
    { href: "/jobs", label: "Jobs", Icon: Briefcase },
    { href: "/colleges", label: "Colleges", Icon: GraduationCap },
    { href: "/hospitals", label: "Hospitals", Icon: Building2 },
    //{ href: "/connections", label: "Connections", Icon: Users },
    // { href: "/login", label: "Login", Icon: LogIn },
    // { href: "/signup", label: "Signup", Icon: UserPlus },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/40 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
      <div className="max-w-7xl mx-20 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between my-3 h-18 gap-1">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block group-hover:text-blue-600 transition-colors duration-300">
              MedConnect
            </span>
          </Link>

          {/* Search Bar */}
          {user && <SearchBar />}

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 ">
            {(user ? navItemsLoggedIn : navItemsLoggedOut).map((item) => (
              <NavbarItem
                key={item.href}
                href={item.href}
                label={item.label}
                active={pathname === item.href}
                Icon={item.Icon}
              />
            ))}
         </nav>

    
          {/* Right Side Actions */}
          <div className="flex items-center space-x-3 ">
            {user && <NotificationBar />}
            {user && <MessageBar />}
            {user && <ProfileBar />}
          
            {!user && (
              <Link href="/signup" className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-full  hover:bg-blue-700 font-semibold transition ">Sign Up</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
