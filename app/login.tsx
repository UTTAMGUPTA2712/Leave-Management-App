import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signin } from '../features/session/session.slice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { showAlert } from '../utils/alertHelper';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useAppDispatch();
    const users = useAppSelector(state => state.users);

    // Optionally, load users from a static source if not present
    // useEffect(() => { if (!users.length) dispatch(setUsers(defaultUsers)); }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            showAlert({ title: 'Error', message: 'Please fill in all fields' });
            return;
        }
        try {
            const user = users.find((u: any) => u.email === email && u.password === password);
            if (user) {
                dispatch(signin(user));
                router.replace('/dashboard');
            } else {
                showAlert({ title: 'Error', message: 'Invalid credentials' });
            }
        } catch (e) {
            showAlert({ title: 'Error', message: 'Login failed. Please try again.' });
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/react-logo.png')} style={styles.logo} />
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Login to your account</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#aaa"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor="#aaa"
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace('/signup')}>
                <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkHighlight}>Sign up</Text></Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#f0f4f8',
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#22223b',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#4a4e69',
        marginBottom: 32,
    },
    input: {
        width: '100%',
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#c9ada7',
        borderRadius: 10,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    button: {
        width: '100%',
        backgroundColor: '#22223b',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#22223b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkText: {
        color: '#4a4e69',
        fontSize: 16,
        marginTop: 8,
    },
    linkHighlight: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
});

