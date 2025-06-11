import { PortableTextBlock } from "@portabletext/react-native";

export type Movie = { 
  _id: string;
  _type: string;
  title: string, 
  slug: { current: string }, 
  poster: { asset: { url: string } },
  overview?: [PortableTextBlock] 
  castMembers?: CastMember[];
}

export type Person = {
  _id: string;
  _type: string;
  name: string;
  slug: { current: string };
  image?: { asset: { url: string } };
  bio?: [PortableTextBlock];
} 

export type CastMember = {
  _key: string;
  characterName: string;
  person: { _ref: string };
} 