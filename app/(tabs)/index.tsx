import { Text, View, TouchableOpacity, Image } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

import { styles } from "./HomePage.style";

export default function App() {
  const router = useRouter(); // Utilise le hook useRouter

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
            />
          </View>

          {/* Texte principal */}
          <Text style={styles.title}>Find the sound, wherever it is</Text>
          <Text style={styles.subtitle}>
            Stay connected, even in case of loss
          </Text>

          {/* Bouton principal */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/GeolocationPage")}
          >
            <Text style={styles.buttonText}>Find Your Aids</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
