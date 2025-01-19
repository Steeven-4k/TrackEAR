import React, { useState, useEffect } from "react";
import { View, Alert, Button } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";

import { styles } from "./GeolocationPage.style";

const GeolocationPage: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 48.8566, // Coordonnées par défaut (Paris)
    longitude: 2.3522,
  });

  const [region, setRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [hearingAids] = useState([
    { id: 1, latitude: 48.857, longitude: 2.3525 },
    { id: 2, latitude: 48.858, longitude: 2.353 },
  ]);

  useEffect(() => {
    const startLocationTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "Activez la localisation pour continuer."
        );
        return;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          setCurrentLocation({ latitude, longitude });
          setRegion((prevRegion) => ({
            ...prevRegion,
            latitude,
            longitude,
          }));
        }
      );

      return subscription;
    };

    let locationSubscription: Location.LocationSubscription | undefined;

    startLocationTracking().then((sub) => {
      locationSubscription = sub;
    });

    return () => {
      locationSubscription?.remove();
    };
  }, []);

  const focusOnUser = () => {
    setRegion({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const focusOnDevice = (device: { latitude: number; longitude: number }) => {
    setRegion({
      latitude: device.latitude,
      longitude: device.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const focusOnBoth = () => {
    const latitudes = [
      currentLocation.latitude,
      ...hearingAids.map((device) => device.latitude),
    ];
    const longitudes = [
      currentLocation.longitude,
      ...hearingAids.map((device) => device.longitude),
    ];

    const minLatitude = Math.min(...latitudes);
    const maxLatitude = Math.max(...latitudes);
    const minLongitude = Math.min(...longitudes);
    const maxLongitude = Math.max(...longitudes);

    setRegion({
      latitude: (minLatitude + maxLatitude) / 2,
      longitude: (minLongitude + maxLongitude) / 2,
      latitudeDelta: Math.max(maxLatitude - minLatitude, 0.01),
      longitudeDelta: Math.max(maxLongitude - minLongitude, 0.01),
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
        showsUserLocation={true}
      >
        <Circle
          center={currentLocation}
          radius={10}
          fillColor="rgba(0, 122, 255, 0.8)"
          strokeColor="rgba(0, 122, 255, 1)"
        />

        {hearingAids.map((device) => (
          <Marker
            key={device.id}
            coordinate={{
              latitude: device.latitude,
              longitude: device.longitude,
            }}
            title={`Appareil auditif ${device.id}`}
            description="Cliquez pour recentrer"
            pinColor="red"
            onPress={() => focusOnDevice(device)}
          />
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Recentrer sur moi" onPress={focusOnUser} />
        <Button title="Recentrer sur les aides" onPress={focusOnBoth} />
      </View>
    </View>
  );
};

export default GeolocationPage;
