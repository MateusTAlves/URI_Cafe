// src/screens/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Rect, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const BOX_SIZE = width * 0.42;

export function SplashScreen() {
  const navigation = useNavigation<any>();

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(12)).current;
  const steamOpacity = useRef(new Animated.Value(0)).current;
  const cursorOpacity = useRef(new Animated.Value(1)).current;

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
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslate, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(steamOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timer = setTimeout(() => {
      navigation.replace('HomeCliente');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1b0f08" />

      {/* fundo escuro + brilho radial atrás da logo */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.baseBackground} />
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="glow" cx="50%" cy="34%" r="55%">
              <Stop offset="0%" stopColor="#6b4226" stopOpacity="0.9" />
              <Stop offset="55%" stopColor="#3a2210" stopOpacity="0.5" />
              <Stop offset="100%" stopColor="#1b0f08" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={width} height={height} fill="url(#glow)" />
        </Svg>
      </View>

      <View style={styles.content}>
        {/* vapor */}
        <Animated.View style={[styles.steamWrap, { opacity: steamOpacity }]}>
          <Svg width={60} height={50} viewBox="0 0 60 50">
            <Path
              d="M16 48 C 10 36, 22 30, 16 18 C 11 9, 18 4, 16 0"
              stroke="#c8973a"
              strokeWidth={2}
              strokeLinecap="round"
              fill="none"
              opacity={0.45}
            />
            <Path
              d="M30 48 C 24 34, 36 28, 30 14 C 25 5, 32 2, 30 -2"
              stroke="#c8973a"
              strokeWidth={2.2}
              strokeLinecap="round"
              fill="none"
              opacity={0.6}
            />
            <Path
              d="M44 48 C 38 36, 50 30, 44 18 C 39 9, 46 4, 44 0"
              stroke="#c8973a"
              strokeWidth={2}
              strokeLinecap="round"
              fill="none"
              opacity={0.45}
            />
          </Svg>
        </Animated.View>

        {/* logo */}
        <Animated.View
          style={[
            styles.logoOuter,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <LinearGradient
            colors={['#caa15a', '#7a4d22', '#3c2410']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoFrame}
          >
            <View style={styles.logoInner}>
              <Image
                source={require('../../assets/images/logo_cafe.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* textos */}
        <Animated.View
          style={[
            styles.textBlock,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslate }],
            },
          ]}
        >
          <Text style={styles.eyebrow}>DESDE 2026</Text>
          <Text style={styles.title}>
            <Text style={styles.titleWhite}>URI </Text>
            <Text style={styles.titleAccent}>Café</Text>
          </Text>
          <Text style={styles.subtitle}>SABOR & SABER</Text>
        </Animated.View>
      </View>

      {/* carregando */}
      <View style={styles.loadingWrap}>
        <View style={styles.loadingLine} />
        <View style={styles.loadingRow}>
          <Text style={styles.loadingText}>CARREGANDO</Text>
          <Animated.Text style={[styles.loadingText, { opacity: cursorOpacity }]}>
            _
          </Animated.Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b0f08',
  },
  baseBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1b0f08',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  steamWrap: {
    marginBottom: -6,
  },
  logoOuter: {
    width: BOX_SIZE,
    height: BOX_SIZE,
  },
  logoFrame: {
    flex: 1,
    borderRadius: BOX_SIZE * 0.24,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 14,
  },
  logoInner: {
    flex: 1,
    backgroundColor: '#f6efe3',
    borderRadius: BOX_SIZE * 0.18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  textBlock: {
    alignItems: 'center',
    marginTop: 28,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#c8973a',
    letterSpacing: 3,
    marginBottom: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
  },
  titleWhite: {
    color: '#fdfaf5',
  },
  titleAccent: {
    color: '#c8973a',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fdfaf5',
    letterSpacing: 3,
    marginTop: 6,
    opacity: 0.85,
  },
  loadingWrap: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  loadingLine: {
    width: 56,
    height: 1,
    backgroundColor: '#c8973a',
    opacity: 0.4,
    marginBottom: 14,
  },
  loadingRow: {
    flexDirection: 'row',
  },
  loadingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#c8973a',
    letterSpacing: 3,
  },
});