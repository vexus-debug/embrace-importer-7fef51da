export type ConsentSection = {
  heading: string;
  body?: string;
  bullets?: string[];
  requireAgree?: boolean;
};

export type ConsentTemplate = {
  id: string;
  category: string;
  title: string;
  intro?: string;
  sections: ConsentSection[];
  closing?: string;
};

export const CONSENT_TEMPLATES: ConsentTemplate[] = [
  {
    id: "teeth_whitening",
    category: "Cosmetic",
    title: "Consent Form for Teeth Whitening",
    sections: [
      {
        heading: "Consent for Treatment",
        body:
          "I consent to the teeth whitening procedure as explained to me by my dentist. I understand that teeth whitening involves the use of bleaching agents to lighten the color of my teeth. I acknowledge that I have been informed about the nature of the procedure, the potential benefits, and the possible risks and side effects.",
        requireAgree: true,
      },
      {
        heading: "Potential Risks and Side Effects",
        body:
          "I understand that the following potential risks and side effects may occur as a result of the teeth whitening procedure:",
        bullets: [
          "Tooth sensitivity",
          "Gum irritation",
          "Temporary discomfort",
          "Uneven whitening",
          "Potential damage to dental restorations (crowns, veneers, etc.)",
        ],
        requireAgree: true,
      },
      {
        heading: "Pre-Treatment Information",
        body:
          "I have informed my dentist/provider of any known allergies or medical conditions that may affect my treatment. I have provided a complete medical history, including any medications or supplements I am currently taking.",
        requireAgree: true,
      },
      {
        heading: "Post-Treatment Care",
        body:
          "I understand that following post-treatment instructions is crucial for achieving the best results and minimizing any potential side effects. I agree to follow the post-treatment care guidelines provided by my dentist.",
        requireAgree: true,
      },
      {
        heading: "Acknowledgement of No Guarantees",
        body:
          "I acknowledge that while teeth whitening can significantly improve the appearance of my teeth, the results are not guaranteed. Individual results may vary based on the condition of my teeth and adherence to post-treatment care.",
        requireAgree: true,
      },
      {
        heading: "Alternatives to Teeth Whitening",
        body: "I have been informed about alternative treatments to teeth whitening, including:",
        bullets: ["Professional cleaning", "Veneers", "Crowns", "Orthodontic treatment"],
      },
      {
        heading: "Consent and Release",
        body:
          "I hereby release the dentist and their staff from any liability associated with the teeth whitening procedure. I understand that I have the right to ask questions and have them answered to my satisfaction prior to the procedure.",
        requireAgree: true,
      },
    ],
    closing:
      "I have read and understood the information provided in this consent form. By signing below, I consent to the teeth whitening procedure and agree to the terms outlined above.",
  },
  {
    id: "extraction",
    category: "Oral Surgery",
    title: "Extraction Consent Form",
    sections: [
      {
        heading: "Description of Procedure",
        body:
          "The dental extraction procedure involves the removal of one or more teeth. Anesthesia will be administered to numb the area, ensuring minimal discomfort during the procedure. The tooth will be carefully loosened and removed. In some cases, a small incision in the gum or bone may be necessary. Stitches may be used to close the extraction site if needed.",
      },
      {
        heading: "Purpose of Procedure",
        body: "The purpose of this procedure is to remove one or more teeth due to:",
        bullets: ["Severe decay", "Gum disease", "Infection", "Orthodontic reasons", "Impacted teeth", "Other"],
      },
      {
        heading: "Risks and Complications",
        body: "Potential risks and complications associated with this procedure include, but are not limited to:",
        bullets: [
          "Pain",
          "Swelling",
          "Bleeding",
          "Infection",
          "Dry socket",
          "Damage to adjacent teeth",
          "Numbness or tingling in the lips, tongue, or chin",
          "Sinus exposure or infection (for upper teeth)",
          "Jaw fracture (in rare cases)",
        ],
        requireAgree: true,
      },
      {
        heading: "Anesthesia",
        body:
          "Anesthesia will be administered to minimize discomfort. Possible side effects of anesthesia include allergic reactions, nerve injury, and temporary numbness.",
        requireAgree: true,
      },
      {
        heading: "Post-Procedure Care",
        body:
          "I understand that following the post-procedure care instructions provided by my healthcare provider is crucial for healing and preventing complications. These instructions may include:",
        bullets: [
          "Avoiding certain foods and beverages",
          "Using prescribed medications as directed",
          "Keeping the extraction site clean",
          "Avoiding strenuous activities",
        ],
        requireAgree: true,
      },
      {
        heading: "Alternatives to Extraction",
        body: "I have been informed of alternatives to tooth extraction, which may include:",
        bullets: [
          "Root canal treatment",
          "Periodontal therapy",
          "Restorative options (e.g., crowns, fillings)",
          "No treatment (understanding the risks)",
        ],
      },
      {
        heading: "Patient Consent",
        body:
          "I acknowledge that I have received sufficient information regarding the extraction procedure, its risks, benefits, and alternatives. I have had the opportunity to ask questions and have had those questions answered to my satisfaction. I voluntarily consent to the dental extraction procedure as described.",
        requireAgree: true,
      },
    ],
  },
  {
    id: "root_canal",
    category: "Endodontics",
    title: "Root Canal Treatment Consent Form",
    sections: [
      {
        heading: "Procedure",
        body: "I consent to the root canal treatment on the indicated tooth/teeth.",
        requireAgree: true,
      },
      {
        heading: "Description of the Procedure",
        body:
          "Root canal treatment involves the removal of infected or damaged pulp from inside the tooth, cleaning, shaping, and filling the root canals, and sealing the tooth to prevent further infection. The procedure may require multiple visits.",
      },
      {
        heading: "Potential Risks and Complications",
        body:
          "I understand that there are potential risks and complications associated with root canal treatment, which include but are not limited to:",
        bullets: [
          "Pain or discomfort during and after the procedure",
          "Swelling and/or infection",
          "Fracture or breakage of the tooth",
          "Need for additional procedures, such as retreatment or extraction",
          "Temporary or permanent numbness in the treated area",
          "An allergic reaction to medications or anesthetics",
        ],
        requireAgree: true,
      },
      {
        heading: "Alternative Treatment Options",
        body: "I have been informed about alternative treatment options, including:",
        bullets: [
          "Extraction of the affected tooth",
          "No treatment, with the understanding that the condition may worsen, leading to pain, infection, or tooth loss",
        ],
      },
      {
        heading: "Benefits of Root Canal Treatment",
        body: "I understand that the potential benefits of root canal treatment include:",
        bullets: [
          "Relief from pain and infection",
          "Preservation of the natural tooth",
          "Restoration of normal chewing and biting function",
        ],
      },
      {
        heading: "Consent",
        body:
          "I have had the opportunity to discuss the procedure, risks, benefits, and alternative treatment options with my Dentist. I have had the opportunity to ask questions and have received satisfactory answers. I acknowledge that no guarantee or assurance has been made regarding the outcome of the procedure. I consent to the administration of local anesthesia and any necessary medications. I agree to follow the post-treatment care instructions provided by the dental provider and to attend all scheduled follow-up appointments.",
        requireAgree: true,
      },
    ],
  },
  {
    id: "orthodontics",
    category: "Orthodontics",
    title: "Orthodontics / Braces Consent Form",
    sections: [
      {
        heading: "Explanation of Procedure",
        body:
          "I consent to the orthodontic procedure specified above, to be performed by the clinic. I understand that this procedure is intended to correct dental alignment issues and improve the function and appearance of my teeth and jaw.",
        requireAgree: true,
      },
      {
        heading: "Possible Risks and Complications",
        body:
          "I have been informed of the potential risks and complications associated with orthodontic treatment, which may include but are not limited to:",
        bullets: [
          "Discomfort or pain during and after adjustments",
          "Tooth decay or gum disease if proper oral hygiene is not maintained",
          "Root resorption (shortening of the tooth roots)",
          "Temporomandibular joint (TMJ) discomfort or dysfunction",
          "Relapse of tooth alignment after treatment if retainers are not worn as prescribed",
          "Allergic reactions to materials used in the treatment",
          "Prolonged treatment time due to lack of cooperation, growth changes, or unforeseen complications",
        ],
        requireAgree: true,
      },
      {
        heading: "Alternative Treatments",
        body: "I have been informed of alternative treatment options, which may include:",
        bullets: [
          "No treatment, with the understanding of potential consequences",
          "Other dental treatments or appliances",
          "Aligners",
        ],
      },
      {
        heading: "Anesthesia and Pain Management",
        body:
          "I understand that local anesthesia or sedation may be used during certain procedures, and I have been informed of the associated risks.",
        requireAgree: true,
      },
      {
        heading: "Post-Treatment Care",
        body:
          "I have received and understood the post-treatment care instructions that must be followed to ensure the success of the orthodontic treatment.",
        requireAgree: true,
      },
      {
        heading: "Duration and Compliance",
        body:
          "I understand that the duration of orthodontic treatment can vary and is dependent on multiple factors including my cooperation in attending appointments and following instructions. I also understand that the success of the treatment largely depends on my adherence to the orthodontist's recommendations, including wearing prescribed appliances or retainers.",
        requireAgree: true,
      },
      {
        heading: "Payment and Refund Policy",
        body: "Please note the following regarding payments:",
        bullets: [
          "Payments made toward orthodontic treatment cover the planning, diagnostics, materials, and clinical time involved in your care.",
          "As treatment begins immediately after these preparations, payments are non-refundable.",
          "Should you choose to discontinue treatment, fees already paid will be applied toward services rendered up to that point.",
          "After the first two broken brackets, any additional broken brackets will be replaced at a cost of ₦20,000 each for stainless steel brackets and ₦40,000 for ceramic brackets.",
        ],
        requireAgree: true,
      },
      {
        heading: "Media Consent",
        body:
          "With your consent, we may occasionally capture moments at our clinic during treatment to highlight patient care and our services. These images may be shared on our social media or website to promote our services, with full respect for your privacy. Agree below if you consent to media use; otherwise leave unchecked.",
      },
      {
        heading: "Patient Acknowledgment",
        body:
          "I acknowledge that I have been given the opportunity to ask questions regarding the procedure, risks, benefits, and alternatives, and that all my questions have been answered to my satisfaction.",
        requireAgree: true,
      },
    ],
  },
];

export const CONSENT_CATEGORIES = Array.from(new Set(CONSENT_TEMPLATES.map(t => t.category)));
