import { MaterialIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Webcam from 'react-webcam';
import { signin, signout } from '../features/session/session.slice';
import { updateUser } from '../features/users/users.slice';
import { useAppDispatch, useCurrentUser, useUsersList } from '../store/hooks';

const Profile = React.memo(() => {
    const dispatch = useAppDispatch();
    const currentUser = useCurrentUser();
    const users = useUsersList();
    const [editing, setEditing] = useState(false);
    const [imagePickerVisible, setImagePickerVisible] = useState(false);
    const [webcamVisible, setWebcamVisible] = useState(false);
    const webcamRef = useRef<any>(null);
    const [loading, setLoading] = useState(false);

    if (!currentUser) {
        return (
            <View style={styles.centered}><ActivityIndicator size="large" /></View>
        );
    }

    const [profile, setProfile] = useState(currentUser);

    // Keep local profile state in sync with Redux user when editing starts
    React.useEffect(() => {
        if (editing) setProfile(currentUser!);
    }, [editing, currentUser]);

    const handleSave = useCallback(() => {
        setLoading(true);
        setEditing(false);
        dispatch(signin(profile));
        // Update user in users list
        const idx = users.findIndex((u: { email: string }) => u.email === profile.email);
        if (idx !== -1) {
            dispatch(updateUser(profile));
        }
        setLoading(false);
    }, [dispatch, profile, users]);

    const handleLogout = useCallback(() => {
        dispatch(signout());
        router.replace('/login');
    }, [dispatch]);

    const pickFromCamera = useCallback(async () => {
        if (Platform.OS === 'web') {
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
            quality: 0.5, // Reduced quality for better performance
            base64: true,
        });
        if (!result.canceled && result.assets && result.assets[0].base64) {
            setProfile((prev) => ({
                ...prev,
                avatar: `data:image/jpeg;base64,${result.assets[0].base64}`,
            }));
        }
    }, []);

    const pickFromGallery = useCallback(async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5, // Reduced quality for better performance
            base64: true,
        });
        if (!result.canceled && result.assets && result.assets[0].base64) {
            setProfile((prev) => ({
                ...prev,
                avatar: `data:image/jpeg;base64,${result.assets[0].base64}`,
            }));
        }
    }, []);

    const handleWebcamCapture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setProfile((prev) => ({ ...prev, avatar: imageSrc }));
                setWebcamVisible(false);
            }
        }
    }, []);

    const handleNameChange = useCallback((text: string) => {
        setProfile((prev) => ({ ...prev, name: text }));
    }, []);

    const handlePhoneChange = useCallback((text: string) => {
        setProfile((prev) => ({ ...prev, phone: text }));
    }, []);

    const handleAddressChange = useCallback((text: string) => {
        setProfile((prev) => ({ ...prev, address: text }));
    }, []);

    const handleEditPress = useCallback(() => {
        setEditing(true);
    }, []);

    const handleImagePickerPress = useCallback(() => {
        if (editing) setImagePickerVisible(true);
    }, [editing]);

    const handleImagePickerClose = useCallback(() => {
        setImagePickerVisible(false);
    }, []);

    const handleWebcamClose = useCallback(() => {
        setWebcamVisible(false);
    }, []);

    const handleCameraPress = useCallback(() => {
        setImagePickerVisible(false);
        pickFromCamera();
    }, [pickFromCamera]);

    const handleGalleryPress = useCallback(() => {
        setImagePickerVisible(false);
        pickFromGallery();
    }, [pickFromGallery]);

    const handleCancelPress = useCallback(() => {
        setImagePickerVisible(false);
    }, []);

    const handleWebcamCancelPress = useCallback(() => {
        setWebcamVisible(false);
    }, []);

    const handleCapturePress = useCallback(() => {
        handleWebcamCapture();
    }, [handleWebcamCapture]);

    // Memoize the avatar source to prevent unnecessary re-renders
    const avatarSource = useMemo(() => {
        return profile.avatar ? { uri: profile.avatar } : require('../assets/images/icon.png');
    }, [profile.avatar]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={handleImagePickerPress}>
                <Image
                    source={avatarSource}
                    style={styles.avatar}
                />
                {editing && <Text style={styles.editAvatarText}>Edit Photo</Text>}
            </TouchableOpacity>
            <Modal
                visible={imagePickerVisible}
                transparent
                animationType="fade"
                onRequestClose={handleImagePickerClose}
            >
                <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={handleImagePickerClose}>
                    <View style={{ position: 'absolute', top: '40%', left: '10%', right: '10%', backgroundColor: '#fff', borderRadius: 10, padding: 24, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Change Profile Photo</Text>
                        <View style={styles.photoButtonRow}>
                            <TouchableOpacity style={styles.photoButton} onPress={handleCameraPress}>
                                <MaterialIcons name="photo-camera" size={36} color="#fff" />
                                <Text style={styles.photoButtonText}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.photoButton} onPress={handleGalleryPress}>
                                <MaterialIcons name="photo-library" size={36} color="#fff" />
                                <Text style={styles.photoButtonText}>Gallery</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={handleCancelPress} style={{ marginTop: 12 }}>
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
                    onRequestClose={handleWebcamClose}
                >
                    <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={handleWebcamClose}>
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
                            <TouchableOpacity style={{ marginBottom: 8 }} onPress={handleCapturePress}>
                                <Text style={{ fontSize: 16, color: '#1565c0' }}>Capture</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleWebcamCancelPress}>
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
                        onChangeText={handleNameChange}
                    />
                    <TextInput
                        style={styles.input}
                        value={profile.email}
                        placeholder="Email"
                        editable={false}
                    />
                    <TextInput
                        style={styles.input}
                        value={profile.phone || ''}
                        placeholder="Phone"
                        onChangeText={handlePhoneChange}
                    />
                    <TextInput
                        style={styles.input}
                        value={profile.address || ''}
                        placeholder="Address"
                        onChangeText={handleAddressChange}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                        <Text style={styles.saveText}>{loading ? 'Saving...' : 'Save'}</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={styles.name}>{currentUser.name}</Text>
                    <Text style={styles.email}>{currentUser.email}</Text>
                    {currentUser.phone ? <Text style={styles.detail}>Phone: {currentUser.phone}</Text> : null}
                    {currentUser.address ? <Text style={styles.detail}>Address: {currentUser.address}</Text> : null}
                    <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
                        <Text style={styles.editText}>Edit Profile</Text>
                    </TouchableOpacity>
                </>
            )}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
});

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
