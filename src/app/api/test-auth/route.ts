import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const session = await auth()
    return NextResponse.json({ success: true, session })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message, stack: e.stack, name: e.name })
  }
}
