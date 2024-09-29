import { Alert, Text, View } from "react-native"
import CustomButton from "./CustomButton"
import { useStripe } from "@stripe/stripe-react-native";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/fetch";
import { PaymentProps } from "@/types/type";
import { useLocationStore } from "@/store";
import { useAuth } from "@clerk/clerk-react";
import ReactNativeModal from "react-native-modal";
import { Image } from "react-native";
import { images } from "@/constants";
import { router } from "expo-router";

const Payment = ({fullName,amount,email,driverId,rideTime}:PaymentProps) => {
        const { initPaymentSheet, presentPaymentSheet } = useStripe();
        const [loading, setLoading] = useState(false);
        const [success, setSuccess] = useState(false);
        const {userAddress,userLongitude,userLatitude,destinationAddress,destinationLatitude,destinationLongitude} = useLocationStore()
        const {userId} = useAuth()

        const initializePaymentSheet = async () => {
        
          const { error } = await initPaymentSheet({
            merchantDisplayName: "Go Along, Inc.",
            intentConfiguration: {
                mode: {
                    amount:parseInt(amount)*100,
                    currencyCode:"USD"
                },
                confirmHandler:async(paymentMethod,_,intentCreationCallback) => {
                    const {paymentIntent,customer} = await fetchAPI("/(api)/(stripe)/create",{
                        method:"POST",
                        headers:{
                            "Content-Type":"application/json"
                        },
                        body:JSON.stringify({
                            name:fullName||email.split("@")[0],
                            email:email,
                            amount:amount,
                            paymentMethodId:paymentMethod.id
                        })
                    })
        
                    if(paymentIntent.client_secret){
                        const {result} = await fetchAPI("/(api)/(stripe)/pay",{
                            method:"POST",
                            headers:{
                                "Content-Type":"application/json"
                            },
                            body:JSON.stringify({
                                payment_intent_id:paymentIntent.id,
                                payment_method_id:paymentMethod.id,
                                customer_id:customer
                            })
                        })
                        if(result.client_secret){
                            await fetchAPI("/(api)/ride/create",{
                                method:"POST",
                                headers:{
                                    "Content-Type":"application/json"
                                },
                                body:JSON.stringify({
                                    origin_address:userAddress,
                                    destination_address:destinationAddress,
                                    origin_latitude:userLatitude,
                                    origin_longitude:userLongitude,
                                    destination_longitude:destinationLongitude,
                                    destination_latitude:destinationLatitude,
                                    ride_time:rideTime.toFixed(0),
                                    fare_price:parseInt(amount)*100,
                                    payment_status:"paid",
                                    driver_id:driverId,
                                    user_id:userId
                                })
                            })
                            intentCreationCallback({
                                clientSecret:result.client_secret
                            })
                        }
                    }
                }
            },
            returnURL: "myapp'//book-ride"
          });
          if (error) {
            Alert.alert(`Error code: ${error}`);
           
            setLoading(true);
          }
        };

        const openPaymentSheet = async () => {
            await initializePaymentSheet()
            const { error } = await presentPaymentSheet();

            if (error) {
              Alert.alert(`Error code: ${error.code}`, error.message);
            } else {
                setSuccess(true)
              Alert.alert('Success', 'Your order is confirmed!');
            }
        };
        
    return (
        <>
        <CustomButton title="Confirm Ride" 
            className="my-10"
            onPress={openPaymentSheet}
        />
        <ReactNativeModal
            isVisible={success}
            onBackdropPress={()=>setSuccess(false)}
        >
            <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
                <Image
                    source={images.check}
                    className="w-28 h-28 mt-5"
                />
                <Text className="text-2xl text-center font-JakartaBold mt-5">
                    Ride Booked
                </Text>
                <Text className="text-md text-center font-JakartaMedium mt-3 text-general-200">
                    Thank you for your booking
                </Text>
                <CustomButton title="Back Home" className="mt-5" onPress={()=>{setSuccess(false),router.push('/(root)/(tabs)/Home')}}/>
            </View>
        </ReactNativeModal>
        </>
    )
}

export default Payment