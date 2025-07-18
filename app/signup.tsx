import { router, } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signin } from '../features/session/session.slice';
import { addUser } from '../features/users/users.slice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { showAlert } from '../utils/alertHelper';

export default function SignupScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useAppDispatch();
    const users = useAppSelector(state => state.users);

    const handleSignup = async () => {
        if (!name || !email || !password) {
            showAlert({ title: 'Error', message: 'Please fill all fields' });
            return;
        }
        try {
            if (users.some((u: any) => u.email === email)) {
                showAlert({ title: 'Error', message: 'Email already exists. Please use a different email.' });
                return;
            }
            const user = { name, email, password };
            dispatch(addUser(user));
            dispatch(signin(user));
            showAlert({ title: 'Success', message: 'Signup successful!' });
            router.replace('/login');
        } catch (e) {
            showAlert({ title: 'Error', message: 'Could not sign up. Please try again.' });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <Text style={styles.linkText} onPress={() => router.replace('/login')}>Already have an account? Login</Text>
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