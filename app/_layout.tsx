// app/_layout.tsx
import { Link, Redirect, Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import CustomAlert from '../components/CustomAlert';
import UserMenu from '../components/UserMenu';
import { setCustomAlertStateSetter } from '../utils/alertHelper';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { useAsyncStorage } from '../utils/useAsyncStorage';

// Define a type for the user
interface SessionUser {
  name?: string;
  [key: string]: any;
}

export default function RootLayout() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertState, setAlertState] = useState({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => { },
    onCancel: undefined as (() => void) | undefined,
    showCancel: false,
  });
  const segments = useSegments();
  const router = useRouter();

  const sessionStorage = useAsyncStorage<any>(STORAGE_KEYS.SESSION);

  useEffect(() => {
    setCustomAlertStateSetter(
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

  const allowedAuthRoutes = ['dashboard', 'profile'];
  const allowedUnauthRoutes = ['login', 'signup'];
  const currentPath = segments[segments.length - 1] || '';

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={{ marginTop: 10 }}>Loading...</Text>
    </View>
  );

  if (!user) {
    if (allowedUnauthRoutes.includes(currentPath)) {
      return (
        <>
          <Stack screenOptions={{ headerShown: false }} />
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
    return <Redirect href="/login" />;
  } else {
    if (!allowedAuthRoutes.includes(currentPath)) {
      return <Redirect href="/dashboard" />;
    }
    return (
      <PaperProvider>
        <Stack screenOptions={{
          headerTitle: () => <Link href="/dashboard" style={{ fontSize: 20, fontWeight: 'bold' }}>Leave Management</Link>,
          headerRight: () => (
            <UserMenu
              userName={user.name!}
              userAvatar={user.avatar}
              onProfile={() => router.push('/profile')}
              onLogout={async () => {
                await sessionStorage.deleteData();
                setUser(null);
                router.replace('/login');
              }}
            />
          ),
        }} />
        <CustomAlert
          visible={alertState.visible}
          title={alertState.title}
          message={alertState.message}
          onConfirm={alertState.onConfirm}
          onCancel={alertState.onCancel}
          showCancel={alertState.showCancel}
        />
      </PaperProvider>
    );
  }
}