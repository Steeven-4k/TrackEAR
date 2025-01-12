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
import i18n from "../../constants/i18n";

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
      Alert.alert(i18n.t("error"), i18n.t("limitRelatives"));
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
      Alert.alert(i18n.t("error"), i18n.t("allFieldsRequired"));
      return;
    }

    if (!validateEmail(currentRelative.email)) {
      Alert.alert(i18n.t("error"), i18n.t("invalidEmail"));
      return;
    }

    if (!validatePhoneNumber(currentRelative.phone)) {
      Alert.alert(i18n.t("error"), i18n.t("invalidPhone"));
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
            {currentRelative.id
              ? i18n.t("editRelative")
              : i18n.t("addRelative")}
          </Text>
          <Text style={styles.subtitle}>
            {currentRelative.id
              ? i18n.t("editRelativeSubtitle")
              : i18n.t("addRelativeSubtitle")}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={i18n.t("firstname")}
            value={currentRelative.firstname}
            onChangeText={(text) =>
              setCurrentRelative({ ...currentRelative, firstname: text })
            }
            maxLength={30}
          />
          <TextInput
            style={styles.input}
            placeholder={i18n.t("lastname")}
            value={currentRelative.lastname}
            onChangeText={(text) =>
              setCurrentRelative({ ...currentRelative, lastname: text })
            }
            maxLength={50}
          />
          <TextInput
            style={styles.input}
            placeholder={i18n.t("alias")}
            value={currentRelative.alias}
            onChangeText={(text) =>
              setCurrentRelative({ ...currentRelative, alias: text })
            }
            maxLength={20}
          />
          <TextInput
            style={styles.input}
            placeholder={i18n.t("email")}
            value={currentRelative.email}
            onChangeText={(text) =>
              setCurrentRelative({ ...currentRelative, email: text })
            }
            keyboardType="email-address" // Clavier spécifique pour les e-mails
            maxLength={50}
          />
          <TextInput
            style={styles.input}
            placeholder={i18n.t("phone")}
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
              {currentRelative.id ? i18n.t("update") : i18n.t("save")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => {
              setIsAdding(false);
              setCurrentRelative(null);
            }}
          >
            <Text style={styles.actionText}>{i18n.t("cancel")}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <Text style={styles.title}>{i18n.t("relativesPageTitle")}</Text>
          <Text style={styles.subtitle}>{i18n.t("relativesPageSubtitle")}</Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddRelative}
          >
            <Text style={styles.addButtonText}>
              {i18n.t("addRelativeButton")}
            </Text>
          </TouchableOpacity>

          {relatives.length > 0 && (
            <Text style={styles.listSubtitle}>{i18n.t("listOfRelatives")}</Text>
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
                    <Text style={styles.actionText}>{i18n.t("delete")}</Text>
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
