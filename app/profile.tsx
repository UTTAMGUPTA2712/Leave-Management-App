import { MaterialIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Webcam from 'react-webcam';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { useAsyncStorage } from '../utils/useAsyncStorage';

const defaultProfile = {
    name: '',
    email: '',
    avatar: null as string | null,
    phone: '',
    address: '',
};

const Profile = () => {
    const sessionStorage = useAsyncStorage(STORAGE_KEYS.SESSION);
    const usersStorage = useAsyncStorage(STORAGE_KEYS.USERS);
    const [profile, setProfile] = useState<typeof defaultProfile>(defaultProfile);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [imagePickerVisible, setImagePickerVisible] = useState(false);
    const [webcamVisible, setWebcamVisible] = useState(false);
    const webcamRef = useRef<any>(null);

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
        await sessionStorage.setData(profile);
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
        router.replace('/login');
    };

    const pickFromCamera = async () => {
        if (Platform.OS === 'web') {
            setWebcamVisible(true);
            return;
        }
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Camera permission is required!');
            return;
        }
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
            base64: true,
        });
        if (!result.canceled && result.assets && result.assets[0].base64) {
            setProfile((prev) => ({
                ...prev,
                avatar: `data:image/jpeg;base64,${result.assets[0].base64}`,
            }));
        }
    };

    const pickFromGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
            base64: true,
        });
        if (!result.canceled && result.assets && result.assets[0].base64) {
            setProfile((prev) => ({
                ...prev,
                avatar: `data:image/jpeg;base64,${result.assets[0].base64}`,
            }));
        }
    };

    const handleWebcamCapture = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setProfile((prev) => ({ ...prev, avatar: imageSrc }));
            }
            setWebcamVisible(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}><ActivityIndicator size="large" /></View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={editing ? () => setImagePickerVisible(true) : undefined}>
                <Image
                    source={profile.avatar ? { uri: profile.avatar } : require('../assets/images/icon.png')}
                    style={styles.avatar}
                />
                {editing && <Text style={styles.editAvatarText}>Edit Photo</Text>}
            </TouchableOpacity>
            <Modal
                visible={imagePickerVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setImagePickerVisible(false)}
            >
                <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={() => setImagePickerVisible(false)}>
                    <View style={{ position: 'absolute', top: '40%', left: '10%', right: '10%', backgroundColor: '#fff', borderRadius: 10, padding: 24, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Change Profile Photo</Text>
                        <View style={styles.photoButtonRow}>
                            <TouchableOpacity style={styles.photoButton} onPress={() => { setImagePickerVisible(false); pickFromCamera(); }}>
                                <MaterialIcons name="photo-camera" size={36} color="#fff" />
                                <Text style={styles.photoButtonText}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.photoButton} onPress={() => { setImagePickerVisible(false); pickFromGallery(); }}>
                                <MaterialIcons name="photo-library" size={36} color="#fff" />
                                <Text style={styles.photoButtonText}>Gallery</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => setImagePickerVisible(false)} style={{ marginTop: 12 }}>
                            <Text style={{ fontSize: 16, color: '#e74c3c' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
            {Platform.OS === 'web' && (
                <Modal
                    visible={webcamVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setWebcamVisible(false)}
                >
                    <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={() => setWebcamVisible(false)}>
                        <View style={{ position: 'absolute', top: '30%', left: '10%', right: '10%', backgroundColor: '#fff', borderRadius: 10, padding: 24, alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Webcam Capture</Text>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width={240}
                                height={180}
                                style={{ borderRadius: 8, marginBottom: 16 }}
                            />
                            <TouchableOpacity style={{ marginBottom: 8 }} onPress={handleWebcamCapture}>
                                <Text style={{ fontSize: 16, color: '#1565c0' }}>Capture</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setWebcamVisible(false)}>
                                <Text style={{ fontSize: 16, color: '#e74c3c' }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Modal>
            )}
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
                    <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
                        <Text style={styles.editText}>Edit Profile</Text>
                    </TouchableOpacity>
                </>
            )}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
            {Platform.OS === 'web' && (
                <input
                    id="webcamInput"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                        const file = e.target?.files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setProfile((prev) => ({
                                    ...prev,
                                    avatar: reader.result as string,
                                }));
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                />
            )}
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
    photoButtonRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16, gap: 16 },
    photoButton: { alignItems: 'center', backgroundColor: '#1565c0', borderRadius: 12, padding: 16, marginHorizontal: 8, flex: 1 },
    photoButtonText: { color: '#fff', fontWeight: 'bold', marginTop: 8, fontSize: 16 },
});

export default Profile;
