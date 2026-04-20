import AgentRegisterVendorsClient from "./RegisterClient";
import Seo from "../../../components/seo/Seo";

export default function RegisterVendorsPage() {
  return (
    <>

      {/* Works in App Router, truly inside <head> */}
      <Seo slug="/agents/register-vendors/" />
      <AgentRegisterVendorsClient />
      
    </>
  );
}