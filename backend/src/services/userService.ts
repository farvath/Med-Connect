import User from "../models/User";

export async function getUserByEmail(email: string) {
  return User.findOne({ email });
}

export async function getUserById(id: string) {
  return User.findById(id);
}