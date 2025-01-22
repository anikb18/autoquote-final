import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { QuoteIcon } from "./QuoteIcon";
import { useTranslation } from "react-i18next";

interface TestimonialCardProps {
  testimonialKey: string;
  image: string;
}

export const TestimonialCard = ({ testimonialKey, image }: TestimonialCardProps) => {
  const { t } = useTranslation('testimonials');

  return (
    <Card className="relative h-full rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10 transition-transform hover:-translate-y-1">
      <QuoteIcon className="absolute left-6 top-6 fill-slate-100" />
      <CardContent className="relative">
        <blockquote className="text-lg tracking-tight text-slate-900">
          {t(`${testimonialKey}.content`)}
        </blockquote>
      </CardContent>
      <CardHeader className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
        <div>
          <div className="font-display text-base text-slate-900">
            {t(`${testimonialKey}.author.name`)}
          </div>
          <div className="mt-1 text-sm text-slate-500">
            {t(`${testimonialKey}.author.role`)}
          </div>
        </div>
        <Avatar className="h-14 w-14">
          <AvatarImage src={image} alt={t(`${testimonialKey}.author.name`)} />
          <AvatarFallback>{t(`${testimonialKey}.author.initials`)}</AvatarFallback>
        </Avatar>
      </CardHeader>
    </Card>
  );
};