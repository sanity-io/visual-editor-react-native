import { StyleSheet } from 'react-native';

export const sharedStyles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    elementContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    centeredFlexContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    fullSizeCenteredFlexContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      height: '100%',
    },
    
    list: {
      flexDirection: 'column',
      gap: 10,
    },
    headerImage: {
      width: '100%',
      height: '100%',
      
    },
    image: {
      width: 50,
      height: 50,
    },
    fullWidthImage: {
      width: "100%",
      height: "100%",
    },
    
    link: {
      color: 'green',
      textDecorationLine: 'underline',
      fontSize: 18,
      fontWeight: 'bold',
      alignSelf: 'flex-end',
    },
  });
