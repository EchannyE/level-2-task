import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  const name = process.env.ADMIN_NAME || "Admin User";
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error("ADMIN_PASSWORD is required to seed an admin user");
    process.exit(1);
  }

  await connectDB();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    existingUser.name = name;
    existingUser.role = "admin";

    if (password) {
      existingUser.password = password;
    }

    await existingUser.save();

    console.log(`Updated admin user: ${email}`);
    process.exit(0);
  }

  await User.create({
    name,
    email,
    password,
    role: "admin"
  });

  console.log(`Created admin user: ${email}`);
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error("Failed to seed admin user:", error.message);
  process.exit(1);
});