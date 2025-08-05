import Loading from '@/components/Loading';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useQuery } from '@/hooks/useQueryStore';
import { Person } from '@/types/sanity';
import { urlFor } from '@/utils/image_url';
import { createDataAttributeWebOnly } from '@/utils/preview';
import { sharedStyles as styles } from '@/utils/styles';
import { Link, useLocalSearchParams } from 'expo-router';
import groq from 'groq';
import { Image } from 'react-native';

export default function PersonScreen() {
  const { person_slug } = useLocalSearchParams();
  const query = groq`*[_type == "person" && slug.current == $person_slug][0] {
    _id,
    _type,
    name,
    slug { current },
    image{..., asset->{url}},
  }`

  const { data } = useQuery<Person>(query, { person_slug })

  if (!data) {
    return <Loading/>
  }



  const { _id, _type, name, image } = data
  const imageAttr = createDataAttributeWebOnly({
    id: _id,
    type: _type,
    path: 'image'
  })

  return (
    <ParallaxScrollView
      headerImage={<Image 
        // @ts-expect-error The react-native-web TS types haven't been updated to support dataSet.
        dataSet={{ sanity: imageAttr.toString() }}
        source={image ? { uri: urlFor(image)?.url() } : require('@/assets/images/actors.jpg')} style={styles.headerImage} resizeMode="contain" />}
      headerBackgroundColor={{ light: '#FFF', dark: '#1D3D47' }}
    >
      <Link style={styles.link} href="/people">All People</Link>
      <ThemedView style={styles.centeredFlexContainer}>
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{name}</ThemedText>
      </ThemedView>

    </ParallaxScrollView>
  );
}

