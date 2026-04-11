import { getSiteSettings } from "@/app/actions";
import DiagnosisClient from "./DiagnosisClient";

export default async function Page() {
  const settings = await getSiteSettings();
  
  return (
    <DiagnosisClient 
      welcomeMessage={settings.labWelcomeMessage} 
      systemName={settings.aiName || "Phinovax Agent"}
    />
  );
}
