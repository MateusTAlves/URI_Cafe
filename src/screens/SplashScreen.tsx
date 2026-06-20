// src/screens/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts, Spacing } from '../utils/theme';

export function SplashScreen() {
  const navigation = useNavigation<any>();

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(16)).current;
  const accentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(textY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(accentOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('HomeCliente');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <Animated.View
        style={[
          styles.logoBox,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Image
          source={require('../../assets/images/logo_cafe.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: textY }] }}>
        <Text style={styles.appName}>URICafe</Text>
      </Animated.View>

      <Animated.View style={[styles.taglineRow, { opacity: accentOpacity }]}>
        <View style={styles.line} />
        <Text style={styles.tagline}>Peça agora, retire na lancheria</Text>
        <View style={styles.line} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  logoBox: {
    width: 140,
    height: 140,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(200, 151, 58, 0.3)',
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: Fonts.sizes.xxxl,
    color: Colors.accent,
    fontWeight: '800',
    letterSpacing: 2,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(200, 151, 58, 0.4)',
  },
  tagline: {
    fontSize: Fonts.sizes.sm,
    color: Colors.background,
    opacity: 0.7,
    letterSpacing: 0.4,
    textAlign: 'center',
  },
});