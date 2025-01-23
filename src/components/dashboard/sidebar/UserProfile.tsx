import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfileProps {
  user: {
    email?: string;
    user_metadata?: {
      avatar_url?: string;
    };
  } | null;
}

export function UserProfile({ user }: UserProfileProps) {
  if (!user) return null;

  return (
    <div className="flex items-center gap-x-3 py-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.user_metadata?.avatar_url} />
        <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold text-gray-900 truncate">
          {user.email?.split('@')[0]}
        </span>
        <span className="text-xs text-gray-500 truncate">
          {user.email}
        </span>
      </div>
    </div>
  );
}