import localStorageConfig from 'Config/localStorage';
import ISignInDTO from 'DTOs/ISignInDTO';
import IUser from 'Entities/IUser';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import api from 'Services/api';

interface IAuthContextData {
  user: IUser | null;
  signIn: (data: ISignInDTO) => Promise<void>;
  signOut: () => Promise<void>;
  handleSetUser: (data: IUser) => void;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const history = useHistory();

  const [user, setUser] = useState<IUser | null>(null);

  const signIn = useCallback(async ({ email, password }: ISignInDTO) => {
    const response = await api.post('/users/sessions', {
      email,
      password,
    });
    localStorage.setItem(
      localStorageConfig.user_identifier,
      JSON.stringify(response.data),
    );
    setUser(response.data);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await api.delete('/users/signout');
    } catch {}
    localStorage.removeItem(localStorageConfig.user_identifier);
    setUser(null);
    history.replace('/');
  }, [history]);

  const handleSetUser = useCallback(
    (data: IUser) => {
      setUser(data);
      localStorage.setItem(
        localStorageConfig.user_identifier,
        JSON.stringify(user),
      );
    },
    [user],
  );

  useEffect(() => {
    const savedUser = localStorage.getItem(localStorageConfig.user_identifier);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    api.get('/users/sessions').catch(() => {
      signOut();
    });
  }, [signOut]);

  const context = useMemo(
    () => ({ user, signIn, signOut, handleSetUser }),
    [handleSetUser, signIn, signOut, user],
  );

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthProvider;
