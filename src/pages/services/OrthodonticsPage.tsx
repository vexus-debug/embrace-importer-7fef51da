import ServicePageTemplate from "@/components/ServicePageTemplate";
import { servicesData } from "@/data/servicesData";

const OrthodonticsPage = () => {
  const service = servicesData.find(s => s.slug === "orthodontics")!;
  const relatedServices = servicesData
    .filter(s => ["cosmetic-dentistry", "pediatric-dentistry", "preventive-dentistry"].includes(s.slug))
    .map(s => ({ title: s.title, slug: s.slug, icon: s.icon }));

  return <ServicePageTemplate service={service} relatedServices={relatedServices} />;
};

export default OrthodonticsPage;
