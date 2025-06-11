import { Image, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { sharedStyles } from '@/utils/styles';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
      <ParallaxScrollView
        headerImage={<Image source={require('@/assets/images/camera.jpg')} style={styles.headerImage} />}
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          <ThemedText type="subtitle">This is a demo of Sanity Visual Editing in React Native</ThemedText>
          <ThemedText type="default">Click one of the links below (or use the tabs at the bottom of the screen) to visit pages which load lists of the appropriately typed Sanity documents. 
            (See the README.md of this repo to ensure that you have the correct data in your Sanity project)
          </ThemedText>
          <ThemedText>
            If you are on the React Native app itself on your mobile device, 
            you will see the end user view. </ThemedText>

          <ThemedText type="default">If you are in the Sanity studio in a web browser and have correctly configured the presentation plugin, in the Presentation view you will see blue hover overlays for 
            each Sanity field, which can be clicked to jump right to the editing input for that field.</ThemedText>
          <Link style={sharedStyles.link} href="/movies">Movies</Link>
          <Link style={sharedStyles.link} href="/people">People</Link>
        </ThemedView>
      </ParallaxScrollView>

  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 'auto',
    gap: 15
  },
  headerImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
});
