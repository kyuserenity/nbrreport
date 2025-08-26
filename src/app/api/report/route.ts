import { NextRequest, NextResponse } from "next/server";

const LINE_CHANNEL_ID = process.env.LINE_CHANNEL_ID!;
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET!;
const LINE_GROUP_ID = process.env.LINE_GROUP_ID!;

// ฟังก์ชันขอ access token แบบ short-lived
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
  const isUrgent = formData.get("urgent") === "on";
  const file = formData.get("f") as File | null;

  const now = new Date();
  const thDate = now.toLocaleString("th-TH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  let message = `🕒 ส่งเมื่อ : ${thDate}\nข้อความ : ${content}`;
  if (isUrgent) {
    message = `${message}\n@everyone`;
  }

  try {
    const accessToken = await getLineAccessToken();

    // ส่งข้อความ
    const messages: LineTextMessage[] = [
      {
        type: "text",
        text: message,
      },
    ];

    // ถ้ามีไฟล์แนบและเป็นรูปภาพ ให้ส่งเป็น image message
    if (file && file.size > 0 && file.type.startsWith("image/")) {
      // อัปโหลดไฟล์ไปยัง image hosting (LINE ไม่รองรับการอัปโหลดไฟล์โดยตรงผ่าน Messaging API)
      // ที่นี่จะข้ามการอัปโหลดและแนบเฉพาะชื่อไฟล์ไว้ในข้อความ
      messages.push({
        type: "text",
        text: `แนบไฟล์: ${file.name}`,
      });
    }

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
