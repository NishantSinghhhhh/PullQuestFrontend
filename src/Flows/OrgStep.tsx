// "use client";

// import { useState, useEffect } from "react";
// import { OrgCard } from "@/components/OrgCard";
// import { useUser } from "../context/UserProvider";
// import axios from "axios";

// interface Org {
//   login: string;
//   description: string | null;
//   avatar_url: string;
//   html_url: string;
// }

// interface OrgStepProps {
//   onSelect: (login: string) => void;
// }

// export default function OrgStep({ onSelect }: OrgStepProps) {
//   const { user, isLoading: userLoading } = useUser();
//   const [orgs, setOrgs] = useState<Org[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (userLoading) return;
//     if (!user || !user.profile?.username) {
//       setError("You need to log in first.");
//       return;
//     }

//     setLoading(true);

//     const githubUsername = user.profile.username;
//     const url =
//       `${import.meta.env.VITE_API_URL || "http://localhost:8012"}/api/maintainer/orgs-by-username?githubUsername=${githubUsername}`;

//     // Get token from localStorage
//     const jwtToken = localStorage.getItem("token");

//     const config = {
//       withCredentials: true,
//       headers: {
//         Authorization: jwtToken ? `Bearer ${jwtToken}` : undefined,
//       },
//     };

//     // Log for debug
//     console.log("Requesting orgs for GitHub username:", githubUsername);
//     console.log("Using JWT token:", jwtToken);

//     axios
//       .get<{ success: boolean; data: Org[] }>(url, config)
//       .then((res) => {
//         if (res.data.success) {
//           setOrgs(res.data.data);
//         } else {
//           setError("Failed to load organizations");
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching orgs:", err);
//         setError(err.message || "Unknown error");
//       })
//       .finally(() => setLoading(false));
//   }, [user, userLoading]);

//   if (userLoading || loading) {
//     return <p className="text-center text-gray-500">Loading organizations…</p>;
//   }

//   if (error) {
//     return <p className="text-center text-red-500">Error: {error}</p>;
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-4xl font-bold text-center">Select an Organization</h1>
//       <p className="text-center text-gray-600">
//         Choose from your GitHub organizations to proceed.
//       </p>

//       <div className="grid gap-4 max-w-4xl mx-auto">
//         {orgs.map((o) => (
//           <OrgCard
//             key={o.login}
//             login={o.login}
//             avatarUrl={o.avatar_url}
//             htmlUrl={o.html_url}
//             membershipText="Member"
//             repoCount={0}
//             members={0}
//             onClick={() => onSelect(o.login)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
