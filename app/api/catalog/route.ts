import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(){const [languages,specializations]=await Promise.all([prisma.language.findMany({orderBy:{name:"asc"}}),prisma.specialization.findMany({orderBy:{name:"asc"}})]);return NextResponse.json({languages,specializations});}
