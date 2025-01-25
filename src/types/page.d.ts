interface Page {
  id: string;
  title: string;
  description: string;
}

interface SeoSettings {
  page_identifier: string;
  title: string;
  meta_description: string;
  meta_keywords: string[];
  og_title: string;
  og_description: string;
  og_image: string;
}

interface PageWithSeo extends Page {
  seo: SeoSettings;
}