import React from 'react';
import PasswordPrompt from './PasswordPrompt';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  onPasswordSuccess: () => void;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  isAuthenticated, 
  onPasswordSuccess, 
  children 
}) => {
  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <PasswordPrompt onSuccess={onPasswordSuccess} />;
};

export default ProtectedRoute;