import ServicePageTemplate from "@/components/ServicePageTemplate";
import { servicesData } from "@/data/servicesData";

const PreventiveDentistryPage = () => {
  const service = servicesData.find(s => s.slug === "preventive-dentistry")!;
  const relatedServices = servicesData
    .filter(s => ["restorative-dentistry", "pediatric-dentistry", "periodontics"].includes(s.slug))
    .map(s => ({ title: s.title, slug: s.slug, icon: s.icon }));

  return <ServicePageTemplate service={service} relatedServices={relatedServices} />;
};

export default PreventiveDentistryPage;
