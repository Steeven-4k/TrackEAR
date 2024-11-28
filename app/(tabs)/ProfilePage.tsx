import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

import { styles } from "./ProfilePage.style";

export default function ProfilePage() {
  const router = useRouter(); // Utilise le hook useRouter

  // States for the Name, Email, Phone number and editing button
  const [name, setName] = useState("Marie CHAVENEAU");
  const [email, setEmail] = useState("marie.chaveneau@gmail.com");
  const [phone, setPhone] = useState("XXXXXXXXXX");
  const [isEditing, setIsEditing] = useState(false); // State for activating Editing

  // Check if the email is valid
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex to validate the email
    return emailRegex.test(email); // Return True or False
  };

  return (
    <View style={styles.container}>
      {/* Avatar section */}
      <View style={styles.avatarSection}>
        <Image
          source={require("../../assets/images/avatar.png")}
          style={styles.avatar}
        />
        {/* Editing Icon */}
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => {
            if (isEditing) {
              // If editing mode is left, the email is validated
              if (!validateEmail(email)) {
                Alert.alert("Error", "Invalid email address");
                return;
              }
            }
            setIsEditing(!isEditing); // Change editing mode state
          }}
        >
          <Text style={styles.editText}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Name section */}
      {isEditing ? (
        <TextInput
          style={[styles.name, styles.editingName]}
          value={name}
          onChangeText={(text) => setName(text.replace(/[^a-zA-Z\s]/g, ""))}
          placeholder="Enter your name"
          maxLength={30} // Limit to 30 characters
        />
      ) : (
        <Text style={styles.name}>{name}</Text>
      )}

      {/* Information section */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.inputValue]} // Add padding
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Enter your email"
              keyboardType="email-address"
              maxLength={50}
            />
          ) : (
            <Text
              style={[styles.value, styles.textValue]} // Add some space between label and value
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {email}
            </Text>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone N°</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.inputValue]}
              value={phone}
              onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ""))}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              maxLength={10}
            />
          ) : (
            <Text
              style={[styles.value, styles.textValue]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {phone}
            </Text>
          )}
        </View>
      </View>

      {/* Buttons section */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Historic</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/SettingsPage")} // Navigue vers SettingsPage
        >
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
