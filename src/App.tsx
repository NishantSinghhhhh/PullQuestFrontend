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
import ContributorDashboard from "./pages/ContributorDashboard";

const App = () => {
  return (
    <Router>
      <div className="App">
       <Routes>
        <Route path="/" element={<Website />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signUp" element={<SignUp />} />

          <Route
            path="/contributor/dashboard"
            element={
              <PrivateRoute allowedRoles={["contributor"]}>
                <Dashboard role="Contributor" />
                <ContributorDashboard />
              </PrivateRoute>
            }
          />

        <Route
          path="/maintainer/dashboard"
          element={
            <PrivateRoute allowedRoles={["maintainer"]}>
              <MaintainerDashboard/>
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
        path="/maintainer/repo/:owner/:repo/prs"
        element={<ReviewPrStep />}
      />
        <Route
          path="/company/dashboard"
          element={
            <PrivateRoute allowedRoles={["company"]}>
              <Dashboard role="Company" />
            </PrivateRoute>
          }
          />
        
        {/* Catch-all route should be LAST */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {/* ✅ Mount Toaster ONCE here */}
      <Toaster />
    </div>
    </Router>
  );
};

export default App;