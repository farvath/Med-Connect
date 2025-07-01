import { CollegeModel } from '../models/college';

export const seedColleges = async () => {
  try {
    // Check if colleges already exist
    const existingCount = await CollegeModel.countDocuments();
    if (existingCount > 0) {
      console.log('Colleges already seeded');
      return;
    }

    const sampleColleges = [
      {
        name: "All Institute of Medical Sciences (AIIMS)",
        shortName: "AIIMS",
        location: "New Delhi, India",
        students: "2500+ students",
        established: "Established 1956",
        rating: 4.8,
        reviews: "5.2k reviews",
        programs: ["MBBS", "MD", "MS", "Research", "Super Specialty"],
        imageUrl: "/placeholder.svg",
        overview: "AIIMS is India's premier medical institute, known for excellence in medical education, research, and patient care.",
        website: "https://www.aiims.edu",
        founded: "1956",
        affiliations: ["MCI Approved", "WHO Recognized", "NAAC A++"]
      },
      {
        name: "Christian Medical College",
        shortName: "CMC Vellore",
        location: "Vellore, Tamil Nadu",
        students: "3000+ students",
        established: "Established 1900",
        rating: 4.7,
        reviews: "4.8k reviews",
        programs: ["MBBS", "MD", "Nursing", "Allied Health", "Research"],
        imageUrl: "/placeholder.svg",
        overview: "CMC Vellore is one of India's oldest and most prestigious medical institutions.",
        website: "https://www.cmch-vellore.edu",
        founded: "1900",
        affiliations: ["MCI Approved", "WHO Recognized", "NAAC A+"]
      },
      {
        name: "Jawaharlal Institute of Postgraduate Medical Education & Research",
        shortName: "JIPMER",
        location: "Puducherry, India",
        students: "2000+ students",
        established: "Established 1823",
        rating: 4.6,
        reviews: "3.5k reviews",
        programs: ["MBBS", "MD", "MS", "PG", "Super Specialty"],
        imageUrl: "/placeholder.svg",
        overview: "JIPMER is a prestigious medical institution with a rich history of medical education.",
        website: "https://www.jipmer.edu.in",
        founded: "1823",
        affiliations: ["MCI Approved", "WHO Recognized"]
      },
      {
        name: "King George's Medical University",
        shortName: "KGMU",
        location: "Lucknow, Uttar Pradesh",
        students: "2800+ students",
        established: "Established 1905",
        rating: 4.4,
        reviews: "2.9k reviews",
        programs: ["MBBS", "MD", "MS", "Nursing", "Pharmacy"],
        imageUrl: "/placeholder.svg",
        overview: "KGMU is one of the oldest medical universities in India with comprehensive healthcare programs.",
        website: "https://www.kgmcindia.edu",
        founded: "1905",
        affiliations: ["MCI Approved", "UGC Recognized"]
      },
      {
        name: "Armed Forces Medical College",
        shortName: "AFMC",
        location: "Pune, Maharashtra",
        students: "1500+ students",
        established: "Established 1948",
        rating: 4.5,
        reviews: "2.1k reviews",
        programs: ["MBBS", "MD", "MS", "Military Medicine"],
        imageUrl: "/placeholder.svg",
        overview: "AFMC is a premier medical institution serving the Indian Armed Forces.",
        website: "https://www.afmc.nic.in",
        founded: "1948",
        affiliations: ["MCI Approved", "Defense Ministry"]
      },
      {
        name: "Maulana Azad Medical College",
        shortName: "MAMC",
        location: "New Delhi, India",
        students: "2200+ students",
        established: "Established 1958",
        rating: 4.3,
        reviews: "3.2k reviews",
        programs: ["MBBS", "MD", "MS", "Research"],
        imageUrl: "/placeholder.svg",
        overview: "MAMC is a leading medical college affiliated with the University of Delhi.",
        website: "https://www.mamc.ac.in",
        founded: "1958",
        affiliations: ["MCI Approved", "University of Delhi"]
      },
      {
        name: "Kasturba Medical College",
        shortName: "KMC Manipal",
        location: "Manipal, Karnataka",
        students: "2600+ students",
        established: "Established 1953",
        rating: 4.4,
        reviews: "4.1k reviews",
        programs: ["MBBS", "MD", "Nursing", "Allied Health", "Research"],
        imageUrl: "/placeholder.svg",
        overview: "KMC Manipal is a renowned private medical institution known for quality education.",
        website: "https://www.manipal.edu",
        founded: "1953",
        affiliations: ["MCI Approved", "NAAC A"]
      },
      {
        name: "B.J. Medical College",
        shortName: "BJMC",
        location: "Ahmedabad, Gujarat",
        students: "1800+ students",
        established: "Established 1946",
        rating: 4.2,
        reviews: "2.7k reviews",
        programs: ["MBBS", "MD", "MS", "PG"],
        imageUrl: "/placeholder.svg",
        overview: "BJMC is a prestigious government medical college in Gujarat.",
        website: "https://www.bjmc.gujarat.gov.in",
        founded: "1946",
        affiliations: ["MCI Approved", "Gujarat University"]
      },
      {
        name: "Grant Medical College",
        shortName: "GMC Mumbai",
        location: "Mumbai, Maharashtra",
        students: "2400+ students",
        established: "Established 1845",
        rating: 4.3,
        reviews: "3.8k reviews",
        programs: ["MBBS", "MD", "MS", "Research"],
        imageUrl: "/placeholder.svg",
        overview: "One of India's oldest medical colleges with a rich heritage in medical education.",
        website: "https://www.gmc.gov.in",
        founded: "1845",
        affiliations: ["MCI Approved", "University of Mumbai"]
      },
      {
        name: "Bangalore Medical College and Research Institute",
        shortName: "BMCRI",
        location: "Bangalore, Karnataka",
        students: "2100+ students",
        established: "Established 1955",
        rating: 4.1,
        reviews: "2.4k reviews",
        programs: ["MBBS", "MD", "MS", "Super Specialty"],
        imageUrl: "/placeholder.svg",
        overview: "BMCRI is a premier medical institution in South India known for clinical excellence.",
        website: "https://www.bmcri.edu.in",
        founded: "1955",
        affiliations: ["MCI Approved", "Rajiv Gandhi University"]
      }
    ];

    await CollegeModel.insertMany(sampleColleges);
    console.log('Sample colleges seeded successfully!');

  } catch (error) {
    console.error('Error seeding colleges:', error);
  }
};
