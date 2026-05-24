import ServicePageTemplate from "@/components/ServicePageTemplate";
import { servicesData } from "@/data/servicesData";

const EmergencyDentalServicesPage = () => {
  const service = servicesData.find(s => s.slug === "emergency-dental-services")!;
  const relatedServices = servicesData
    .filter(s => ["oral-surgery", "restorative-dentistry", "sedation-dentistry"].includes(s.slug))
    .map(s => ({ title: s.title, slug: s.slug, icon: s.icon }));

  return <ServicePageTemplate service={service} relatedServices={relatedServices} />;
};

export default EmergencyDentalServicesPage;
