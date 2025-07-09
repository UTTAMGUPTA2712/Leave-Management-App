// app/_layout.tsx
import { Redirect, Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import CustomAlert from '../components/CustomAlert';
import { setCustomAlertStateSetter } from '../utils/alertHelper';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { useAsyncStorage } from '../utils/useAsyncStorage';

export default function RootLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertState, setAlertState] = useState({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => { },
    onCancel: undefined as (() => void) | undefined,
    showCancel: false,
  });
  const segments = typeof window !== 'undefined' ? window.location.pathname.split('/') : [];
  const router = useRouter();

  const sessionStorage = useAsyncStorage<any>(STORAGE_KEYS.SESSION);

  useEffect(() => {
    return setCustomAlertStateSetter(
      setAlertState as React.Dispatch<
        React.SetStateAction<{
          visible: boolean;
          title: string;
          message: string;
          onConfirm: () => void;
          onCancel?: (() => void) | undefined;
          showCancel: boolean;
        }>
      >
    );
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const sessionData = await sessionStorage.getData();
        if (sessionData) {
          setUser(sessionData);
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const currentPath = segments[segments.length - 1] || ''; // '' for root

  if (loading) return null;

  if (!user) {
    // Allow unauthenticated access only to login and signup
    if (currentPath === 'login' || currentPath === 'signup') {
      return (
        <>
          <Stack />
          <CustomAlert
            visible={alertState.visible}
            title={alertState.title}
            message={alertState.message}
            onConfirm={alertState.onConfirm}
            onCancel={alertState.onCancel}
            showCancel={alertState.showCancel}
          />
        </>
      );
    }
    // Redirect root and all other routes to login
    return <Redirect href="/login" />;
  } else {
    // If logged in, prevent access to login, signup, and root
    if (currentPath === 'login' || currentPath === 'signup' || currentPath === '') {
      return <Redirect href="/dashboard" />;
    }
    // LOGOUT BUTTON for logged-in users
    return (
      <>
        <button
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1000,
            padding: '8px 16px',
            background: '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
          onClick={async () => {
            await sessionStorage.deleteData();
            setUser(null);
            router.replace('/login');
          }}
        >
          Logout
        </button>
        <Stack />
        <CustomAlert
          visible={alertState.visible}
          title={alertState.title}
          message={alertState.message}
          onConfirm={alertState.onConfirm}
          onCancel={alertState.onCancel}
          showCancel={alertState.showCancel}
        />
      </>
    );
  }
}