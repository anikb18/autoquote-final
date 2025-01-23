import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./SettingsSidebar";
import { useTranslation } from "react-i18next";

const sidebarNavItems = [
  {
    title: "General",
    href: "#general",
  },
  {
    title: "Branding",
    href: "#branding",
  },
  {
    title: "SEO",
    href: "#seo",
  },
  {
    title: "Email",
    href: "#email",
  },
  {
    title: "Pricing",
    href: "#pricing",
  },
  {
    title: "Coupons",
    href: "#coupons",
  },
  {
    title: "Integrations",
    href: "#integrations",
  },
  {
    title: "Security",
    href: "#security",
  }
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const { t } = useTranslation();
  
  return (
    <div className="h-full w-full">
      <div className="hidden space-y-6 p-8 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{t('settings.title')}</h2>
          <p className="text-muted-foreground">
            {t('settings.description')}
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-4xl">{children}</div>
        </div>
      </div>
    </div>
  );
}