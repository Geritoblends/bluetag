import type { PropsWithChildren } from "react";

export default function Card({children}: PropsWithChildren<{}>) {
    return (
        <View style={styles.container}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: red
    }
});
