import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useRef, useState } from 'react';
import { Image, Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Webcam from 'react-webcam';

interface ProfileImagePickerProps {
    value: string | null | undefined;
    onChange: (image: string) => void;
    editing: boolean;
}

const ProfileImagePicker: React.FC<ProfileImagePickerProps> = ({ value, onChange, editing }) => {
    const [imagePickerVisible, setImagePickerVisible] = useState(false);
    const [webcamVisible, setWebcamVisible] = useState(false);
    const webcamRef = useRef<any>(null);

    // Camera for web
    const handleWebcamCapture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                onChange(imageSrc);
                setWebcamVisible(false);
            }
        }
    }, [onChange]);

    // Camera for native
    const pickFromCameraNative = useCallback(async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Camera permission is required!');
            return;
        }
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });
        if (!result.canceled && result.assets && result.assets[0].base64) {
            onChange(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    }, [onChange]);

    // Gallery for all
    const pickFromGallery = useCallback(async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });
        if (!result.canceled && result.assets && result.assets[0].base64) {
            onChange(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    }, [onChange]);

    // Handlers for modal buttons
    const handleCameraPress = useCallback(() => {
        setImagePickerVisible(false);
        if (Platform.OS === 'web') {
            setWebcamVisible(true);
        } else {
            pickFromCameraNative();
        }
    }, [pickFromCameraNative]);

    const handleGalleryPress = useCallback(() => {
        setImagePickerVisible(false);
        pickFromGallery();
    }, [pickFromGallery]);

    const avatarSource = value ? { uri: value } : require('../assets/images/icon.png');

    return (
        <>
            <TouchableOpacity onPress={editing ? () => setImagePickerVisible(true) : undefined}>
                <Image source={avatarSource} style={styles.avatar} />
                {editing && <Text style={styles.editAvatarText}>Edit Photo</Text>}
            </TouchableOpacity>
            {/* Modal for camera/gallery choice */}
            <Modal
                visible={imagePickerVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setImagePickerVisible(false)}
            >
                <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={() => setImagePickerVisible(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Change Profile Photo</Text>
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
                        <TouchableOpacity onPress={() => setImagePickerVisible(false)} style={{ marginTop: 12 }}>
                            <Text style={{ fontSize: 16, color: '#e74c3c' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
            {/* Webcam modal for web */}
            {Platform.OS === 'web' && (
                <Modal
                    visible={webcamVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setWebcamVisible(false)}
                >
                    <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={() => setWebcamVisible(false)}>
                        <View style={styles.webcamModalContent}>
                            <Text style={styles.modalTitle}>Webcam Capture</Text>
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
        </>
    );
};

const styles = StyleSheet.create({
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
    modalContent: {
        position: 'absolute',
        top: '40%',
        left: '10%',
        right: '10%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 24,
        alignItems: 'center',
    },
    webcamModalContent: {
        position: 'absolute',
        top: '30%',
        left: '10%',
        right: '10%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 24,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    photoButtonRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16, gap: 16 },
    photoButton: { alignItems: 'center', backgroundColor: '#1565c0', borderRadius: 12, padding: 16, marginHorizontal: 8, flex: 1 },
    photoButtonText: { color: '#fff', fontWeight: 'bold', marginTop: 8, fontSize: 16 },
});

export default ProfileImagePicker; 