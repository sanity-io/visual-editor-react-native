import Loading from '@/components/Loading';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SANITY_DATASET, SANITY_PROJECT_ID, SANITY_STUDIO_URL } from '@/constants';
import useOptimistic from '@/hooks/useOptimistic';
import { useQuery } from '@/hooks/useQueryStore';
import { CastMember, Movie, Person } from '@/types/sanity';
import { urlFor } from '@/utils/image_url';
import { createDataAttributeWebOnly } from '@/utils/preview';
import { sharedStyles as styles } from '@/utils/styles';
import { PortableText } from '@portabletext/react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import groq from 'groq';
import { Image } from 'react-native';

export default function MovieScreen() {
  const { movie_slug } = useLocalSearchParams();
  const query = groq`*[_type == "movie" && slug.current == $movie_slug][0]{
    _id,
    _type,
    title,
    overview,
    poster{..., asset->{url}},
    castMembers
  }`
  
  const { data } = useQuery<Movie>(query, { movie_slug })
  const { _id = '', _type = '', title, poster, overview, castMembers } = data || {}
  const castMembersOptimistic = useOptimistic<CastMember>(
    castMembers || [],
    (currentCastMembers: CastMember[], action: { id: string, document: { [key: string]: CastMember[] } }) => {
      if (action?.id === _id && action?.document?.castMembers) {
        return action.document?.castMembers
      }
      return currentCastMembers
    },
  )

  const peopleQuery = groq`*[_type == "person" && _id in $personIds]{ ..., image{ ..., asset->{ url } } }`
  const {data: resolvedPeople = []} = useQuery<Person[]>(peopleQuery, { personIds: castMembersOptimistic.map(castMember => castMember.person._ref) })

    // Your Sanity configuration
  const config = {
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    baseUrl: SANITY_STUDIO_URL,
  }
  const movieAttr = createDataAttributeWebOnly({
    ...config,
    id: _id,
    type: _type,
    path: 'castMembers'
  })

  if (!data) {
    return <Loading/>
  }

  const castMembersWithPeople = castMembersOptimistic.map(castMember => {
    const person = resolvedPeople?.find((person: Person) => person._id === castMember.person._ref) || { name: 'Unknown', image: { asset: { url: '' } } }
    return {
      ...castMember,
      person
    }
  })
    
  return (
    <ParallaxScrollView
      headerImage={<Image source={poster ? { uri: urlFor(poster).url() } : require('@/assets/images/movies.jpg')} style={styles.headerImage} />}
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      useTabBar={false}
    >
      <Link style={styles.link} href="/movies">All Movies</Link>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{title}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.elementContainer}>
        {overview && (
          <ThemedText type="default">
            <PortableText
              value={overview}
            />
          </ThemedText>
        )}
      </ThemedView>


      <ThemedView 
        // @ts-expect-error The react-native-web TS types haven't been updated to support dataSet.
        dataSet={{sanity: movieAttr.toString()}}
        style={styles.list}>
        <ThemedText type="subtitle">Cast</ThemedText>
        {castMembersWithPeople?.map((castMember) => {
          const {_key, characterName, person: { name, image }} = castMember


          const castMemberAttr = createDataAttributeWebOnly({
            ...config,
            id: _id,
            type: _type,
            path: `castMembers[_key=="${_key}"]`,

          })
          const imageUrl = image?.asset?.url ? urlFor(image).url() : ''

          return (
            <ThemedView
            // @ts-expect-error The react-native-web TS types haven't been updated to support dataSet.
            dataSet={{sanity: castMemberAttr.toString()}}
            key={_key}
            style={styles.elementContainer}
            >
              {imageUrl &&<Image source={{ uri: imageUrl }} style={styles.image} />}
              <ThemedView>
                <ThemedText type="default">Character: {characterName}</ThemedText>
                <ThemedText type="default">Portrayed by: {name}</ThemedText>
              </ThemedView>
            </ThemedView>
          );
        })}
      </ThemedView>
    </ParallaxScrollView>
  );
}

