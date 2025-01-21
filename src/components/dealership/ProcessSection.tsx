import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ProcessSection = () => {
  const { i18n } = useTranslation();

  const { data: translations } = useQuery({
    queryKey: ['dealer_hero_translations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('category', 'translations')
        .eq('key', 'dealer_hero')
        .single();

      if (error) throw error;
      return data?.value[i18n.language];
    }
  });

  if (!translations) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Benefits Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8">{translations.benefits.title}</h2>
            <div className="space-y-6">
              {translations.benefits.items.map((benefit: string, index: number) => {
                const [title, description] = benefit.split(': ');
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-xl">{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Process Steps Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8">{translations.process.title}</h2>
            <div className="space-y-6">
              {translations.process.steps.map((step: string, index: number) => {
                const [title, description] = step.split(': ');
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-xl">
                        <span className="inline-block w-8 h-8 text-center rounded-full bg-primary text-primary-foreground mr-3">
                          {index + 1}
                        </span>
                        {title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};