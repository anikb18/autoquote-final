import React, { useState } from "react";
import { Card } from "./ui/card";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Overview: React.FC = () => {
  const [emailContent, setEmailContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSendEmail = async () => {
    try {
      const emailData = {
        to: ["recipient@example.com"], // Replace with actual recipient
        subject: emailSubject,
        html: emailContent,
        scheduledFor: scheduledDate || undefined,
      };

      const { data, error } = await supabase.functions.invoke("send-email", {
        body: emailData,
      });

      if (error) throw error;

      toast({
        title: scheduledDate ? "Email Scheduled" : "Email Sent",
        description: scheduledDate
          ? `Email will be sent on ${new Date(scheduledDate).toLocaleString()}`
          : "Email has been sent successfully",
      });

      setIsEmailDialogOpen(false);
      setEmailContent("");
      setEmailSubject("");
      setScheduledDate("");
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-md border-gray-200/50 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Dashboard Overview
      </h2>
      <p className="text-gray-600 mb-4">
        This is the overview section of the dashboard. Here you can find key
        metrics and insights.
      </p>

      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Send Email</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Compose Email</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter email subject"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="schedule" className="text-sm font-medium">
                Schedule Send (Optional)
              </label>
              <Input
                id="schedule"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Content</label>
              <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                init={{
                  height: 350,
                  menubar: false,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                }}
                value={emailContent}
                onEditorChange={(content) => setEmailContent(content)}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setIsEmailDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendEmail}
                disabled={!emailSubject.trim() || !emailContent.trim()}
              >
                {scheduledDate ? "Schedule Email" : "Send Now"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Overview;
