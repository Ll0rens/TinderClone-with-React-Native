import 'react-native-gesture-handler'
import React, {useEffect, useState}from "react";
import {View, StyleSheet, Text, useWindowDimensions, Image} from "react-native";
import Card from './src/components/TinderCard';
import users from './assets/data/users'
import Animated, { useSharedValue, runOnJS,useAnimatedStyle, withSpring, useAnimatedGestureHandler, useDerivedValue, interpolate} from 'react-native-reanimated';
import {PanGestureHandler, GestureHandlerRootView} from 'react-native-gesture-handler'
import Like from './assets/images/LIKE.png'
import Nope from './assets/images/nope.png'


const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);

  const currentProfile = users[currentIndex];
  const NextProfile = users[nextIndex];

  const SWIPE_VELOCITY = 800;
  const ROTATION = 60;
  const {width: screenWidth} = useWindowDimensions(); //width is the property and screenWidth the name of the variable
  const translateX = useSharedValue(0);
  const hiddenTranslateX = screenWidth * 2;

  const rotate = useDerivedValue(() => interpolate(
    translateX.value,
    [0, hiddenTranslateX],
    [0,ROTATION]) + 'deg'
  );

  const scaleUp = useDerivedValue(() => interpolate(
    translateX.value,
    [-hiddenTranslateX,0,hiddenTranslateX],
    [1, 0.8, 1])
  );

  const opacityUp = useDerivedValue(() => interpolate(
    translateX.value,
    [-hiddenTranslateX,0,hiddenTranslateX],
    [1, 0.2, 1])
  );

  const likeUp = useDerivedValue(() => interpolate(
    translateX.value,
    [0, hiddenTranslateX / 5],
    [0, 1])
  );

  const nopeUp = useDerivedValue(() => interpolate(
    translateX.value,
    [0, -hiddenTranslateX / 5],
    [0, 1])
  );
  
  const cardStyle = useAnimatedStyle(()=>({
    transform: [
      {
        translateX: translateX.value,
      },
      {
        rotate: rotate.value
      }
    ]
  }))

  const nextCardStyle = useAnimatedStyle(() =>({
    transform: [
      {
        scale: scaleUp.value
      }
    ],
    opacity: opacityUp.value
  }))

  const likeStyle = useAnimatedStyle(() =>({
    opacity: likeUp.value
  }))

  const nopeStyle = useAnimatedStyle(() =>({
    opacity: nopeUp.value
  }))

  

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: (event) => {
      if (Math.abs(event.velocityX) < SWIPE_VELOCITY) {
        translateX.value = withSpring(0);
        return;
      }
      translateX.value = withSpring(
        hiddenTranslateX * Math.sign(event.velocityX),
        {},
        () => runOnJS(setCurrentIndex)(currentIndex + 1),
      );


    },
  });

  useEffect(()=> {
    translateX.value = 0;
    setNextIndex(currentIndex + 1);
  }, [currentIndex, translateX]);

  return(
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.pageContainer}>
        {NextProfile && (
          <View style={styles.nextCardContainer}>
            <Animated.View  style={[styles.animatedCard, nextCardStyle]}>
              <Card user={NextProfile}/>
            </Animated.View>
          </View>

        )}
        {currentProfile && (
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View  style={[styles.animatedCard, cardStyle]}>
            <Animated.Image source={Like} style={[styles.like, {left: 10}, likeStyle]} resizeMode='contain'/>
            <Animated.Image source={Nope} style={[styles.like, {right: 10}, nopeStyle]} resizeMode='contain'/>
            <Card user={currentProfile}/>
          </Animated.View>
        </PanGestureHandler>
        )}
      </View>
    </GestureHandlerRootView>

  );
};  

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  animatedCard: {
    width: '90%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',

  },
  nextCardContainer: {
    ...StyleSheet.absoluteFillObject,

    justifyContent: 'center',
    alignItems: 'center',
  },
  like: {
    width: 150,
    height: 150,
    position: 'absolute',
    top: 10,
    zIndex: 1,
    elevation:1,
  }
});

export default App;