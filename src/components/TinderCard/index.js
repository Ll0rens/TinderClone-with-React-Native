import React from "react";
import { Text, ImageBackground, View, StyleSheet} from "react-native";

const Card = (props) => {
    const {name, image, bio} = props.user;
    return(
        <View style={styles.card}>
            <ImageBackground
                source = {{uri: image}}
                style = {styles.image}>
                <View style={styles.cardInner}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.bio}>{bio}</Text>
                </View>
            </ImageBackground>
      </View>
    );
};

const styles = StyleSheet.create({
    card: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      
      elevation: 0,
    },
    cardInner: {
      padding: 10
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      justifyContent: 'flex-end'
    },
    name: {
      fontSize: 30,
      color: 'white',
      fontWeight: 'bold'
    },
    bio: {
      fontSize: 18,
      color: 'white',
      lineHeight: 25,
    }
  });
export default Card;