import { NextResponse } from "next/server";

import getData from "@/app/utils/getData";
import createBase from "@/app/utils/createBase";
import createDisplay from "@/app/utils/createDisplay";
export async function POST(request: Request) {

  const body = await request.json();
  const uid = body.uid

  const rawData = getData(uid);

  const baseResult = createBase({data: rawData.awards, count: rawData.count});

  const displayResult = createDisplay(rawData.count);

  const hasItemNameMode  = rawData.awards[0]?.item ? true : false;

  return NextResponse.json({baseResult, displayResult, hasItemNameMode});
}
