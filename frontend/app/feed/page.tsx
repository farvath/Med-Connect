import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageSquare, Share2, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Community Feed</h1>
          <p className="text-gray-600">Stay updated with the latest from the medical community</p>
        </div>

        {/* Feed Posts */}
        <div className="space-y-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback className="bg-blue-100 text-blue-600">DR</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-blue-900">Dr. Rajesh Rao</h4>
                  <p className="text-sm text-gray-600">Cardiologist at Apollo Hospitals • 2 hours ago</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Excited to announce my new role as Chief Cardiologist at Apollo Hospitals! Looking forward to advancing
                cardiac care and mentoring the next generation of cardiologists. The future of healthcare is bright! 🏥❤️
              </p>
              <div className="flex items-center space-x-6 text-gray-500">
                <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>24 likes</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  <span>8 comments</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback className="bg-green-100 text-green-600">MP</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-blue-900">Dr. Meera Patel</h4>
                  <p className="text-sm text-gray-600">AI Researcher at AIIMS • 5 hours ago</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Breakthrough in AI diagnostics! Our latest research shows 95% accuracy in early cancer detection using
                machine learning algorithms. This could revolutionize how we approach preventive healthcare. What are
                your thoughts on AI integration in clinical practice? 🤖🔬
              </p>
              <div className="flex items-center space-x-6 text-gray-500">
                <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>42 likes</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  <span>15 comments</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback className="bg-purple-100 text-purple-600">AS</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-blue-900">Dr. Anita Sharma</h4>
                  <p className="text-sm text-gray-600">Pediatrician at Fortis Healthcare • 1 day ago</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Just completed a successful pediatric surgery! It's moments like these that remind me why I chose
                medicine. Every child deserves the best care possible. Grateful for my amazing team at Fortis
                Healthcare. 👶✨
              </p>
              <div className="flex items-center space-x-6 text-gray-500">
                <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>67 likes</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  <span>12 comments</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trending Topics */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <TrendingUp className="w-5 h-5 mr-2" />
              Trending Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-blue-600 hover:underline cursor-pointer">#AIinHealthcare</span>
                <span className="text-gray-500 text-sm">1.2k posts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 hover:underline cursor-pointer">#MedicalInnovation</span>
                <span className="text-gray-500 text-sm">856 posts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 hover:underline cursor-pointer">#CardiacSurgery</span>
                <span className="text-gray-500 text-sm">634 posts</span>
              </div>
            </div>
          </CardContent>
        </Card>

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
