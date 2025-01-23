import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Shield, Bell } from "lucide-react";

const AdminSettings = () => {
  const navigate = useNavigate();

  const settingsSections = [
    {
      title: "General Settings",
      description: "Configure basic site settings and preferences",
      icon: Settings,
      path: "/dashboard/settings/general"
    },
    {
      title: "Security",
      description: "Manage security and authentication settings",
      icon: Shield,
      path: "/dashboard/settings/security"
    },
    {
      title: "Notifications",
      description: "Configure notification preferences",
      icon: Bell,
      path: "/dashboard/settings/notifications"
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {settingsSections.map((section) => (
          <Card
            key={section.path}
            className="cursor/50 transition-colors"
            onClick={() => navigate(section.path)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <section.icon className="h-5 w-5" />
                {section.title}
              </CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminSettings;