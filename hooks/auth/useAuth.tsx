"use client"; // Pastikan ini ada di baris pertama

import { useState, useEffect } from 'react';

const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hanya berjalan di browser
    const tokenFromStorage = localStorage.getItem('token');
    const userIdFromStorage = localStorage.getItem('userId');
    
    setToken(tokenFromStorage);
    setUserId(userIdFromStorage);
    setIsLoading(false);
  }, []);

  return { token, userId, isLoading };
};

export default useAuth;