import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, X } from "lucide-react";
import { Toast } from "@/components/ui/toast";

interface CustomToastProps {
  title: string;
  description: string;
  imageUrl?: string;
  timestamp?: string;
  onClose?: () => void;
}

export const CustomToast = ({
  title,
  description,
  imageUrl,
  timestamp = "a few seconds ago",
  onClose,
}: CustomToastProps) => {
  return (
    <Toast className="w-full max-w-xs bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex items-center mb-3">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          New notification
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="ms-auto -mx-1.5 -my-1.5 bg-white dark:bg-gray-800 flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <span className="sr-only">Close</span>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      <div className="flex items-center">
        <div className="relative inline-block shrink-0">
          <Avatar className="h-12 w-12">
            <AvatarImage src={imageUrl} alt={title} />
            <AvatarFallback>{title[0]}</AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 inline-flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full">
            <MessageSquare className="w-3 h-3 text-white" />
            <span className="sr-only">Message icon</span>
          </span>
        </div>
        <div className="ms-3 text-sm font-normal">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {title}
          </div>
          <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
            {description}
          </div>
          <span className="text-xs font-medium text-blue-600 dark:text-blue-500">
            {timestamp}
          </span>
        </div>
      </div>
    </Toast>
  );
};
