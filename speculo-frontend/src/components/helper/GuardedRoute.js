import { Navigate, useLocation } from 'react-router-dom';

const GuardedRoute = (props) => {
  const { children } = props;

  const isAuthenticated =
    localStorage.getItem('token') !== null &&
    localStorage.getItem('token') !== 'undefined';
  const location = useLocation();

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate
      replace={true}
      to="/login"
      state={{ from: `${location.pathname}${location.search}` }}
    />
  );
};

export default GuardedRoute;
