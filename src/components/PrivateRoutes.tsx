import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role?: string;
  exp?: number;
}

interface PrivateRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const PrivateRoute = ({ allowedRoles, children }: PrivateRouteProps) => {
  const token = localStorage.getItem("token");
  const redirectTo = "/";

  if (!token) return <Navigate to={redirectTo} />;

  try {
    const decodedToken = jwtDecode<JwtPayload>(token);

    if (decodedToken?.role && allowedRoles.includes(decodedToken.role)) {
      return <>{children}</>;
    }

    return <Navigate to={redirectTo} />;
  } catch (error) {
    console.error("Token decoding failed:", error);
    return <Navigate to={redirectTo} />;
  }
};

export default PrivateRoute;
