import { Alert, Image, Linking, Text, View } from "react-native";
import CustomButton from "./CustomButton";
import { icons } from "@/constants";
import { useOAuth } from "@clerk/clerk-expo";
import React from "react";
import { googleOAuth } from "@/lib/auth";
import { router } from "expo-router";

const OAuth = () => {
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

    const handleGoogleSignIn = React.useCallback(async () => {
        try {
            const result = await googleOAuth(startOAuthFlow);
            if(result.code === 'session_exists'){
               Alert.alert("Success","session exists. Redirecting you to the home page") 
                router.push("/(root)/(tabs)/Home")
            }
            Alert.alert(result.success? "Success" : "Error",result.message)
            if(result.success){
                router.push("/(root)/(tabs)/Home")
            }
        } catch (err) {
            console.error('OAuth error', err)
        }
    }, [])
    return (
    <View>
        <View className='flex flex-row justify-center items-center mt-4 gap-x-3'>
            <View className="flex-1 h-[1px] bg-general-100"/>
            <Text className="text-lg">Or</Text>
            <View className="flex-1 h-[1px] bg-general-100"/>
        </View>
        <CustomButton title="Log In with Google"
            className="mt-5 w-full shadow-none"
            bgVariant="outline"
            textVariant="primary"
            IconLeft={()=>(
                <Image
                source={icons.google}
                resizeMode="contain"
                className="w-5 h-5 mx-2"
                />
            )}
            onPress={handleGoogleSignIn}
        />
    </View>
)}

export default OAuth;