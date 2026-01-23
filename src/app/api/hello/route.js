import { NextResponse } from "next/server";
export async function GET() {
const message = {
message: "hello world"
};
return NextResponse.json(message);
}