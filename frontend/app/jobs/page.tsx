"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Clock, Building2, Briefcase, Calendar } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const jobsData = [
 
  {
    id: 1,
    title: "Medical Oncologist",
    institution: "Yenepoya Medical College",
    location: "Mangalore",
    type: "Full-time",
    experience: "4+ years",
    salary: "₹22L - ₹32L per annum",
    description: "Join our oncology department to provide comprehensive cancer care and treatment.",
    requirements: [
      "MD/DM in Medical Oncology",
      "Valid medical license",
      "Experience in cancer treatment",
      "Research experience preferred"
    ],
    responsibilities: [
      "Diagnose and treat various types of cancer",
      "Develop and implement treatment plans",
      "Collaborate with multidisciplinary teams",
      "Participate in clinical trials",
      "Provide patient education and support"
    ],
    benefits: [
      "Health insurance coverage",
      "Professional development opportunities",
      "Research funding support",
      "Flexible work schedule",
      "Paid time off"
    ],
    aboutInstitution: "Yenepoya Medical College is a premier medical institution known for its excellence in medical education and healthcare services. We are committed to providing the highest quality of patient care and advancing medical research."
  },
  {
    id: 2,
    title: "Emergency Medicine Specialist",
    institution: "KMC Hospital, Mangalore",
    location: "Mangalore",
    type: "Full-time",
    experience: "3+ years",
    salary: "₹18L - ₹28L per annum",
    description: "Join our emergency department to provide critical care in high-pressure situations.",
    requirements: [
      "MD in Emergency Medicine",
      "Valid medical license",
      "Experience in emergency care",
      "Strong decision-making skills"
    ],
    responsibilities: [
      "Handle emergency cases",
      "Coordinate with other departments",
      "Manage trauma cases",
      "Supervise emergency staff",
      "Maintain emergency protocols"
    ],
    benefits: [
      "Competitive salary package",
      "Health and life insurance",
      "Professional development",
      "Shift allowances",
      "Emergency response training"
    ],
    aboutInstitution: "KMC Hospital is a leading healthcare provider in Mangalore, known for its state-of-the-art facilities and commitment to patient care. Our emergency department is equipped with the latest technology and staffed by experienced professionals."
  },
  {
    id: 3,
    title: "Radiologist",
    institution: "Father Muller Medical College Hospital",
    location: "Mangalore",
    type: "Full-time",
    experience: "4+ years",
    salary: "₹20L - ₹30L per annum",
    description: "Join our radiology department to provide diagnostic imaging services.",
    requirements: [
      "MD in Radiology",
      "Valid medical license",
      "Experience in diagnostic imaging",
      "Knowledge of latest imaging technologies"
    ],
    responsibilities: [
      "Perform and interpret diagnostic imaging",
      "Collaborate with other specialists",
      "Maintain imaging equipment",
      "Train junior staff",
      "Ensure quality control"
    ],
    benefits: [
      "Modern imaging equipment",
      "Research opportunities",
      "Professional development",
      "Health insurance",
      "Work-life balance"
    ],
    aboutInstitution: "Father Muller Medical College Hospital is a renowned healthcare institution with a strong focus on medical education and patient care. Our radiology department is equipped with cutting-edge technology and offers a supportive work environment."
  },
  {
    id: 4,
    title: "Dermatologist",
    institution: "K.S. Hegde Medical Academy",
    location: "Mangalore",
    type: "Full-time",
    experience: "3+ years",
    salary: "₹18L - ₹28L per annum",
    description: "Join our dermatology department to provide specialized skin care and treatment.",
    requirements: [
      "MD in Dermatology",
      "Valid medical license",
      "Experience in dermatological procedures",
      "Knowledge of latest treatments"
    ],
    responsibilities: [
      "Diagnose and treat skin conditions",
      "Perform dermatological procedures",
      "Provide cosmetic dermatology services",
      "Maintain patient records",
      "Collaborate with other specialists"
    ],
    benefits: [
      "Modern dermatology equipment",
      "Professional development",
      "Health insurance",
      "Flexible scheduling",
      "Research opportunities"
    ],
    aboutInstitution: "K.S. Hegde Medical Academy is a prestigious medical institution known for its excellence in medical education and patient care. Our dermatology department is equipped with state-of-the-art facilities."
  },
  {
    id: 5,
    title: "Psychiatrist",
    institution: "Yenepoya Specialty Hospital",
    location: "Mangalore",
    type: "Full-time",
    experience: "4+ years",
    salary: "₹20L - ₹30L per annum",
    description: "Join our psychiatry department to provide mental health care and treatment.",
    requirements: [
      "MD in Psychiatry",
      "Valid medical license",
      "Experience in mental health care",
      "Strong communication skills"
    ],
    responsibilities: [
      "Diagnose and treat mental health conditions",
      "Provide psychotherapy",
      "Prescribe and monitor medications",
      "Collaborate with healthcare teams",
      "Maintain patient confidentiality"
    ],
    benefits: [
      "Private practice opportunities",
      "Professional development",
      "Health insurance",
      "Work-life balance",
      "Research support"
    ],
    aboutInstitution: "Yenepoya Specialty Hospital is a leading healthcare provider with a dedicated focus on mental health care. Our psychiatry department offers comprehensive mental health services."
  },
  {
    id: 6,
    title: "Pediatric Surgeon",
    institution: "Father Muller Medical College Hospital",
    location: "Mangalore",
    type: "Full-time",
    experience: "5+ years",
    salary: "₹25L - ₹35L per annum",
    description: "Join our pediatric surgery department to provide specialized surgical care for children.",
    requirements: [
      "MCh in Pediatric Surgery",
      "Valid medical license",
      "Experience in pediatric surgery",
      "Excellent surgical skills"
    ],
    responsibilities: [
      "Perform pediatric surgeries",
      "Pre and post-operative care",
      "Train junior surgeons",
      "Maintain surgical protocols",
      "Emergency surgical care"
    ],
    benefits: [
      "Advanced surgical equipment",
      "Professional development",
      "Health insurance",
      "Research opportunities",
      "Competitive salary"
    ],
    aboutInstitution: "Father Muller Medical College Hospital is renowned for its pediatric care services. Our pediatric surgery department is equipped with the latest technology and staffed by experienced professionals."
  }
]

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Medical Jobs in Mangalore</h1>
          <p className="text-gray-600">Find the best medical opportunities in Mangalore's top healthcare institutions</p>
        </div>

        {/* Jobs Grid with Scroll */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
          {jobsData.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{job.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {job.institution}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    {job.type}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {job.experience}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{job.type}</Badge>
                    <Badge variant="secondary">{job.experience}</Badge>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">View Details</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{job.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold mb-2">Institution</h3>
                          <p>{job.institution}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Location</h3>
                          <p>{job.location}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Description</h3>
                          <p>{job.description}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">What You'll Do</h3>
                          <ul className="list-disc list-inside space-y-1">
                            {job.responsibilities?.map((resp, index) => (
                              <li key={index}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Requirements</h3>
                          <ul className="list-disc list-inside space-y-1">
                            {job.requirements?.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Benefits</h3>
                          <ul className="list-disc list-inside space-y-1">
                            {job.benefits?.map((benefit, index) => (
                              <li key={index}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">About the Institution</h3>
                          <p>{job.aboutInstitution}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Salary</h3>
                          <p>{job.salary}</p>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Apply Now</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
