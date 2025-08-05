import Loading from '@/components/Loading';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useQuery } from '@/hooks/useQueryStore';
import { Movie } from '@/types/sanity';
import { urlFor } from '@/utils/image_url';
import { createDataAttributeWebOnly } from '@/utils/preview';
import { sharedStyles as styles } from '@/utils/styles';
import { Link } from 'expo-router';
import groq from 'groq';
import { Image } from 'react-native';

export default function MoviesScreen() {
  const query = groq`*[_type == "movie"]| order(title asc) { _id, _type, _key, title, slug { current }, poster { ..., asset -> { url } }, ...} `
  const { data } = useQuery<Movie[]>(query)
  
  if (!data) {
    return (
      <Loading />
    )
  }

  if(data.length === 0) {
    return (
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">No movies found</ThemedText>
      </ThemedView>
    )
  }

  return (
    <ParallaxScrollView
      headerImage={<Image source={require('@/assets/images/movies.jpg')} style={styles.headerImage} />}
      headerBackgroundColor={{ light: '#FFF', dark: '#1D3D47' }}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Movies:</ThemedText>
      </ThemedView>
      {data?.map((movie: Movie) => {
        const { _id, _type, title, slug, poster } = movie
        const attr = createDataAttributeWebOnly({id: _id, type: _type, path: 'poster'})
        const image = urlFor(poster)?.url()

        return (
          <ThemedView key={slug.current} style={styles.elementContainer}>
            <ThemedView
            >
              {image && <Image
                // @ts-expect-error The react-native-web TS types haven't been updated to support dataSet.
                dataSet={{ sanity: attr.toString() }}
                source={{ uri:image }}
                style={styles.image}
              />}
            </ThemedView>
            <ThemedText type="default">
              <Link 
              style={styles.link}
              href={{
                pathname: '/movie/[movie_slug]',
                params: { movie_slug: slug.current }
              }}>
                {title}
              </Link>
            </ThemedText>
          </ThemedView>)
      }
      )}
    </ParallaxScrollView>
  );
}

