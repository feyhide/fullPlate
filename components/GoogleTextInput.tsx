import { useLocationStore } from '@/store'
import { icons } from "@/constants";
import { GoogleInputProps, MapboxSuggestion } from "@/types/type";
import { Image, View, TextInput, FlatList, TouchableOpacity, Text } from "react-native";
import React, { useState } from "react";
import axios from "axios";



const GoogleTextInput = ({
    icon,
    initialLocation,
    containerStyle,
    textInputBackgroundColor,
    handlePress
}: GoogleInputProps) => {
    const { userLatitude, userLongitude } = useLocationStore();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);
    
    const fetchNearbySuggestions = async (input: string) => {
        if (!input || !userLatitude || !userLongitude) {
            setSuggestions([]);
            return;
        }

        try {
            const mapboxAccessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN; // Ensure you set this in your environment

            const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json`, {
                params: {
                    access_token: mapboxAccessToken,
                    limit: 5,
                    language: 'en',
                    proximity: `${userLongitude},${userLatitude}`,
                },
            });

            setSuggestions(response.data.features);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSuggestionPress = (suggestion: MapboxSuggestion) => {
        handlePress({
            latitude: suggestion.geometry.coordinates[1],
            longitude: suggestion.geometry.coordinates[0],
            address: suggestion.place_name,
        });
        setQuery('');
        setSuggestions([]);
    };

    return (
        <View className={`flex flex-row items-center justify-center relative z-50 rounded-xl mb-5 px-2 ${containerStyle}`}>
            <View className="flex justify-center items-center" style={{ width: 40 }}>
                <Image
                    source={icon ? icon : icons.search}
                    className="w-6 h-6"
                    resizeMode="contain"
                />
            </View>
            <View className="flex-1">
                <TextInput
                    style={{
                        backgroundColor: textInputBackgroundColor || 'white',
                        fontSize: 16,
                        fontWeight: "600",
                        width: '100%',
                        borderRadius: 20,
                        paddingLeft: 10,
                        paddingVertical: 10,
                    }}
                    placeholder={initialLocation ?? "Where do you want to go ?"}
                    placeholderTextColor="gray"
                    value={query}
                    onChangeText={(text) => {
                        setQuery(text);
                        fetchNearbySuggestions(text);
                    }}
                />
            </View>
            {suggestions.length > 0 && (
                <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSuggestionPress(item)}>
                            <View className="bg-white w-full rounded-xl m-3">
                                <Text>{item.place_name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    style={{
                        position: 'absolute',
                        top: 50,
                        width: '100%',
                        backgroundColor: 'white',
                        borderRadius: 10,
                        elevation: 5,
                    }}
                />
            )}
        </View>
    );
};

export default GoogleTextInput;
