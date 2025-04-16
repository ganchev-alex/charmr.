import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LocationFilter from "./LocationFilter";

import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../../utility/colors";
import GenderFilter from "./GenderFilter";
import AgeFilter from "./AgeFilter";
import Icon from "react-native-vector-icons/FontAwesome6";
import { useEffect, useRef } from "react";

const { width, height } = Dimensions.get("screen");

const SwipingFilter: React.FC<{ onCloseFilter: () => void }> = function ({
  onCloseFilter,
}) {
  const slideDownAnimationRef = useRef(new Animated.Value(-300)).current;
  const fadeAnimimationRef = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideDownAnimationRef, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
    Animated.timing(fadeAnimimationRef, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleTogglePress = () => {
    Animated.parallel([
      Animated.timing(slideDownAnimationRef, {
        toValue: -300,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimimationRef, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onCloseFilter();
    });
  };

  return (
    <View style={styles.preventer}>
      <Animated.View style={[styles.backdrop, { opacity: fadeAnimimationRef }]}>
        <LinearGradient
          colors={["rgba(30,30,30,0)", `${colors.textPrimary}`]}
          start={[0, 1]}
          end={[0, 0]}
          style={styles.backdrop}
        >
          <Animated.View
            style={[
              styles.modal,
              { transform: [{ translateY: slideDownAnimationRef }] },
            ]}
          >
            <Text style={styles.heading}>Filters</Text>
            <LocationFilter />
            <GenderFilter />
            <AgeFilter />
            <Pressable style={styles.toggle} onPress={handleTogglePress}>
              <Icon
                name="chevron-up"
                size={12.5}
                color={colors.textSecondary}
              />
            </Pressable>
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  preventer: {
    position: "absolute",
    width: width,
    height: height,
    zIndex: 150,
  },
  backdrop: {
    position: "absolute",
    width: "100%",
    height: "80%",
    zIndex: 150,
  },
  modal: {
    alignItems: "center",
    width: "92%",
    marginHorizontal: "4%",
    borderBottomLeftRadius: 17.5,
    borderBottomRightRadius: 17.5,
    backgroundColor: colors.secondaryBackground,
    paddingTop: "2.5%",
    paddingHorizontal: "7%",
  },
  heading: {
    fontFamily: "hn_medium",
    color: colors.textPrimary,
    fontSize: 16.5,
    marginBottom: "10%",
  },
  toggle: {
    marginTop: "3%",
    marginBottom: "5%",
    width: "100%",
    alignItems: "center",
  },
});

export default SwipingFilter;
