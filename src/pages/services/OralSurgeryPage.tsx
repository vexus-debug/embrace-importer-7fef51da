import ServicePageTemplate from "@/components/ServicePageTemplate";
import { servicesData } from "@/data/servicesData";

const OralSurgeryPage = () => {
  const service = servicesData.find(s => s.slug === "oral-surgery")!;
  const relatedServices = servicesData
    .filter(s => ["restorative-dentistry", "emergency-dental-services", "sedation-dentistry"].includes(s.slug))
    .map(s => ({ title: s.title, slug: s.slug, icon: s.icon }));

  return <ServicePageTemplate service={service} relatedServices={relatedServices} />;
};

export default OralSurgeryPage;
