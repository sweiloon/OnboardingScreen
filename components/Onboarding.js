import { StyleSheet, Text, View, FlatList, Animated } from 'react-native'
import React, { useState, useRef } from 'react'

import OnboardingItems from '../components/OnboardingItem'
import slides from '../slides'
import Paginator from '../components/Paginator'
import NextButton from '../components/NextButton'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Onboarding() {
    const scrollX = useRef(new Animated.Value(0)).current;
    const [currentIndex, setCurrentIndex] = useState(0);
    const viewableItemChanged = useRef(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;
    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
    const slidesRef = useRef(null);

    const scrollTo = async () => {
        if (currentIndex < slides.length - 1) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            try {
                await AsyncStorage.setItem('@viewedOnboarding', 'true');

            } catch (err) {
                console.log('Error @setItem: ', err);
            }
        }
    }



    return (
        <View style={styles.container}>
            <View style={{ flex: 3 }}>
                <FlatList
                    data={slides}
                    renderItem={({ item }) => <OnboardingItems item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,

                    })}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />
            </View>

            <Paginator data={slides} scrollX={scrollX} />
            <NextButton scrollTo={scrollTo} percentage={(currentIndex + 1) * (100 / slides.length)} />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',


    }

})