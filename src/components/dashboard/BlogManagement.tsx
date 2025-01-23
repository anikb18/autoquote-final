import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, SortAsc, SortDesc } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BlogList } from "@/components/BlogList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Card } from "@/components/ui/card";

type BlogStatus = 'draft' | 'published' | 'archived' | 'scheduled';

interface BlogMetrics {
  total: number;
  published: number;
  draft: number;
  scheduled: number;
}

export const BlogManagement = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BlogStatus | 'all'>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: metrics } = useQuery({
    queryKey: ['blog-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('status')
        .throwOnError();

      if (error) throw error;

      const stats: BlogMetrics = {
        total: data.length,
        published: data.filter(post => post.status === 'published').length,
        draft: data.filter(post => post.status === 'draft').length,
        scheduled: data.filter(post => post.status === 'scheduled').length
      };

      return stats;
    }
  });

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold">
          {t('blog.title')}
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          {t('blog.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold">Total Posts</h3>
          <p className="text-2xl">{metrics?.total || 0}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Published</h3>
          <p className="text-2xl text-green-600">{metrics?.published || 0}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Drafts</h3>
          <p className="text-2xl text-yellow-600">{metrics?.draft || 0}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Scheduled</h3>
          <p className="text-2xl text-blue-600">{metrics?.scheduled || 0}</p>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as BlogStatus | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? <SortAsc className="mr-2" /> : <SortDesc className="mr-2" />}
            Sort by Date
          </Button>
        </div>
        <Button 
          onClick={() => navigate("/dashboard/blog/new")}
          className="bg-primary hover:bg-primary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Post
        </Button>
      </div>

      <div className="bg-background/60 backdrop-blur-sm rounded-lg border">
        <BlogList />
      </div>
    </div>
  );
};