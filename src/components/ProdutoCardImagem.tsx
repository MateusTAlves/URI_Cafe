import React, { useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils/theme';
import { Produto } from '../models';

interface Props {
  item: Produto;
  height: number;
  corPadrao?: string;
  iconePadrao?: string;
}

export function ProdutoCardImagem({
  item,
  height,
  corPadrao = Colors.primary,
  iconePadrao = 'restaurant',
}: Props) {
  const [containerWidth, setContainerWidth] = useState(0);
  const windowWidth = Dimensions.get('window').width;
  const [index, setIndex] = useState(0);

  const imagens = item.imagens ?? [];
  const totalSlides = 1 + imagens.length;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!containerWidth) return;
    const x = e.nativeEvent.contentOffset.x;
    const novoIndex = Math.round(x / containerWidth);
    if (novoIndex !== index) setIndex(novoIndex);
  };

  return (
    <View
      style={styles.wrapper}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        nestedScrollEnabled
        directionalLockEnabled
      >
        {/* Slide 1: ícone da categoria, igual já era antes */}
        <View
          style={[
            styles.slide,
            { width: containerWidth || Math.floor(windowWidth * 0.48), height, backgroundColor: item.categoria_cor ?? corPadrao },
          ]}
        >
          <Ionicons name={(item.categoria_icone as any) ?? iconePadrao} size={36} color="#fff" />
        </View>

        {/* Slides seguintes: fotos reais do produto, se existirem */}
        {imagens.map((uri, i) => (
          <Image
            key={i}
            source={{ uri }}
            style={[styles.slide, { width: containerWidth || Math.floor(windowWidth * 0.48), height }]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {totalSlides > 1 && (
        <View style={styles.dots}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    position: 'absolute',
    bottom: 6,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 14,
  },
});