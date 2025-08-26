"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
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
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
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
        setAlertMsg("ส่งปัญหาเรียบร้อยแล้ว");
        setAlertSuccess(true);
        form.reset();
      } else {
        setAlertMsg("ส่งไม่สำเร็จ");
        setAlertSuccess(false);
      }
    } catch {
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
                คุณต้องการส่งปัญหานี้ใช่หรือไม่?
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
            <div>
              <Textarea
                name="d"
                placeholder="ระบุปัญหาที่คุณต้องการจะแจ้ง"
                className="resize-none"
              />
            </div>
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
