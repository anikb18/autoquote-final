import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export const ContactForm = () => {
  const { t } = useTranslation('dealer');

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {t("contact.title")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("contact.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("contact.form.dealershipName")}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder={t("contact.form.dealershipNamePlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("contact.form.location")}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder={t("contact.form.locationPlaceholder")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("contact.form.volume")}
                </label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="">{t("contact.form.volumeOptions.small")}</option>
                  <option value="">{t("contact.form.volumeOptions.medium")}</option>
                  <option value="">{t("contact.form.volumeOptions.large")}</option>
                  <option value="">{t("contact.form.volumeOptions.xlarge")}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("contact.form.brands")}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder={t("contact.form.brandsPlaceholder")}
                />
              </div>
              <Button className="w-full" size="lg">
                {t("contact.form.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};