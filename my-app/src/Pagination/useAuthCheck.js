import { useState } from 'react';

export function useAuthCheck() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const checkAuth = (callback) => {
    const userId = localStorage.getItem('userId');
    if (!userId || userId === 'guest') {
      setShowAuthModal(true);
      return false;
    }
    if (callback) callback();
    return true;
  };

  return {
    showAuthModal,
    setShowAuthModal,
    checkAuth
  };
}