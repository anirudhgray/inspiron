import { Navigate, useLocation } from 'react-router-dom';

const Guarded404 = (props) => {
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
      to="/not-found"
      state={{ from: `${location.pathname}${location.search}` }}
    />
  );
};

export default Guarded404;
