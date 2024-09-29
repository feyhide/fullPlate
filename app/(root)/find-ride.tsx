import CustomButton from "@/components/CustomButton"
import GoogleTextInput from "@/components/GoogleTextInput"
import RideLayout from "@/components/RideLayout"
import { icons } from "@/constants"
import { useLocationStore } from "@/store"
import { router } from "expo-router"
import { Text } from "react-native"
import { View } from "react-native"

const FindRide = () => {
    const {userAddress,
        destinationAddress,
        setDestinationLocation,
        setUserLocation
    } = useLocationStore()
    return (
        <RideLayout title="Ride" snapPoints={["85%"]}>
            <View className="">
                <Text className="text-lg font-JakartaSemiBold mb-3">From</Text>
                <GoogleTextInput
                    icon={icons.target}
                    initialLocation={userAddress!}
                    containerStyle="bg-neutral-100"
                    textInputBackgroundColor="#f5f5f5"
                    handlePress={(location)=>setUserLocation(location)}
                />
            </View>
            <View className="">
                <Text className="text-lg font-JakartaSemiBold mb-3">To</Text>
                <GoogleTextInput
                    icon={icons.map}
                    initialLocation={destinationAddress!}
                    containerStyle="bg-neutral-100"
                    textInputBackgroundColor="#f5f5f5"
                    handlePress={(location)=>setDestinationLocation(location)}
                />
            </View>
            <CustomButton title="Find Ride" className="mt-5" onPress={()=>router.push('/(root)/confirm-ride')}/>
        </RideLayout>
    )
}

export default FindRide