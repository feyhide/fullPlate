import { ButtonProps } from "@/types/type"
import { Text, TouchableOpacity } from "react-native"

const getBGVariantStyle = (variant: ButtonProps['bgVariant']) => {
    switch(variant){
        case 'secondary':
            return 'bg-gray-500';
        
        case 'danger':
            return 'bg-red-500';
            
        case 'success':
            return 'bg-green-500';
            
        case 'outline':
            return 'bg-transparent border-neutral-300 border-[0.5px]';
        
        default:
            return 'bg-[#0286FF]'  
    }
}

const getTextVariantStyle = (variant: ButtonProps['textVariant']) => {
    switch(variant){
        case 'secondary':
            return 'text-gray-100';
        
        case 'danger':
            return 'text-red-100';
            
        case 'success':
            return 'text-green-100';
            
        case 'primary':
            return 'text-black';
        
        default:
            return 'text-white'  
    }
}


const CustomButton = ({
    onPress,
    title,
    bgVariant="primary",
    textVariant="default",
    IconLeft,
    IconRight,
    className,
    ...props}:ButtonProps) => {
        return(
            <TouchableOpacity onPress={onPress} 
                {...props}    
                className={`w-full rounded-full flex flex-row my-5 justify-center
                items-center shadow-md shadow-neutral-400/70 ${className} ${getBGVariantStyle(bgVariant)}`}
            >
                {IconLeft && <IconLeft/>}
                <Text className={`text-lg font-JakartaMedium p-2 ${getTextVariantStyle(textVariant)}`}>{title}</Text>
                {IconRight && <IconRight/>}
            </TouchableOpacity>
        )
}

export default CustomButton