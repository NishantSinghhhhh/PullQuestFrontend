import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoutes";
import Website from "./pages/Website";
import SignUp from "./auth/SignUp";
import { Toaster } from "./components/ui/sonner";
import OpenIssuePage from "./components/OpenIssuePage";
import MaintainerDashboard from "./pages/MaintainerDashboard";
import CompanyDashboard from "./pages/CompanyDashborad";
import ReviewPrStep from "./Flows/RepoIssuesStep";
import NewIssueForm from "./Flows/NewIssueForm";
import RepoPrs from "./Flows/RepoPrs";
import ContributorDashboard from "./pages/ContributorDashboard";
import ContributorProfile from "./components/contributor/ContributorProfile";
import IssueDetailsPage from "./components/IssueDetailsPage";
import ContributorSettings from "./components/ContributorSettings";
import { UserProvider } from "./context/UserProvider";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Website />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signUp" element={<SignUp />} />
            
            {/* contributor routes */}
            <Route
              path="/contributor/dashboard"
              element={
                <PrivateRoute allowedRoles={["contributor"]}>
                  <ContributorDashboard />
                </PrivateRoute>
              }
            />

            <Route 
              path="/contributor/profile" 
              element={
                <PrivateRoute allowedRoles={["contributor"]}>
                  <ContributorProfile />
                </PrivateRoute>
              }
            />

            <Route 
              path="/contributor/issue/:issueId" 
              element={
                <PrivateRoute allowedRoles={["contributor"]}>
                  <IssueDetailsPage />
                </PrivateRoute>
              }
            />

            <Route 
              path="/contributor/settings" 
              element={
                <PrivateRoute allowedRoles={["contributor"]}>
                  <ContributorSettings />
                </PrivateRoute>
              }
            />

            {/* maintainer routes */}
            <Route
              path="/maintainer/dashboard"
              element={
                <PrivateRoute allowedRoles={["maintainer"]}>
                  <MaintainerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/maintainer/open-issue/:number"
              element={<OpenIssuePage />}
            />
            <Route
              path="/maintainer/repo/:owner/:repo/issues/new"
              element={<NewIssueForm />}
            />
            <Route
              path="/maintainer/repo/:owner/:repo/issues"
              element={<RepoPrs />}
            />
            <Route
              path="/maintainer/repo/:owner/:repo/prs"
              element={<ReviewPrStep />}
            />
            
            {/* company routes */}
            <Route
              path="/company/dashboard"
              element={
                <PrivateRoute allowedRoles={["company"]}>
                  <CompanyDashboard />
                </PrivateRoute>
              }
            />
          </Routes>

          {/* ✅ Mount Toaster ONCE here */}
          <Toaster />
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;