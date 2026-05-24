import ServicePageTemplate from "@/components/ServicePageTemplate";
import { servicesData } from "@/data/servicesData";

const SedationDentistryPage = () => {
  const service = servicesData.find(s => s.slug === "sedation-dentistry")!;
  const relatedServices = servicesData
    .filter(s => ["oral-surgery", "pediatric-dentistry", "emergency-dental-services"].includes(s.slug))
    .map(s => ({ title: s.title, slug: s.slug, icon: s.icon }));

  return <ServicePageTemplate service={service} relatedServices={relatedServices} />;
};

export default SedationDentistryPage;
