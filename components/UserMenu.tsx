import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Divider, Menu, Text } from 'react-native-paper';

interface UserMenuProps {
    userName: string;
    userAvatar?: string | null;
    onLogout: () => void;
    onProfile: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ userName, userAvatar, onLogout, onProfile }) => {
    const [visible, setVisible] = useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <View style={styles.container}>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <TouchableOpacity onPress={openMenu} activeOpacity={0.7}>
                        {userAvatar ? (
                            <Avatar.Image
                                size={36}
                                source={{ uri: userAvatar }}
                                style={styles.avatarButton}
                            />
                        ) : (
                            <Avatar.Icon
                                size={36}
                                icon="account"
                                style={styles.avatarButton}
                            />
                        )}
                    </TouchableOpacity>
                }
                contentStyle={styles.menuContent}
            >
                <View style={styles.menuHeader}>
                    {userAvatar ? (
                        <Avatar.Image
                            size={48}
                            source={{ uri: userAvatar }}
                            style={styles.menuAvatar}
                        />
                    ) : (
                        <Avatar.Icon
                            size={48}
                            icon="account"
                            style={styles.menuAvatar}
                        />
                    )}
                    <Text style={styles.menuName}>{userName}</Text>
                </View>
                <Divider style={{ marginVertical: 4 }} />
                <Menu.Item onPress={() => { closeMenu(); onProfile(); }} title="Profile" leadingIcon="account-circle" />
                <Menu.Item onPress={() => { closeMenu(); onLogout(); }} title="Logout" leadingIcon="logout" />
            </Menu>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarButton: {
        backgroundColor: '#1565c0',
        marginRight: 0,
    },
    menuContent: {
        minWidth: 180,
        paddingVertical: 8,
    },
    menuHeader: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    menuAvatar: {
        backgroundColor: '#1565c0',
        marginBottom: 4,
    },
    menuName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1565c0',
        marginTop: 2,
    },
});

export default UserMenu; 