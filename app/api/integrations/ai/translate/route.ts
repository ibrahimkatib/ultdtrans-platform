import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { runAiWebhook } from "@/lib/n8n";
export async function POST(request:Request){await requireUser();const b=await request.json().catch(()=>({}));try{const result=await runAiWebhook({text:String(b.text||""),sourceLanguage:String(b.sourceLanguage||""),targetLanguage:String(b.targetLanguage||"")});return NextResponse.json(result);}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"AI workflow is not configured"},{status:501});}}
