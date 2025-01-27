"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import backgroundImage from "/src/images/background-call-to-action.jpg";
import { Link } from "react-router-dom";

export function CallToAction() {
  const { t } = useTranslation("common");

  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-blue-600 py-32"
    >
      <img
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
      />
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            {t("callToAction.title")}
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            {t("callToAction.description")}
          </p>
          <Button
            asChild
            className="mt-10 bg-white text-blue-600 hover:bg-gray-50"
          >
            <Link to="/register">{t("callToAction.button")}</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
