import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React from 'react'

const SignIn = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const onSignInPress = React.useCallback(async () => {
        if (!isLoaded) {
          return
        }
    
        try {
          const signInAttempt = await signIn.create({
            identifier: form.email,
            password:form.password,
          })
    
          if (signInAttempt.status === 'complete') {
            await setActive({ session: signInAttempt.createdSessionId })
            router.replace('/')
          } else {
            console.error(JSON.stringify(signInAttempt, null, 2))
          }
        } catch (err: any) {
            Alert.alert("Error",err.errors[0].longMessage)
        }
      }, [isLoaded, form.email, form.password])

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView>
                <View className="relative w-full h-[150px]">
                    <Image source={images.signUpCar} className="z-0 w-full h-[250px] opacity-30" />
                    <Text className="font-JakartaBold absolute bottom-5 left-5 text-2xl text-black">
                        Log In
                    </Text>
                </View>
                <View className="px-5">
                    <InputField 
                        label="Email" 
                        placeholder="Enter your email" 
                        icon={icons.email} 
                        value={form.email} 
                        onChangeText={(value) => setForm({ ...form, email: value })} 
                    />
                    <InputField 
                        label="Password" 
                        placeholder="Enter your password" 
                        icon={icons.lock} 
                        value={form.password} 
                        secureTextEntry={true} 
                        onChangeText={(value) => setForm({ ...form, password: value })} 
                    />
                    <CustomButton title="Sign In" onPress={onSignInPress} className="mt-6 w-full" />
                    
                    <OAuth/>

                    <Link className="text-lg text-center text-general-200 mt-5" href='/(auth)/sign-up'>
                        <Text>Don't have an account ?</Text>
                        <Text className="text-primary-500"> Sign Up</Text>
                    </Link>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignIn;
