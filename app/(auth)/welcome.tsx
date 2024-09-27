import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";

const Welcome = () => {
    return(
        <SafeAreaView>
            <Text className="text-red-600">Welcome</Text>
        </SafeAreaView>
    )
}

export default Welcome;