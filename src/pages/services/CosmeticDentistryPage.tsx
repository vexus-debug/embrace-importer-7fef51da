import ServicePageTemplate from "@/components/ServicePageTemplate";
import { servicesData } from "@/data/servicesData";

const CosmeticDentistryPage = () => {
  const service = servicesData.find(s => s.slug === "cosmetic-dentistry")!;
  const relatedServices = servicesData
    .filter(s => ["restorative-dentistry", "orthodontics", "prosthodontics"].includes(s.slug))
    .map(s => ({ title: s.title, slug: s.slug, icon: s.icon }));

  return <ServicePageTemplate service={service} relatedServices={relatedServices} />;
};

export default CosmeticDentistryPage;
