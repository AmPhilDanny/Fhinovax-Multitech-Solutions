import { getSiteSettings } from "@/app/actions";
import DiagnosisClient from "./DiagnosisClient";

export default async function Page() {
  const settings = await getSiteSettings();
  
  return (
    <DiagnosisClient 
      welcomeMessage={settings.labWelcomeMessage} 
      systemName={settings.aiName || "Phinovax Agent"}
      pageTitle={settings.diagnosisPageTitle || "Intelligent Online Fault Diagnosis"}
      pageSubtitle={settings.diagnosisPageSubtitle || "Interact with our specialized AI system to profer immediate solutions to your technical issues."}
    />
  );
}
