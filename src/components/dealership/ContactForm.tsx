import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export const ContactForm = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {t("dealer.contact.title")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("dealer.contact.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("dealer.contact.form.dealershipName")}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder={t("dealer.contact.form.dealershipNamePlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("dealer.contact.form.location")}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder={t("dealer.contact.form.locationPlaceholder")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("dealer.contact.form.volume")}
                </label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="">{t("dealer.contact.form.volumeOptions.small")}</option>
                  <option value="">{t("dealer.contact.form.volumeOptions.medium")}</option>
                  <option value="">{t("dealer.contact.form.volumeOptions.large")}</option>
                  <option value="">{t("dealer.contact.form.volumeOptions.xlarge")}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("dealer.contact.form.brands")}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder={t("dealer.contact.form.brandsPlaceholder")}
                />
              </div>
              <Button className="w-full" size="lg">
                {t("dealer.contact.form.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};