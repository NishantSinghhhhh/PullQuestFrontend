
import { useUser } from "../context/UserProvider"
import MaintainerFlow from "@/Flows/MaintainerFlow";

export default function MaintainerDashboard() {
  const { user } = useUser()
 
  return (
    <div>
      <MaintainerFlow />
    </div>
  )
}