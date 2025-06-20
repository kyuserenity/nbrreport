import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_NORMAL =
  "https://discord.com/api/webhooks/1385623151412514936/4TQVuaA1oFe60gJPMvPbt1KyS1RvHkKVdMHcYo07zUlf4zanMpvjDRCVhnB2yNfN9GyA";
const WEBHOOK_URGENT =
  "https://discord.com/api/webhooks/1385623235747385395/wim5vhRIT4_Naomgg76ASX_YI8IjLybQfnt641sWO6t0gizP1EqNETK-lXm4CTP7ubdc";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const content = formData.get("d") as string;
  const isUrgent = formData.get("urgent") === "on";
  const file = formData.get("f") as File | null;

  const webhookUrl = isUrgent ? WEBHOOK_URGENT : WEBHOOK_NORMAL;

  const now = new Date();
  const thDate = now.toLocaleString("th-TH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  let message = `🕒 ส่งเมื่อ : ${thDate}\n✉️ ข้อความ : ${content}`;
  if (isUrgent) {
    message = `${message}\n@everyone`;
  }

  const payload = new FormData();
  payload.append("content", message);

  if (file && file.size > 0) {
    payload.append("file", file, file.name);
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      body: payload,
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "ส่งไป Discord ไม่สำเร็จ" },
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
