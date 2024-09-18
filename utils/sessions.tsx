"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

// Créer le JWT
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Date.now() + 60 * 1000) // Expiration du JWT (1 minute)
    .sign(key);
}

// Lire le JWT
export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

// Créer le cookie
export async function createCookie(sessionData: object) {
  const encryptedSessionData = await encrypt(sessionData);

  cookies().set("session", encryptedSessionData, {
    httpOnly: true,
    secure: false,
    path: "/",
  });
}

// Détruire le cookie
export async function logout() {
  cookies().set("session", "", { expires: new Date(0) });
}

// Lire le cookie
export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function checkAuth() {
  const session = await getSession();

  if (!session) { // Si aucune session n'est définie
    return NextResponse.json(
      { message: "User is not authenticated" },
      { status: 403 }
    );
  }

  if (session.exp < Date.now()) { // Si le JWT a expiré
    return NextResponse.json({ message: "Session expired" }, { status: 403 });
  }

  return NextResponse.json({ message: "Logged" }, { status: 200 });
}
