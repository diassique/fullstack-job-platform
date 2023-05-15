import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ role, children }) {
  const userRole = useSelector((state) => state.auth.user.role); // get the role from the auth state
  const isAuthenticated = useSelector((state) => state.auth.isLoggedIn); // get the isLoggedIn from the auth state

  if (isAuthenticated && userRole === role) {
    return children;
  } else {
    return <Navigate to="/signin" replace />;
  }
}

export default PrivateRoute;