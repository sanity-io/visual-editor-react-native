import { sharedStyles as styles } from '@/utils/styles';
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";


export default function Loading() {
    return (<ThemedView style={styles.fullSizeCenteredFlexContainer}>
        <ThemedText>Loading...</ThemedText>
    </ThemedView>)
}