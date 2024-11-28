import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from "react-native";

import { styles } from "./RelativesPage.style";

export default function RelativesPage() {
  const [relatives, setRelatives] = useState([]); // Liste des contacts
  const [isAdding, setIsAdding] = useState(false); // État pour le formulaire
  const [currentRelative, setCurrentRelative] = useState(null); // Contact en cours d'édition

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d+$/; // Vérifie que le numéro ne contient que des chiffres
    return phoneRegex.test(phone);
  };

  const handleAddRelative = () => {
    if (relatives.length >= 10) {
      Alert.alert(
        "Error",
        "You cannot add more than 10 contacts. Please, delete the existing ones."
      );
      return;
    }
    setIsAdding(true);
    setCurrentRelative({
      id: null, // Ajout d'un ID pour le contact
      firstname: "",
      lastname: "",
      alias: "",
      email: "",
      phone: "",
    });
  };

  const handleSaveRelative = () => {
    if (
      !currentRelative.firstname ||
      !currentRelative.lastname ||
      !currentRelative.email ||
      !currentRelative.phone
    ) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (!validateEmail(currentRelative.email)) {
      Alert.alert("Error", "Invalid email address.");
      return;
    }

    if (!validatePhoneNumber(currentRelative.phone)) {
      Alert.alert("Error", "Phone number must contain only digits.");
      return;
    }

    if (currentRelative.id) {
      // Mise à jour d'un contact existant
      setRelatives((prev) =>
        prev.map((relative) =>
          relative.id === currentRelative.id ? currentRelative : relative
        )
      );
    } else {
      // Ajout d'un nouveau contact
      setRelatives((prev) => [
        ...prev,
        { ...currentRelative, id: Date.now() }, // Génération d'un ID unique
      ]);
    }

    setIsAdding(false);
    setCurrentRelative(null);
  };

  const handleEditRelative = (relative) => {
    setIsAdding(true);
    setCurrentRelative(relative); // Charge les infos existantes dans le formulaire
  };

  const handleDeleteRelative = (id) => {
    setRelatives((prev) => prev.filter((relative) => relative.id !== id));
  };

  // Fonction utilitaire pour tronquer une chaîne
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "..."; // Ajoute "..." si le texte est trop long
    }
    return text;
  };

  return (
    <View style={styles.container}>
      {isAdding ? (
        <View style={styles.addContainer}>
          <Text style={styles.title}>
            {currentRelative.id ? "Edit Relative" : "Add a Relative"}
          </Text>
          <Text style={styles.subtitle}>
            {currentRelative.id
              ? "Modify information of your relative"
              : "Configure information of your relatives to alert in case of loss"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Firstname"
            value={currentRelative.firstname}
            onChangeText={(text) =>
              setCurrentRelative({ ...currentRelative, firstname: text })
            }
            maxLength={30}
          />
          <TextInput
            style={styles.input}
            placeholder="Lastname"
            value={currentRelative.lastname}
            onChangeText={(text) =>
              setCurrentRelative({ ...currentRelative, lastname: text })
            }
            maxLength={50}
          />
          <TextInput
            style={styles.input}
            placeholder="Alias"
            value={currentRelative.alias}
            onChangeText={(text) =>
              setCurrentRelative({ ...currentRelative, alias: text })
            }
            maxLength={20}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={currentRelative.email}
            onChangeText={(text) =>
              setCurrentRelative({ ...currentRelative, email: text })
            }
            keyboardType="email-address" // Clavier spécifique pour les e-mails
            maxLength={50}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone N°"
            value={currentRelative.phone}
            onChangeText={(text) =>
              setCurrentRelative({
                ...currentRelative,
                phone: text.replace(/[^0-9]/g, ""),
              })
            }
            maxLength={10}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSaveRelative}
          >
            <Text style={styles.actionText}>
              {currentRelative.id ? "Update" : "Save"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => {
              setIsAdding(false);
              setCurrentRelative(null);
            }}
          >
            <Text style={styles.actionText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <Text style={styles.title}>Contacts To Alert</Text>
          <Text style={styles.subtitle}>
            Relatives will receive an alert in case of loss of your hearing aids
          </Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddRelative}
          >
            <Text style={styles.addButtonText}>Add a Relative</Text>
          </TouchableOpacity>

          {relatives.length > 0 && (
            <Text style={styles.listSubtitle}>List of Relatives</Text>
          )}

          <FlatList
            data={relatives}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.relativeItem}>
                {/* Tronquer le nom et prénom */}
                <Text style={styles.relativeName}>
                  {truncateText(item.firstname, 10)}{" "}
                  {truncateText(item.lastname, 10)}
                </Text>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() => handleEditRelative(item)}
                  >
                    <Text style={styles.detailText}>ℹ️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteRelative(item.id)}
                  >
                    <Text style={styles.actionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}
