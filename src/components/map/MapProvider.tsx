import React from 'react';import MapView,{MapViewProps}from'react-native-maps';import {StyleSheet}from'react-native';
export type MapCoord={lat:number;lng:number};
function deltaFor(radiusKm?:number){return Math.max(.02,Math.min(3,((radiusKm??5)/111)*2.8));}
export const PlentifyMap=React.forwardRef<MapView,{children:React.ReactNode;center?:MapCoord|null;radiusKm?:number}&MapViewProps>(function PlentifyMap({children,center,radiusKm,...props},ref){const fallback=center??{lat:0,lng:0};const delta=deltaFor(radiusKm);return <MapView ref={ref} style={StyleSheet.absoluteFill} initialRegion={{latitude:fallback.lat,longitude:fallback.lng,latitudeDelta:delta,longitudeDelta:delta}} {...props}>{children}</MapView>});
// TODO Phase 2: add MapboxProvider implementing this same surface for custom vector tiles and clustering.
