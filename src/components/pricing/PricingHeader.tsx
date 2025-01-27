import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/container";
import { CountdownTimer } from "../CountdownTimer";
import { ProgressBar } from "../ProgressBar";

const TOTAL_SPOTS = 500;
const REMAINING_SPOTS = 127;

export const PricingHeader = () => {
  const { t } = useTranslation("pricing");
  const endTime = new Date();
  endTime.setDate(endTime.getDate() + 7);

  return (
    <div className="md:text-center max-w-2xl mx-auto">
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-white">
        {t("header.title")}
      </h2>
      <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-400 leading-relaxed">
        {t("header.subtitle")}
      </p>
      <div className="mt-6 sm:mt-8">
        <CountdownTimer endTime={endTime} />
      </div>
      <div className="mt-6 sm:mt-8 max-w-md mx-auto">
        <ProgressBar
          total={TOTAL_SPOTS}
          remaining={REMAINING_SPOTS}
          className="max-w-md mx-auto"
        />
      </div>
    </div>
  );
};
