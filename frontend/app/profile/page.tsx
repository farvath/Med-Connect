// app/profile/page.tsx
'use client'; 

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; 
import Image from 'next/image'; 
import { IUserProfile, IEducation, IExperience } from '@/types/user'; 
import { apiFetch, apiPost, apiPut } from '@/lib/api'; 
import { useAuth } from '@/contexts/AuthContext';
import UserContentManager from './UserContentManager';



const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { user: contextUser, loading: authLoading, refreshUser } = useAuth();
  const [userData, setUserData] = useState<IUserProfile | null>(null); // State for displaying user data
  const [loading, setLoading] = useState(true); // Loading state for initial fetch
  const [error, setError] = useState<string | null>(null); // Error message state
  const [editMode, setEditMode] = useState(false); // Toggle for edit mode
  const [formValues, setFormValues] = useState<IUserProfile | null>(null); // State for form inputs (editable data)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null); // State for new profile picture file
  const [isSaving, setIsSaving] = useState(false); // State for save button loading
  const [message, setMessage] = useState(''); // General success/error message for updates

  // --- Effect to get user data from context or redirect if not logged in ---
  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    
    if (!contextUser) {
      // User not logged in, redirect to login
      router.push('/login');
      return;
    }

    // Use data from context
    setUserData(contextUser);
    setFormValues(contextUser);
    setLoading(false);
  }, [contextUser, authLoading, router]);

  // --- Handlers for form input changes ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // Handler for profile picture file selection
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageFile(e.target.files[0]); // Store the selected file object
    }
  };

  // Generic handler for changes within education and experience arrays
  const handleArrayInputChange = <T extends 'education' | 'experience'>(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: T extends 'education' ? keyof IEducation : keyof IExperience, // Corrected type definition
    type: T
  ) => {
    const { name, value, type: inputType, checked } = e.target as HTMLInputElement;

    setFormValues((prev) => {
      if (!prev) return null;
      const updatedArray: (IEducation | IExperience)[] = [...prev[type]];

      // Handle checkbox for 'current' in experience
      if (type === 'experience' && field === 'current') { // Use field here directly
        (updatedArray[index] as IExperience).current = checked;
        if (checked) {
          // If "I currently work here" is checked, clear end date
          (updatedArray[index] as IExperience).endDate = undefined;
        }
      } else {
        // Update regular text/date fields
        // Cast to 'any' for safety here due to complex union type on `updatedArray[index]`
        (updatedArray[index] as any)[field] = value;
      }
      return { ...prev, [type]: updatedArray };
    });
  };

  // Add new item to education or experience array
  const addArrayItem = (type: 'education' | 'experience') => {
    setFormValues((prev) => {
      if (!prev) return null;
      if (type === 'education') {
        return {
          ...prev,
          education: [...prev.education, { degree: '', institution: '', fieldOfStudy: '', startDate: '' }],
        };
      } else {
        return {
          ...prev,
          experience: [
            ...prev.experience,
            { title: '', company: '', location: '', startDate: '', current: false },
          ],
        };
      }
    });
  };

  // Remove item from education or experience array
  const removeArrayItem = (index: number, type: 'education' | 'experience') => {
    setFormValues((prev) => {
      if (!prev) return null;
      const updatedArray = [...prev[type]];
      updatedArray.splice(index, 1); // Remove item at specified index
      return { ...prev, [type]: updatedArray };
    });
  };

  // --- Handle form submission for updating profile ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsSaving(true); // Show saving indicator
    setMessage(''); // Clear previous messages

    if (!formValues) {
      setMessage('No data to save.');
      setIsSaving(false);
      return;
    }

    try {
      // FormData is essential for sending files along with text data
      const formData = new FormData();

      // Append all form values to FormData
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key)) {
          const value = (formValues as any)[key];
          if (Array.isArray(value)) {
            // Convert arrays to JSON strings before appending to FormData
            // Backend needs to parse these JSON strings
            formData.append(key, JSON.stringify(value));
          } else if (value !== null && value !== undefined) {
            // Append other basic fields
            formData.append(key, value);
          }
        }
      }

      // Append profile image file if selected
      if (profileImageFile) {
        formData.append('profilePic', profileImageFile); // 'profilePic' should match backend Multer field name
      }

      console.log('Submitting form data:', formData.keys);

      // Send a PUT request to your backend update API,
      const response = await apiPut<IUserProfile>('/user/updateUser', formData);

      // Update local state with the newly saved data
      const updatedData: IUserProfile = response;
      // Re-format dates from backend (Date objects) to ISO strings for form inputs
      const formattedEducation = updatedData.education.map(edu => ({
        ...edu,
        startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '',
        endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : undefined,
      }));
      const formattedExperience = updatedData.experience.map(exp => ({
        ...exp,
        startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
        endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : undefined,
      }));


      setUserData({ ...updatedData, education: formattedEducation, experience: formattedExperience });
      setFormValues({ ...updatedData, education: formattedEducation, experience: formattedExperience });
      
      // Refresh the AuthContext with the updated user data
      await refreshUser();
      
      setEditMode(false); // Exit edit mode
      setProfileImageFile(null); // Clear selected file after successful upload
      setMessage('Profile updated successfully!'); // Show success message
    } catch (err: any) {
      console.error('Error updating user data:', err);
      setMessage(err.response?.data?.message || 'Failed to update profile.'); // Show error message
    } finally {
      setIsSaving(false); // Hide saving indicator
    }
  };

  // --- Render Loading, Error, or Profile Content ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 font-inter">
        <div className="text-xl font-semibold text-gray-700">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-100 text-red-700 font-inter p-4">
        <div className="text-xl font-semibold">Error: {error}</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-700 font-inter">
        <div className="text-xl font-semibold">No user data found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 md:p-6 lg:p-8 font-inter">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
        {/* Profile Header Section (Always Visible) */}
        <div className="flex flex-col items-center border-b pb-4 md:pb-6 mb-4 md:mb-6">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
            {/* Replaced Next.js Image component with standard <img> tag to avoid Next.js specific imports */}
            <img
              src={userData.profilePic?.url || 'https://placehold.co/128x128/aabbcc/ffffff?text=No+Pic'} // Placeholder if no profile pic
              alt="Profile Picture"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 md:mt-4 text-center px-4">
            {userData.name}
          </h1>
          {userData.headline && (
            <p className="text-gray-600 text-base md:text-lg mt-1 text-center px-4">{userData.headline}</p>
          )}
          <p className="text-gray-500 text-sm md:text-md mt-1 text-center px-4 leading-relaxed">
            {userData.specialty} {userData.institution ? `at ${userData.institution}` : ''} &bull; {userData.location}
          </p>
          {userData.bio && (
            <p className="text-gray-700 text-center mt-3 md:mt-4 max-w-2xl px-4 text-sm md:text-base leading-relaxed">{userData.bio}</p>
          )}
          <button
            onClick={() => {
              setEditMode(!editMode);
              setMessage(''); // Clear messages when toggling edit mode
              if (!editMode) {
                // If entering edit mode, reset formValues to current userData
                const formattedEducation = userData.education.map(edu => ({
                  ...edu,
                  startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '',
                  endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : undefined,
                }));
                const formattedExperience = userData.experience.map(exp => ({
                  ...exp,
                  startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
                  endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : undefined,
                }));
                setFormValues({ ...userData, education: formattedEducation, experience: formattedExperience });
              }
            }}
            className="mt-4 md:mt-6 px-4 md:px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 text-sm md:text-base"
          >
            {editMode ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Content - Display Mode */}
        {!editMode && (
          <div className="space-y-6 md:space-y-8">
            {/* Education Section - Always show heading */}
            <section>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4 border-b pb-2">Education</h2>
              {userData.education.length > 0 ? (
                userData.education.map((edu, index) => (
                  <div key={edu._id || index} className="mb-3 md:mb-4 p-3 md:p-4 bg-gray-50 rounded-lg shadow-sm">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900">{edu.degree} in {edu.fieldOfStudy}</h3>
                    <p className="text-gray-700 text-sm md:text-base">{edu.institution}</p>
                    <p className="text-gray-500 text-xs md:text-sm">
                      {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                    </p>
                    {edu.description && <p className="text-gray-600 mt-2 text-sm md:text-base">{edu.description}</p>}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic text-sm md:text-base">No education details added yet.</p>
              )}
            </section>

            {/* Experience Section - Always show heading */}
            <section>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4 border-b pb-2">Experience</h2>
              {userData.experience.length > 0 ? (
                userData.experience.map((exp, index) => (
                  <div key={exp._id || index} className="mb-3 md:mb-4 p-3 md:p-4 bg-gray-50 rounded-lg shadow-sm">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900">{exp.title}</h3>
                    <p className="text-gray-700 text-sm md:text-base">{exp.company} &bull; {exp.location}</p>
                    <p className="text-gray-500 text-xs md:text-sm">
                      {new Date(exp.startDate).getFullYear()} - {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '')}
                    </p>
                    {exp.description && <p className="text-gray-600 mt-2 text-sm md:text-base">{exp.description}</p>}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic text-sm md:text-base">No experience details added yet.</p>
              )}
            </section>

            {/* User Content Manager Section */}
            <section>
              <UserContentManager userId={userData._id} />
            </section>
          </div>
        )}

        {/* Profile Content - Edit Mode Form */}
        {editMode && formValues && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div
                className={`p-3 rounded-lg text-center font-medium ${
                  message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {message}
              </div>
            )}

            {/* Basic Info Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formValues.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            
            </div>

            <div>
              <label htmlFor="headline" className="block text-gray-700 text-sm font-bold mb-2">Headline</label>
              <input
                type="text"
                id="headline"
                name="headline"
                value={formValues.headline || ''}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Software Engineer at Google"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-2">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formValues.bio || ''}
                onChange={handleInputChange}
                rows={4}
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>

            <div>
              <label htmlFor="specialty" className="block text-gray-700 text-sm font-bold mb-2">Specialty</label>
              <input
                type="text"
                id="specialty"
                name="specialty"
                value={formValues.specialty || ''}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formValues.location || ''}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Profile Picture Upload Input */}
            <div>
              <label htmlFor="profilePic" className="block text-gray-700 text-sm font-bold mb-2">Profile Picture</label>
              <input
                type="file"
                id="profilePic"
                name="profilePic"
                accept="image/*" // Accept only image files
                onChange={handleProfileImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {profileImageFile && (
                <p className="text-gray-600 text-sm mt-2">Selected: {profileImageFile.name}</p>
              )}
            </div>

            {/* Education Section (Editable) */}
            <section className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Education</h2>
              {formValues.education.map((edu, index) => (
                <div key={edu._id || `new-edu-${index}`} className="mb-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1">Degree</label>
                      <input
                        type="text"
                        name="degree"
                        value={edu.degree}
                        onChange={(e) => handleArrayInputChange(e, index, 'degree', 'education')}
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1">Field of Study</label>
                      <input
                        type="text"
                        name="fieldOfStudy"
                        value={edu.fieldOfStudy}
                        onChange={(e) => handleArrayInputChange(e, index, 'fieldOfStudy', 'education')}
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Institution</label>
                    <input
                      type="text"
                      name="institution"
                      value={edu.institution}
                      onChange={(e) => handleArrayInputChange(e, index, 'institution', 'education')}
                      className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={edu.startDate || ''} // Ensure it's a string, empty if null/undefined
                        onChange={(e) => handleArrayInputChange(e, index, 'startDate', 'education')}
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1">End Date (Optional)</label>
                      <input
                        type="date"
                        name="endDate"
                        value={edu.endDate || ''} // Ensure it's a string
                        onChange={(e) => handleArrayInputChange(e, index, 'endDate', 'education')}
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Description (Optional)</label>
                    <textarea
                      name="description"
                      value={edu.description || ''}
                      onChange={(e) => handleArrayInputChange(e, index, 'description', 'education')}
                      rows={2}
                      className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'education')}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Remove Education
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('education')}
                className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
              >
                Add Education
              </button>
            </section>

            {/* Experience Section (Editable) */}
            <section className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Experience</h2>
              {formValues.experience.map((exp, index) => (
                <div key={exp._id || `new-exp-${index}`} className="mb-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={exp.title}
                      onChange={(e) => handleArrayInputChange(e, index, 'title', 'experience')}
                      className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={exp.company}
                      onChange={(e) => handleArrayInputChange(e, index, 'company', 'experience')}
                      className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={exp.location}
                      onChange={(e) => handleArrayInputChange(e, index, 'location', 'experience')}
                      className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={exp.startDate || ''}
                        onChange={(e) => handleArrayInputChange(e, index, 'startDate', 'experience')}
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1">End Date (Optional)</label>
                      <input
                        type="date"
                        name="endDate"
                        value={exp.endDate || ''}
                        onChange={(e) => handleArrayInputChange(e, index, 'endDate', 'experience')}
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={exp.current} // Disable if 'current' is checked
                      />
                    </div>
                  </div>
                  <div className="mb-2 flex items-center">
                    <input
                      type="checkbox"
                      id={`current-${index}`}
                      name="current"
                      checked={exp.current}
                      onChange={(e) => handleArrayInputChange(e, index, 'current', 'experience')}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`current-${index}`} className="text-gray-700 text-sm font-bold">I currently work here</label>
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Description (Optional)</label>
                    <textarea
                      name="description"
                      value={exp.description || ''}
                      onChange={(e) => handleArrayInputChange(e, index, 'description', 'experience')}
                      rows={2}
                      className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'experience')}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Remove Experience
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('experience')}
                className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
              >
                Add Experience
              </button>
            </section>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
