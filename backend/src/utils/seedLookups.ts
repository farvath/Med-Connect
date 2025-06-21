import mongoose from 'mongoose';
import Institution from '../models/Institution';
import Speciality from '../models/Speciality';
import City from '../models/City';

const institutions = [
  { name: 'AIIMS Delhi' },
  { name: 'CMC Vellore' },
  { name: 'KEM Mumbai' },
];

const specialities = [
  { name: 'Cardiology' },
  { name: 'Neurology' },
  { name: 'Orthopedics' },
];

const cities = [
  { name: 'Delhi' },
  { name: 'Mumbai' },
  { name: 'Chennai' },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || '', {});
  await Institution.deleteMany({});
  await Speciality.deleteMany({});
  await City.deleteMany({});
  await Institution.insertMany(institutions);
  await Speciality.insertMany(specialities);
  await City.insertMany(cities);
  console.log('Seeded lookup data');
  await mongoose.disconnect();
}

seed();
