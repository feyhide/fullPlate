import { icons } from "@/constants";
import { Tabs } from "expo-router";
import { ImageSourcePropType, View } from "react-native";
import { Image } from "react-native";

const TabIcon = ({focused,source}:{source:ImageSourcePropType,focused:boolean}) => (
    <View className={`flex flex-row justify-center items-center rounded-full ${focused ? "bg-general-300":""}`}>
        <View className={`rounded-full w-12 h-12 items-center justify-center ${focused ? "bg-[#2f80ed]":""}`}>
            <Image
             resizeMode="contain"
             className="w-7 h-7"
             source={source} 
             tintColor="white"/>
        </View>
    </View>
)

export default function Layout() {
  return (
    <Tabs initialRouteName="index" screenOptions={{
        tabBarActiveTintColor:'white',
        tabBarInactiveTintColor:"white",
        tabBarShowLabel:false,
        tabBarStyle:{
            backgroundColor:"#333333",
            borderRadius:50,
            paddingBottom:0,
            overflow:"hidden",
            marginBottom:10,
            marginHorizontal:10,
            height:60,
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            flexDirection:"row",
            position:"absolute"
        }
    }}>
        <Tabs.Screen
            name="Home"
            options={{
                title:"Home",
                headerShown:false,
                tabBarIcon:({focused})=><TabIcon focused={focused} source={icons.home}/>
            }}
        />
        <Tabs.Screen
            name="Chat"
            options={{
                title:"Chat",
                headerShown:false,
                tabBarIcon:({focused})=><TabIcon focused={focused} source={icons.chat}/>
            }}
        />
        <Tabs.Screen
            name="Profile"
            options={{
                title:"Profile",
                headerShown:false,
                tabBarIcon:({focused})=><TabIcon focused={focused} source={icons.profile}/>
            }}
        />
        <Tabs.Screen
            name="Rides"
            options={{
                title:"Rides",
                headerShown:false,
                tabBarIcon:({focused})=><TabIcon focused={focused} source={icons.list}/>
            }}
        />
    </Tabs>
  );
}
