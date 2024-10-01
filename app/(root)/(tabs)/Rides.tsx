import RideCard from "@/components/RideCard";
import { images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { useUser } from "@clerk/clerk-react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";

const Rides = () => {
    const { user } = useUser()
    const {data:recentRides, loading} = useFetch(`/(api)/ride/${user?.id}`)
    return(
        <SafeAreaView>
            <FlatList
                data={recentRides}
                renderItem={({item})=><RideCard ride={item}/>}
                className='px-5'
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    paddingBottom:100
                }}
                ListEmptyComponent={()=>(
                    <View className='flex flex-col h-[90vh] items-center justify-center'>
                    {!loading ? (
                        <>
                        <Image
                            alt="No recent rides found"
                            resizeMode='contain'
                            className='w-40 h-40' source={images.noResult}/>
                        <Text className='text-sm'>
                            No recent rides found
                        </Text>
                        </>
                    ):(
                        <ActivityIndicator size="small" color="#000"/>
                    )}
                    </View>
                )}
                ListHeaderComponent={()=>(
                    <>
                    <Text className='text-2xl font-JakartaBold mt-5 mb-3'>
                        Previous Rides
                    </Text>
                    </>
                )}
            />
        </SafeAreaView>
    )
}

export default Rides;