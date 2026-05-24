import ServicePageTemplate from "@/components/ServicePageTemplate";
import { servicesData } from "@/data/servicesData";

const RestorativeDentistryPage = () => {
  const service = servicesData.find(s => s.slug === "restorative-dentistry")!;
  const relatedServices = servicesData
    .filter(s => ["preventive-dentistry", "prosthodontics", "cosmetic-dentistry"].includes(s.slug))
    .map(s => ({ title: s.title, slug: s.slug, icon: s.icon }));

  return <ServicePageTemplate service={service} relatedServices={relatedServices} />;
};

export default RestorativeDentistryPage;
