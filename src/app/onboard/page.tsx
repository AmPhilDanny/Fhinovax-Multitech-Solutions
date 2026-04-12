import { getSiteSettings } from "@/app/actions";
import OnboardArtisanClient from "./OnboardArtisanClient";

export default async function OnboardArtisanPage() {
  const settings = await getSiteSettings();

  return (
    <OnboardArtisanClient 
      siteName={settings.siteName}
      pageTitle={settings.onboardPageTitle || "Elevate Your Engineering Career."}
      pageSubtitle={settings.onboardPageSubtitle || "Join the most advanced technical service network in Nigeria. We link top-tier mechanics and technicians with premium clients."}
      specialtiesStr={settings.onboardSpecialties || "Mechanical Engineer, Auto Electrician, Generator Specialist, HVAC Systems, Digital Diagnostics"}
      successTitle={settings.onboardSuccessTitle || "Application Received!"}
      successMessage={settings.onboardSuccessMessage || `Thank you for joining the ${settings.siteName} Network. Our technical team will review your qualifications and contact you shortly.`}
    />
  );
}
