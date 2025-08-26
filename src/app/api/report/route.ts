import { NextRequest, NextResponse } from "next/server";

const LINE_CHANNEL_ID = process.env.LINE_CHANNEL_ID!;
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET!;
const LINE_GROUP_ID = process.env.LINE_GROUP_ID!;

async function getLineAccessToken() {
  const res = await fetch("https://api.line.me/v2/oauth/accessToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: LINE_CHANNEL_ID,
      client_secret: LINE_CHANNEL_SECRET,
    }),
  });
  if (!res.ok) throw new Error("LINE token error");
  const data = await res.json();
  return data.access_token as string;
}

type LineTextMessage = {
  type: "text";
  text: string;
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const content = formData.get("d") as string;

  const now = new Date();
  const thDate = now.toLocaleString("th-TH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const message = `🕒 ส่งเมื่อ : ${thDate}\n✉️ ข้อความ : ${content}`;

  try {
    const accessToken = await getLineAccessToken();

    const messages: LineTextMessage[] = [
      {
        type: "text",
        text: message,
      },
    ];

    const res = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        to: LINE_GROUP_ID,
        messages,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "ส่งไป LINE OA ไม่สำเร็จ" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการส่ง" },
      { status: 500 },
    );
  }
}
