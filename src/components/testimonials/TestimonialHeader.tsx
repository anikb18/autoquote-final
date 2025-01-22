import { useTranslation } from "react-i18next";

export const TestimonialHeader = () => {
  const { t } = useTranslation('testimonials');

  return (
    <div className="mx-auto max-w-2xl md:text-center">
      <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
        {t('title')}
      </h2>
      <p className="mt-4 text-lg tracking-tight text-slate-700">
        {t('subtitle')}
      </p>
    </div>
  );
};