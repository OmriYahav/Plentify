import React from 'react';import MapView from 'react-native-maps';import {StyleSheet} from 'react-native';import {DEFAULT_COORD} from '@/lib/distance';
export function PlentifyMap({children,center=DEFAULT_COORD}:{children:React.ReactNode;center?:{lat:number;lng:number}}){return <MapView style={StyleSheet.absoluteFill} initialRegion={{latitude:center.lat,longitude:center.lng,latitudeDelta:.04,longitudeDelta:.04}}>{children}</MapView>}
// TODO Phase 2: add MapboxProvider implementing this same surface for custom vector tiles and clustering.
