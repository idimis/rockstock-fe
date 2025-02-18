import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db/pool";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const client = await pool.connect();
    await client.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );
    client.release();
    return NextResponse.json({ message: "User registered" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}
