import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { calculateDriverTimes, calculateRegion, generateMarkersFromData } from "@/lib/map";
import { useLocationStore, useDriverStore } from "@/store";
import { Driver, MarkerData } from "@/types/type";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const Map = () => {
    const { data: drivers, loading, error } = useFetch<Driver[]>(`/(api)/driver`);

    const {
        userLongitude,
        userLatitude,
        destinationLongitude,
        destinationLatitude
    } = useLocationStore();
    const { selectedDriver, setDrivers } = useDriverStore();
    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const region = calculateRegion({
        userLongitude,
        userLatitude,
        destinationLongitude,
        destinationLatitude
    });

    useEffect(() => {
        if (markers.length > 0 && destinationLatitude && destinationLongitude) {
            calculateDriverTimes({
                markers,
                userLongitude,
                userLatitude,
                destinationLatitude,
                destinationLongitude,
            }).then((drivers) => {
                setDrivers(drivers as MarkerData[]);
            });
        }
    }, [markers, destinationLatitude, destinationLongitude]);

    useEffect(() => {
        if (Array.isArray(drivers)) {
            if (userLatitude !== null && userLongitude !== null) {
                const newMarkers = generateMarkersFromData({
                    data: drivers,
                    userLatitude,
                    userLongitude,
                });
                setMarkers(newMarkers);
            }
        }
    }, [drivers, userLatitude, userLongitude]);

    if (loading || (!userLatitude || !userLongitude)) {
        return (
            <View className="flex justify-center items-center w-full">
                <ActivityIndicator size="small" color="#000" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex justify-center items-center w-full">
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <MapView
            provider={PROVIDER_DEFAULT}
            className="w-full h-full rounded-2xl"
            mapType="mutedStandard"
            tintColor="black"
            showsPointsOfInterest={false}
            initialRegion={region}
            showsUserLocation={true}
            userInterfaceStyle="light"
        >
            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    coordinate={{
                        longitude: marker.longitude,
                        latitude: marker.latitude
                    }}
                    title={marker.title}
                    image={
                        selectedDriver === marker.id ? icons.selectedMarker : icons.marker
                    }
                />
            ))}
            {destinationLatitude && destinationLongitude && (
                <>
                    <Marker
                        key='destination'
                        coordinate={{
                            latitude: destinationLatitude,
                            longitude: destinationLongitude
                        }}
                        title="Destination"
                        image={icons.pin}
                    />
                    <MapViewDirections
                        origin={{
                            latitude: userLatitude,
                            longitude: userLongitude,
                        }}
                        destination={{
                            latitude: destinationLatitude,
                            longitude: destinationLongitude,
                        }}
                        apikey={process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN} // Your Mapbox API key
                        strokeColor="#0286ff"
                        strokeWidth={2}
                        onReady={(result) => {
                            // Handle route result here if needed
                        }}
                        onError={(errorMessage) => {
                            console.error(errorMessage);
                        }}
                    />
                </>
            )}
        </MapView>
    );
};

export default Map;
