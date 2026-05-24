import ServicePageTemplate from "@/components/ServicePageTemplate";
import { servicesData } from "@/data/servicesData";

const PeriodonticsPage = () => {
  const service = servicesData.find(s => s.slug === "periodontics")!;
  const relatedServices = servicesData
    .filter(s => ["preventive-dentistry", "restorative-dentistry", "oral-surgery"].includes(s.slug))
    .map(s => ({ title: s.title, slug: s.slug, icon: s.icon }));

  return <ServicePageTemplate service={service} relatedServices={relatedServices} />;
};

export default PeriodonticsPage;
