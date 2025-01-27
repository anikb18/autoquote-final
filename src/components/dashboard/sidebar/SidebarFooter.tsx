import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Moon, Sun, Globe } from "lucide-react";

interface SidebarFooterProps {
  viewMode: "admin" | "dealer" | "user";
  role: string;
  onViewModeChange: (value: "admin" | "dealer" | "user") => void;
}

export function SidebarFooter({
  viewMode,
  role,
  onViewModeChange,
}: SidebarFooterProps) {
  const { theme, setTheme } = useTheme();
  const { i18n } = useTranslation();

  return (
    <div className="flex flex-col gap-y-2 px-6 pb-4 border-t pt-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="w-full justify-start gap-x-3 rounded-md p-2"
      >
        {theme === "light" ? (
          <Moon className="h-6 w-6 shrink-0" />
        ) : (
          <Sun className="h-6 w-6 shrink-0" />
        )}
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </Button>

      <Select
        value={i18n.language}
        onValueChange={(value) => i18n.changeLanguage(value)}
      >
        <SelectTrigger className="w-full">
          <Globe className="h-5 w-5 mr-2" />
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en-US">English</SelectItem>
          <SelectItem value="fr-CA">Français</SelectItem>
        </SelectContent>
      </Select>

      {(role === "admin" || role === "super_admin") && (
        <Select
          value={viewMode}
          onValueChange={(value: "admin" | "dealer" | "user") =>
            onViewModeChange(value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select view mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin View</SelectItem>
            <SelectItem value="dealer">Dealer View</SelectItem>
            <SelectItem value="user">User View</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
