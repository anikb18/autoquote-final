import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DealerLead = Database['public']['Tables']['dealer_leads']['Insert'];

export const ContactForm = () => {
  const { t } = useTranslation('dealer');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    dealershipName: '',
    location: '',
    volume: '',
    brands: '',
    phone: '',
    email: '',
    preferredContact: 'phone'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dealerLead: DealerLead = {
        dealership_name: formData.dealershipName,
        location: formData.location,
        volume: formData.volume,
        brands: formData.brands,
        phone: formData.phone,
        email: formData.email,
        preferred_contact: formData.preferredContact,
        status: 'new',
        source: 'website'
      };

      const { error } = await supabase
        .from('dealer_leads')
        .insert([dealerLead]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your request has been submitted. Our team will contact you shortly.",
      });

      setFormData({
        dealershipName: '',
        location: '',
        volume: '',
        brands: '',
        phone: '',
        email: '',
        preferredContact: 'phone'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("contact.form.dealershipName")}
                  </label>
                  <input
                    type="text"
                    name="dealershipName"
                    value={formData.dealershipName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("contact.form.location")}
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("contact.form.volume")}
                </label>
                <select 
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">{t("contact.form.volumeSelect")}</option>
                  <option value="small">{t("contact.form.volumeOptions.small")}</option>
                  <option value="medium">{t("contact.form.volumeOptions.medium")}</option>
                  <option value="large">{t("contact.form.volumeOptions.large")}</option>
                  <option value="xlarge">{t("contact.form.volumeOptions.xlarge")}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("contact.form.brands")}
                </label>
                <input
                  type="text"
                  name="brands"
                  value={formData.brands}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("contact.form.phone")}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("contact.form.email")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("contact.form.preferredContact")}
                </label>
                <select
                  name="preferredContact"
                  value={formData.preferredContact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="phone">{t("contact.form.preferredOptions.phone")}</option>
                  <option value="email">{t("contact.form.preferredOptions.email")}</option>
                </select>
              </div>
              <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("contact.form.submitting") : t("contact.form.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};