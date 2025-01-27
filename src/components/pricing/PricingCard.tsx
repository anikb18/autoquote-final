import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CheckIcon, SparklesIcon } from "lucide-react";

interface PricingCardProps {
  type: "newCar" | "tradeIn";
  isFeatured?: boolean;
}

export const PricingCard = ({ type, isFeatured = false }: PricingCardProps) => {
  const { t } = useTranslation("pricing");

  const featureCount = type === "newCar" ? 7 : 6;

  return (
    <div className="h-full">
      <div
        className={`relative flex flex-col h-full rounded-3xl p-6 ${
          isFeatured
            ? "bg-white/5 ring-2 ring-emerald-400/60 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] bg-gradient-to-b from-emerald-500/[0.075] to-transparent hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.4)]"
            : "bg-white/5"
        } ring-1 ring-inset ring-white/10 hover:ring-white/20 transition-all duration-500 sm:p-8 md:p-10`}
      >
        {isFeatured && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-4 py-1.5 text-sm font-medium text-emerald-400 ring-1 ring-inset ring-emerald-400/20">
              {t("mostPopular")}
              <SparklesIcon className="h-6 w-6 text-yellow-400 sparkle-icon animate-spin" />
            </div>
          </div>
        )}

        <h3 className="font-display text-lg text-white sm:text-xl md:text-2xl">
          {t(`${type}.title`)}
        </h3>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
          {t(`${type}.description`)}
        </p>

        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <p className="flex items-baseline flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                {t(`${type}.price`)}
              </span>
              <span className="ml-2 text-sm text-slate-400">
                {t(`${type}.prelaunchPrice`)}
              </span>
            </p>
            <p className="mt-1 sm:mt-2 text-sm text-emerald-400">
              <span className="font-bold">40% OFF</span> -{" "}
              {t(`${type}.regularPrice`)}
            </p>
          </div>
          <div className="text-left sm:text-right group mt-3 sm:mt-0">
            <div className="relative">
              <p className="text-base sm:text-lg font-bold text-emerald-400 transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-300">
                {t(`${type}.savings`)}
              </p>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {t("spotsRemaining", { count: 127 })}
            </p>
          </div>
        </div>

        <div className="my-6 sm:my-8 h-px bg-white/10" />

        <ul
          role="list"
          className="space-y-3 sm:space-y-4 text-sm sm:text-base leading-relaxed text-slate-300 flex-grow"
        >
          {Array.from({ length: featureCount }, (_, i) => (
            <li key={i} className="flex items-start gap-3 sm:gap-4 group">
              <CheckIcon className="h-5 w-5 flex-none text-emerald-400 mt-0.5 transition-all duration-300 group-hover:scale-110" />
              <span className="transition-colors duration-300 group-hover:text-emerald-400">
                {t(`${type}.items.${i}`)}
              </span>
            </li>
          ))}
        </ul>

        <Link
          to="/register"
          className={`mt-6 sm:mt-8 w-full py-2.5 sm:py-3 text-sm sm:text-base ${
            isFeatured
              ? "bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
              : "bg-emerald-500 hover:bg-emerald-400"
          } text-white rounded-lg transition-all duration-300 text-center`}
        >
          {t(`${type}.cta`)}
        </Link>
      </div>
    </div>
  );
};
