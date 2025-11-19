import { ScrollView, View } from "react-native";
import type { PropsWithChildren } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = PropsWithChildren<{}>;

export default function SafeAreaScrollView({children}: Props) {
    const insets = useSafeAreaInsets();
    return (
        <ScrollView 
            style={{paddingTop: insets.top, flex: 1}}
            contentContainerStyle={{flexGrow: 1}}>
            <View style={{  
                flex: 1,
                padding: 32,
                gap: 16,
                overflow: 'hidden',
            }}>
                {children}
            </View>
        </ScrollView>
    )
}
