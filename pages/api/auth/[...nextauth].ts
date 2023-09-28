import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_FRONT_ID || "",
      clientSecret: process.env.GOOGLE_FRONT_SECRET || "",
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXT_PUBLIC_SECRET,
};

export default NextAuth(authOptions);
