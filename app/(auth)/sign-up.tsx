import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignUp } from '@clerk/clerk-expo'
import ReactNativeModal from "react-native-modal";
import { fetchAPI } from "@/lib/fetch";

const SignUp = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });
    
    const [verification,setVerification] = useState({
        state:"default",
        error:"",
        code:"",
    })

    const { isLoaded, signUp, setActive } = useSignUp()

    const onSignUpPress = async () => {
        if (!isLoaded) {
          return
        }
    
        try {
          await signUp.create({
            emailAddress: form.email,
            password: form.password,
          })
    
          await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
    
          setVerification({...verification,state:"pending"})
        } catch (err: any) {
            Alert.alert("Error",err.errors[0].longMessage)
        }
    }
    
    const onPressVerify = async () => {
        if (!isLoaded) {
          return
        }
    
        try {
          const completeSignUp = await signUp.attemptEmailAddressVerification({
            code:verification.code,
          })
    
          if (completeSignUp.status === 'complete') {
            await fetchAPI(`/(api)/user`,{
                method:"POST",
                body:JSON.stringify({
                    name:form.name,
                    email:form.email,
                    clerkId:completeSignUp.createdUserId
                })
            })
            await setActive({ session: completeSignUp.createdSessionId })
            setVerification({...verification,state:"success"})
          } else {
            setVerification({
                ...verification,
                error:"verification failed.",
                state:"failed"
            })
            console.error(JSON.stringify(completeSignUp, null, 2))
          }
        } catch (err: any) {
            setVerification({
                ...verification,
                error:err.errors[0].longMessage,
                state:"failed"
            })
            console.error(JSON.stringify(err, null, 2))
        }
    }
    

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView>
                <View className="relative w-full h-[150px]">
                    <Image source={images.signUpCar} className="z-0 w-full h-[250px] opacity-30" />
                    <Text className="font-JakartaBold absolute bottom-5 left-5 text-2xl text-black">
                        Create Your Account
                    </Text>
                </View>
                <View className="px-5">
                    <InputField 
                        label="Name" 
                        placeholder="Enter your name" 
                        icon={icons.person} 
                        value={form.name} 
                        onChangeText={(value) => setForm({ ...form, name: value })} 
                    />
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
                    <CustomButton title="Sign Up" onPress={onSignUpPress} className="mt-6 w-full" />
                    
                    <OAuth/>

                    <Link className="text-lg text-center text-general-200 mt-5" href='/(auth)/sign-in'>
                        <Text>Already have an account ?</Text>
                        <Text className="text-primary-500"> Sign In</Text>
                    </Link>
                </View>
                <ReactNativeModal isVisible={verification.state === 'pending'}
                    onModalHide={()=>setVerification({...verification,state:"success"})}
                >
                    <View className="bg-white px-7 rounded-2xl py-9 min-h-[300px]">
                        <Text className="text-3xl mb-2 font-JakartaBold">
                            Verification
                        </Text>
                        <Text className="text-sm mb-2 font-JakartaBold">
                            Verification Code is sent to {form.email}
                        </Text>
                        <InputField 
                            label="Code"
                            icon={icons.lock}
                            placeholder="012345"
                            value={verification.code}
                            keyboardType="numeric"
                            onChangeText={(code)=>
                                setVerification({...verification,code})
                            }
                        />
                        {verification.error && 
                            <Text className="text-red-500 text-sm mt-1">{verification.error}</Text>
                        }
                        <CustomButton
                            title="Verify Email"
                            onPress={onPressVerify}
                            className="mt-5 bg-success-500"
                        />
                    </View>
                </ReactNativeModal>
                
                <ReactNativeModal isVisible={verification.state === 'success'}>
                    <View className="bg-white px-7 rounded-2xl py-9 min-h-[300px]">
                        <Image source={images.check} className="w-[110px] h-[110px] mx-auto my-5"/>
                        <Text className="text-3xl text-center font-JakartaBold">
                            Account Verified
                        </Text>
                        <CustomButton title="Browse Home"
                            onPress={()=>router.replace("/(root)/(tabs)/Home")}
                            className="mt-5"
                        />
                    </View>
                </ReactNativeModal>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignUp;
