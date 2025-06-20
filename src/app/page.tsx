"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertSuccess, setAlertSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function doSubmit() {
    setLoading(true);
    const form = formRef.current!;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setAlertMsg("ส่งปัญหาเรียบร้อยแล้ว ✅");
        setAlertSuccess(true);
        form.reset();
      } else {
        setAlertMsg("ส่งไม่สำเร็จ ❌");
        setAlertSuccess(false);
      }
    } catch (_err) {
      setAlertMsg("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      setAlertSuccess(false);
    } finally {
      setLoading(false);
      setDialogOpen(false);
      setAlertOpen(true);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDialogOpen(true);
  }

  return (
    <div className="flex h-[90vh] items-center justify-center">
      <div className="w-full max-w-md rounded-md p-6">
        {/* Dialog ยืนยันการส่ง */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ยืนยันการส่งปัญหา</DialogTitle>
              <DialogDescription>
                คุณต้องการส่งปัญหานี้ใช่หรือไม่? กรุณาตรวจสอบข้อมูลก่อนส่ง
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button onClick={doSubmit} disabled={loading}>
                {loading ? "กำลังส่ง..." : "ยืนยันส่ง"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Alert Dialog แสดงผลหลังส่ง */}
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {alertSuccess ? "สำเร็จ" : "เกิดข้อผิดพลาด"}
              </AlertDialogTitle>
              <AlertDialogDescription>{alertMsg}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setAlertOpen(false)}>
                ปิด
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* ฟอร์ม */}
        <form className="space-y-6" onSubmit={handleSubmit} ref={formRef}>
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold">แจ้งปัญหา</h1>
            <p>ส่งปัญหาให้กับคุณครูเพื่อให้รับการแก้ไขได้เลยทันที</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="d">ปัญหาที่คุณเจอ</Label>
              <Textarea
                name="d"
                placeholder="ระบุปัญหาที่คุณต้องการจะแจ้ง"
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="f">แนบไฟล์</Label>
              <Input name="f" type="file" />
            </div>
            <Separator />
            <Label className="bg-accent has-[[aria-checked=true]]:text-background has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary flex cursor-pointer items-center gap-3 rounded-lg border p-3 opacity-50 shadow-xs transition-all has-[[aria-checked=true]]:opacity-100">
              <Checkbox name="urgent" />
              <div className="space-y-2">
                <p className="text-2xl font-semibold">เรื่องเร่งด่วน</p>
                <div className="text-sm">
                  <p className="opacity-75">
                    ถ้าคุณเลือกที่เรื่องเร่งด่วน
                    ปัญหาจะถูกส่งไปหาครูได้เร็วที่สุด
                  </p>
                  <p className="text-destructive">*ใช้ในกรณีจำเป็นเท่านั้น</p>
                </div>
              </div>
            </Label>
          </div>
          <div>
            <Button
              className="w-full"
              size="lg"
              type="submit"
              disabled={loading}
            >
              {loading ? "กำลังส่ง..." : "ส่งปัญหา"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
