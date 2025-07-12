"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { apiPost } from "@/lib/api"
import { CreateJobData } from "@/types/jobs"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function CreateJobPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [jobData, setJobData] = useState<CreateJobData>({
    title: "",
    description: "",
    requirements: [""],
    responsibilities: [""],
    benefits: [""],
    salary: "",
    location: "",
    type: "Full-time",
    experience: "",
    aboutInstitution: "",
    institution: {
      name: "",
      id: ""
    }
  });

  // Check if user is authorized to create jobs
  useEffect(() => {
    if (!user) {
      toast.error('Please login to create jobs');
      router.push('/login');
      return;
    }

    const isAuthorized = user.accountType === 'Institution' || 
                        user.accountType === 'Hospital' || 
                        user.email.includes('@hospital') || 
                         user.email.includes('@edu.in') || 
                         user.email.includes('@edu') || 
                        user.email.includes('@medical');

    if (!isAuthorized) {
      toast.error('Only users with hospital/institution accounts can post jobs');
      router.push('/jobs');
      return;
    }

    // Pre-fill institution data from user profile
    setJobData(prev => ({
      ...prev,
      institution: {
        name: user.institution || "",
        id: user._id
      },
      aboutInstitution: user.bio || ""
    }));
  }, [user, router]);

  const handleInputChange = (field: keyof CreateJobData, value: any) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'requirements' | 'responsibilities' | 'benefits', index: number, value: string) => {
    setJobData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'requirements' | 'responsibilities' | 'benefits') => {
    setJobData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const removeArrayItem = (field: 'requirements' | 'responsibilities' | 'benefits', index: number) => {
    setJobData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!jobData.title || !jobData.description || !jobData.salary || !jobData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (jobData.requirements.filter(req => req.trim()).length === 0) {
      toast.error('Please add at least one requirement');
      return;
    }

    if (jobData.responsibilities.filter(resp => resp.trim()).length === 0) {
      toast.error('Please add at least one responsibility');
      return;
    }

    try {
      setLoading(true);
      
      // Filter out empty strings from arrays
      const cleanedData = {
        ...jobData,
        requirements: jobData.requirements.filter(req => req.trim()),
        responsibilities: jobData.responsibilities.filter(resp => resp.trim()),
        benefits: jobData.benefits.filter(benefit => benefit.trim())
      };

      await apiPost('/jobs', cleanedData);
      toast.success('Job posted successfully!');
      router.push('/jobs');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/jobs">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">Post a New Job</h1>
          <p className="text-gray-600">Fill in the details to post a new job opening</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Provide the basic details about the job</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={jobData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Medical Oncologist"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={jobData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Mangalore, Karnataka"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Job Type *</Label>
                  <Select value={jobData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="experience">Experience Required *</Label>
                  <Input
                    id="experience"
                    value={jobData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="e.g., 3+ years"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="salary">Salary *</Label>
                  <Input
                    id="salary"
                    value={jobData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    placeholder="e.g., ₹20L - ₹30L per annum"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="institution">Institution Name *</Label>
                  <Input
                    id="institution"
                    value={jobData.institution.name}
                    onChange={(e) => handleInputChange('institution', { ...jobData.institution, name: e.target.value })}
                    placeholder="e.g., KMC Hospital"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={jobData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>List the qualifications and requirements for this position</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {jobData.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={req}
                      onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                      placeholder="e.g., MD in Cardiology"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('requirements', index)}
                      className="shrink-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('requirements')}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Requirement
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Responsibilities</CardTitle>
              <CardDescription>Outline the key responsibilities for this role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {jobData.responsibilities.map((resp, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={resp}
                      onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                      placeholder="e.g., Diagnose and treat cardiac conditions"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('responsibilities', index)}
                      className="shrink-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('responsibilities')}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Responsibility
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
              <CardDescription>List the benefits and perks offered with this position</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {jobData.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={benefit}
                      onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                      placeholder="e.g., Health insurance coverage"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('benefits', index)}
                      className="shrink-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('benefits')}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Benefit
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About Institution */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>About the Institution</CardTitle>
              <CardDescription>Provide information about your institution</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={jobData.aboutInstitution}
                onChange={(e) => handleInputChange('aboutInstitution', e.target.value)}
                placeholder="Tell candidates about your institution, its values, culture, and what makes it a great place to work..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {loading ? 'Posting Job...' : 'Post Job'}
            </Button>
            <Link href="/jobs">
              <Button type="button" variant="outline" className="px-8">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
