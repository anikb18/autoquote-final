import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from "./ui/chart";
import { DealershipComparison } from "./dashboard/DealershipComparison";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");

  const { data: blogPosts } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: subscribers } = useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: salesData } = useQuery({
    queryKey: ['sales-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales_transactions')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: dealerStats } = useQuery({
    queryKey: ['dealer-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dealer_profiles')
        .select('*')
        .eq('active', true);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: userStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, count')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const handleCreateBlogPost = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('blog_posts')
      .insert([
        {
          title: newBlogTitle,
          content: newBlogContent,
          author_id: user.id,
          status: 'draft'
        }
      ]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create blog post. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Blog post created successfully!",
      });
      setNewBlogTitle("");
      setNewBlogContent("");
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
        Admin Dashboard
      </h1>
      
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="blog">Blog Management</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle>Total Sales</CardTitle>
                <CardDescription>Monthly overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${salesData?.reduce((acc, curr) => acc + (curr.selling_price || 0), 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle>Active Dealers</CardTitle>
                <CardDescription>Currently registered</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dealerStats?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
                <CardDescription>All registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userStats?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>Quotes to Sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {salesData && salesData.length > 0
                    ? `${((salesData.length / (blogPosts?.length || 1)) * 100).toFixed(1)}%`
                    : '0%'}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
              <CardDescription>Monthly revenue overview</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px]" config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="created_at" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="selling_price" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <DealershipComparison />
        </TabsContent>

        <TabsContent value="blog" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Blog Posts</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                  Create New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/80 backdrop-blur-lg">
                <DialogHeader>
                  <DialogTitle>Create New Blog Post</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Post Title"
                    value={newBlogTitle}
                    onChange={(e) => setNewBlogTitle(e.target.value)}
                    className="bg-white/50"
                  />
                  <Textarea
                    placeholder="Post Content"
                    value={newBlogContent}
                    onChange={(e) => setNewBlogContent(e.target.value)}
                    className="min-h-[200px] bg-white/50"
                  />
                  <Button onClick={handleCreateBlogPost}>Create Post</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid gap-4">
            {blogPosts?.map((post) => (
              <Card key={post.id} className="bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    Status: {post.status} | Created: {new Date(post.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2">{post.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="newsletter">
          <Card className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle>Newsletter Subscribers</CardTitle>
              <CardDescription>
                Total Subscribers: {subscribers?.length || 0}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {subscribers?.map((subscriber) => (
                  <div 
                    key={subscriber.id} 
                    className="flex justify-between items-center p-4 bg-white/30 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span>{subscriber.email}</span>
                    <span className="text-sm text-gray-500">
                      Subscribed: {new Date(subscriber.subscribed_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
