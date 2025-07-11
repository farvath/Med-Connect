'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Building, GraduationCap, Briefcase, Mail, Phone } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface Education {
  _id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

interface Experience {
  _id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  description?: string;
  current: boolean;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  profilePic?: {
    url: string;
    publicId: string;
  };
  headline?: string;
  bio?: string;
  specialty?: string;
  institution?: string;
  location?: string;
  accountType: 'Student' | 'Professional' | 'Hospital' | 'Institution';
  phone?: string;
  education: Education[];
  experience: Experience[];
}

export default function ViewProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await apiFetch<UserProfile>(`/user/${userId}`);
        setProfile(response);
      } catch (error: any) {
        console.error('Failed to fetch profile:', error);
        setError('Failed to load profile. The user may not exist or the profile is private.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600">{error || 'The requested profile could not be found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.profilePic?.url} alt={profile.name} />
                <AvatarFallback className="text-xl">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                {profile.headline && (
                  <p className="text-lg text-gray-600 mt-1">{profile.headline}</p>
                )}
                
                <div className="flex flex-wrap gap-4 mt-4 justify-center sm:justify-start">
                  {profile.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{profile.location}</span>
                    </div>
                  )}
                  {profile.institution && (
                    <div className="flex items-center text-gray-600">
                      <Building className="h-4 w-4 mr-1" />
                      <span className="text-sm">{profile.institution}</span>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-1" />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                  <Badge variant="secondary">{profile.accountType}</Badge>
                  {profile.specialty && (
                    <Badge variant="outline">{profile.specialty}</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio Section */}
        {profile.bio && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Experience Section */}
        {profile.experience && profile.experience.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {profile.experience.map((exp, index) => (
                  <div key={exp._id || index}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                        <p className="text-blue-600">{exp.company}</p>
                        {exp.location && (
                          <div className="flex items-center text-gray-600 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{exp.location}</span>
                          </div>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(exp.startDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })} - {
                            exp.current 
                              ? 'Present' 
                              : exp.endDate 
                                ? new Date(exp.endDate).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    year: 'numeric' 
                                  })
                                : 'Present'
                          }
                        </p>
                        {exp.description && (
                          <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>
                        )}
                      </div>
                    </div>
                    {index < profile.experience.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Education Section */}
        {profile.education && profile.education.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {profile.education.map((edu, index) => (
                  <div key={edu._id || index}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{edu.institution}</h3>
                        <p className="text-blue-600">{edu.degree}</p>
                        {edu.fieldOfStudy && (
                          <p className="text-gray-600">{edu.fieldOfStudy}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(edu.startDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })} - {
                            edu.endDate 
                              ? new Date(edu.endDate).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  year: 'numeric' 
                                })
                              : 'Present'
                          }
                        </p>
                        {edu.description && (
                          <p className="text-gray-700 mt-2 text-sm">{edu.description}</p>
                        )}
                      </div>
                    </div>
                    {index < profile.education.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
