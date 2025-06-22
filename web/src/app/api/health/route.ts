import { NextResponse } from "next/server";

export const GET = async function () {
  return NextResponse.json({
    status: "ok",
    message: "App Router is working",
    timestamp: new Date().toISOString(),
  });
};
