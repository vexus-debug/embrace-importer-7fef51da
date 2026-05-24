import ServicePageTemplate from "@/components/ServicePageTemplate";
import { servicesData } from "@/data/servicesData";

const PediatricDentistryPage = () => {
  const service = servicesData.find(s => s.slug === "pediatric-dentistry")!;
  const relatedServices = servicesData
    .filter(s => ["preventive-dentistry", "orthodontics", "sedation-dentistry"].includes(s.slug))
    .map(s => ({ title: s.title, slug: s.slug, icon: s.icon }));

  return <ServicePageTemplate service={service} relatedServices={relatedServices} />;
};

export default PediatricDentistryPage;
