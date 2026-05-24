import ServicePageTemplate from "@/components/ServicePageTemplate";
import { servicesData } from "@/data/servicesData";

const ProsthodonticsPage = () => {
  const service = servicesData.find(s => s.slug === "prosthodontics")!;
  const relatedServices = servicesData
    .filter(s => ["restorative-dentistry", "cosmetic-dentistry", "oral-surgery"].includes(s.slug))
    .map(s => ({ title: s.title, slug: s.slug, icon: s.icon }));

  return <ServicePageTemplate service={service} relatedServices={relatedServices} />;
};

export default ProsthodonticsPage;
