import { BellIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface WelcomeHeaderProps {
  unreadNotifications: number;
}

export const WelcomeHeader = ({ unreadNotifications }: WelcomeHeaderProps) => {
  const { data: profile } = useQuery({
    queryKey: ['dealer-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('dealer_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {profile?.dealer_name}</h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your dealership today
        </p>
      </div>
      <div className="relative">
        <BellIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
        {unreadNotifications > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full bg-red-500"
          >
            {unreadNotifications}
          </Badge>
        )}
      </div>
    </div>
  );
};