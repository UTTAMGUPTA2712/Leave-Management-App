// app/_layout.tsx
import { Link, Redirect, Stack, useRouter, useSegments } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import CustomAlert from '../components/CustomAlert';
import UserMenu from '../components/UserMenu';
import { signout } from '../features/session/session.slice';
import { useAppDispatch, useCurrentUser, useIsAuthenticated, useSessionState } from '../store/hooks';
import { StoreProvider } from '../store/store-provider';
import { setCustomAlertStateSetter } from '../utils/alertHelper';

function AppContent() {
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

  const sessionState = useSessionState();
  const isAuthenticated = useIsAuthenticated();
  const currentUser = useCurrentUser();
  const dispatch = useAppDispatch();

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

  const allowedAuthRoutes = useMemo(() => ['dashboard', 'profile'], []);
  const allowedUnauthRoutes = useMemo(() => ['login', 'signup'], []);
  const currentPath = useMemo(() => segments[segments.length - 1] || '', [segments]);

  const handleLogout = useCallback(async () => {
    dispatch(signout());
    router.replace('/login');
  }, [dispatch, router]);

  const handleProfile = useCallback(() => {
    router.push('/profile');
  }, [router]);

  const headerTitle = useCallback(() => (
    <Link href="/dashboard" style={{ fontSize: 20, fontWeight: 'bold' }}>Leave Management</Link>
  ), []);

  const headerRight = useCallback(() => (
    <UserMenu
      userName={currentUser!.name!}
      userAvatar={currentUser!.avatar}
      onProfile={handleProfile}
      onLogout={handleLogout}
    />
  ), [currentUser, handleProfile, handleLogout]);

  if (sessionState === undefined) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={{ marginTop: 10 }}>Loading...</Text>
    </View>
  );

  if (!isAuthenticated) {
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
          headerTitle,
          headerRight,
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

export default function RootLayout() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}