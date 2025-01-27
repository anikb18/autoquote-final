import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, SortAsc, SortDesc } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BlogList from "@/components/BlogList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BlogStatus = "draft" | "published" | "archived";

export function BlogManagement() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<BlogStatus>("draft");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  return (
    <div className="space-y-4 p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {t("blog.management.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <Select
                value={status}
                onValueChange={(value: BlogStatus) => setStatus(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="h-4 w-4 mr-2" />
                ) : (
                  <SortDesc className="h-4 w-4 mr-2" />
                )}
                Sort
              </Button>
            </div>
          </div>
          <BlogList />
        </CardContent>
      </Card>
    </div>
  );
}
