import Loading from '@/components/Loading';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useQuery } from '@/hooks/useQueryStore';
import { Person } from '@/types/sanity';
import { createDataAttributeWebOnly } from '@/utils/preview';
import { sharedStyles as styles } from '@/utils/styles';
import { Link } from 'expo-router';
import groq from 'groq';
import { Image } from 'react-native';

export default function PeopleScreen() {
  const query = groq`*[_type == "person"]| order(title asc) { _id, _type, _key, name, slug { current }, image { asset -> { url } } } `
  const {data} = useQuery<Person[]>(query)

  if (!data) {
    return <Loading/>
  }

  if(data.length === 0) {
    return (
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">No people found</ThemedText>
      </ThemedView>
    )
  }

  return (
    <ParallaxScrollView
      headerImage={<Image source={require('@/assets/images/actors.jpg')} style={styles.headerImage} />}
      headerBackgroundColor={{ light: '#FFF', dark: '#1D3D47' }}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">People:</ThemedText>
      </ThemedView>
      {data?.map((person: Person) => {
        const { _id, _type, image, slug, name } = person
        const imageAttr = createDataAttributeWebOnly({
          id: _id,
          type: _type,
          path: 'image'
        })

        return (<ThemedView key={slug.current} style={styles.elementContainer}>
          <Image 
          // @ts-expect-error The react-native-web TS types haven't been updated to support dataSet.
          dataSet={{ sanity: imageAttr.toString() }}
          source={{ uri: image?.asset?.url }} style={styles.image} />
          <ThemedText type="default">
              <Link 
              style={styles.link}
              href={{
                pathname: '/person/[person_slug]',
                params: { person_slug: slug.current }
              }}>
                {name}
              </Link>
            </ThemedText>
        </ThemedView>)
      })}
    </ParallaxScrollView>
    
  );
}

