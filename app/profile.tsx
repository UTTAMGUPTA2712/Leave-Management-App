import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { useAsyncStorage } from '../utils/useAsyncStorage';

const defaultProfile = {
    name: '',
    email: '',
    avatar: null as string | null, // uri string or null
    phone: '',
    address: '',
    // Add more fields as needed
};

const Profile = () => {
    const sessionStorage = useAsyncStorage(STORAGE_KEYS.SESSION);
    const usersStorage = useAsyncStorage(STORAGE_KEYS.USERS);
    const [profile, setProfile] = useState<typeof defaultProfile>(defaultProfile);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cameraPermission, setCameraPermission] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const session = await sessionStorage.getData();
            if (session) {
                setProfile({
                    ...defaultProfile,
                    ...session,
                });
            }
            setLoading(false);
        })();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        setEditing(false);
        setProfile((prev) => ({ ...prev }));
        // Update session
        await sessionStorage.setData(profile);
        // Update user in users list
        const users = (await usersStorage.getData()) || [];
        const idx = users.findIndex((u: { email: string }) => u.email === profile.email);
        if (idx !== -1) {
            users[idx] = { ...users[idx], ...profile };
            await usersStorage.setData(users);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await sessionStorage.deleteData();
        // Add navigation to login if needed
        alert('Logged out!');
    };

    const handlePickImage = async () => {
        // Ask for camera permission
        const { status } = await Camera.requestCameraPermissionsAsync();
        setCameraPermission(status === 'granted' ? true : false);
        if (status !== 'granted') {
            alert('Camera permission is required!');
            return;
        }
        // Launch camera
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled && result.assets && result.assets[0].uri) {
            setProfile((prev) => ({ ...prev, avatar: result.assets[0].uri as string }));
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}><ActivityIndicator size="large" /></View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={editing ? handlePickImage : undefined}>
                <Image
                    source={profile.avatar ? { uri: profile.avatar } : require('../assets/images/icon.png')}
                    style={styles.avatar}
                />
                {editing && <Text style={styles.editAvatarText}>Edit Photo</Text>}
            </TouchableOpacity>
            {editing ? (
                <>
                    <TextInput
                        style={styles.input}
                        value={profile.name}
                        placeholder="Name"
                        onChangeText={(text) => setProfile((prev) => ({ ...prev, name: text }))}
                    />
                    <TextInput
                        style={styles.input}
                        value={profile.email}
                        placeholder="Email"
                        editable={false}
                    />
                    <TextInput
                        style={styles.input}
                        value={profile.phone}
                        placeholder="Phone"
                        onChangeText={(text) => setProfile((prev) => ({ ...prev, phone: text }))}
                    />
                    <TextInput
                        style={styles.input}
                        value={profile.address}
                        placeholder="Address"
                        onChangeText={(text) => setProfile((prev) => ({ ...prev, address: text }))}
                    />
                    {/* Add more editable fields here */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={styles.name}>{profile.name}</Text>
                    <Text style={styles.email}>{profile.email}</Text>
                    {profile.phone ? <Text style={styles.detail}>Phone: {profile.phone}</Text> : null}
                    {profile.address ? <Text style={styles.detail}>Address: {profile.address}</Text> : null}
                    {/* Show more fields here */}
                    <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
                        <Text style={styles.editText}>Edit Profile</Text>
                    </TouchableOpacity>
                </>
            )}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
        backgroundColor: '#eee',
    },
    editAvatarText: {
        textAlign: 'center',
        color: '#007AFF',
        marginBottom: 12,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    email: {
        fontSize: 16,
        color: '#888',
        marginBottom: 8,
    },
    detail: {
        fontSize: 16,
        color: '#444',
        marginBottom: 8,
    },
    input: {
        width: 250,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#c9ada7',
        borderRadius: 10,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    editButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 32,
        borderRadius: 25,
        marginTop: 12,
        marginBottom: 12,
    },
    editText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#27ae60',
        paddingVertical: 10,
        paddingHorizontal: 32,
        borderRadius: 25,
        marginTop: 12,
        marginBottom: 12,
    },
    saveText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 25,
        marginTop: 24,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Profile;
