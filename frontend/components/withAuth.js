// withAuth.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/utils/api';
import { LoadingIndicator } from './LoadingIndicator';

const checkAuthAndRole = async () => {
  try {
    const response = await api.get('/auth/check-session');
    return {
      isAuthenticated: response.data.loggedIn,
      role: response.data.user ? response.data.user.rol : null,
    };
  } catch (error) {
    console.error('Error checking session:', error);
    return { isAuthenticated: false, role: null };
  }
};

export function withAuth(WrappedComponent, allowedRoles) {
  return (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const verifyAuth = async () => {
        const { isAuthenticated, role } = await checkAuthAndRole();

        if (!isAuthenticated || !allowedRoles.includes(role)) {
          router.push('/');
        } else {
          setLoading(false);
        }
      };

      verifyAuth();
    }, [router, allowedRoles]);

    if (loading) {
      return <LoadingIndicator />;
    }

    return <WrappedComponent {...props} />;
  };
}
