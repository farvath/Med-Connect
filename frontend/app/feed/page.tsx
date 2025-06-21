"use client"
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Share2, TrendingUp, Plus, X } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function FeedPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [videos, setVideos] = useState<File[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleFileAdd = (files: FileList | null, setter: Function) => {
    if (!files) return;
    setter((prev: File[]) => [...prev, ...Array.from(files)]);
  };

  const handleFileRemove = (index: number, setter: Function) => {
    setter((prev: File[]) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Community Feed</h1>
          <p className="text-gray-600">Stay updated with the latest from the medical community</p>
        </div>

        {/* Feed Posts */}
        <div className="space-y-6">
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

        </div>
        {/* Floating Button */}
        <Button
          onClick={() => setModalOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 p-0 shadow-lg"
        >
          <Plus className="w-6 h-6" />
          
        </Button>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-white/20 backdrop-blur-sm z-40 flex items-center justify-center px-2">
           <div
  ref={modalRef}
  className="bg-white rounded-xl shadow-2xl w-full sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto relative mx-2"
>
  <div className="border-b p-4">
    <h2 className="text-xl font-semibold text-blue-800">Create a New Post</h2>
  </div>

              <Tabs defaultValue="video" className="w-full p-6">
                <TabsList className="grid w-full grid-cols-3 mb-6 border-b pb-2">
                  <TabsTrigger value="video" className="text-md font-medium data-[state=active]:text-blue-600 data-[state=active]:border-b-2 border-blue-600">Video</TabsTrigger>
                  <TabsTrigger value="photo" className="text-md font-medium data-[state=active]:text-blue-600 data-[state=active]:border-b-2 border-blue-600">Photo</TabsTrigger>
                  <TabsTrigger value="article" className="text-md font-medium data-[state=active]:text-blue-600 data-[state=active]:border-b-2 border-blue-600">Write Article</TabsTrigger>
                </TabsList>

                <TabsContent value="video">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      {videos.map((video, index) => (
                        <div key={index} className="relative w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                          <video className="w-full h-full object-cover rounded-lg" src={URL.createObjectURL(video)} controls />
                        </div>
                      ))}
                      <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400">
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => handleFileAdd(e.target.files, setVideos)}
                        />
                        <Plus className="text-gray-500" />
                      </label>
                    </div>
                    <Textarea placeholder="Write something about your video..." />
                    <div className="pt-2 text-right">
                      <Button className="bg-blue-600 text-white hover:bg-blue-700">Post</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="photo">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                          <img src={URL.createObjectURL(photo)} className="w-full h-full object-cover" alt="Uploaded" />
                        </div>
                      ))}
                      <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileAdd(e.target.files, setPhotos)}
                        />
                        <Plus className="text-gray-500" />
                      </label>
                    </div>
                    <Textarea placeholder="Write something about your photos..." />
                    <div className="pt-2 text-right">
                      <Button className="bg-blue-600 text-white hover:bg-blue-700">Post</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="article">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Write your article here..."
                      rows={12}
                      className="border-gray-300"
                    />
                    <div className="text-right">
                      <Button className="bg-blue-600 text-white hover:bg-blue-700">Post</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

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
      </div>
    </div>
  );
}
