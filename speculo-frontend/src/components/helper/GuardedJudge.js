import { Navigate, useLocation } from 'react-router-dom';

const GuardedRoute = (props) => {
  const { children } = props;

  const isAuthenticated =
    localStorage.getItem('token') !== null &&
    localStorage.getItem('token') !== 'undefined';
  const isJudge = localStorage.getItem('userType') === 'Judge';
  const location = useLocation();

  return isAuthenticated && isJudge ? (
    <>{children}</>
  ) : (
    <Navigate
      replace={true}
      to="/profile"
      state={{ from: `${location.pathname}${location.search}` }}
    />
  );
};

export default GuardedRoute;
