'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { mockUser } from './mock-data';

const AuthContext = createContext({
  user: null,
  firebaseUser: null,
  loading: false,
  hasRole: () => false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(mockUser);
  const [firebaseUser, setFirebaseUser] = useState({ uid: mockUser.uid });
  const [loading, setLoading] = useState(false);

  const hasRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}