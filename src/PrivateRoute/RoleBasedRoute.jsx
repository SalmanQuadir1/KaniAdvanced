import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ children, allowedRoles }) => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { user } = currentUser;
    
    const role = user?.authorities[0].authority
    
    console.log(role,"rolllleeeeeeeee");

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RoleBasedRoute;
