import { NextRequest } from "next/server";

export function isAdmin(request: NextRequest): boolean {
  const cookie = request.cookies.get("admin_session");
  return cookie?.value === "true";
}
