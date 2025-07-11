import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ProfileImagePicker from '../components/ProfileImagePicker';
import { signin, signout } from '../features/session/session.slice';
import { updateUser } from '../features/users/users.slice';
import { useAppDispatch, useCurrentUser, useUsersList } from '../store/hooks';

const Profile = React.memo(() => {
    const dispatch = useAppDispatch();
    const currentUser = useCurrentUser();
    const users = useUsersList();
    const [editing, setEditing] = useState(false);
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

    // Handle avatar change from ProfileImagePicker
    const handleAvatarChange = useCallback((image: string) => {
        setProfile((prev) => ({ ...prev, avatar: image }));
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <ProfileImagePicker
                value={profile.avatar}
                onChange={handleAvatarChange}
                editing={editing}
            />
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
