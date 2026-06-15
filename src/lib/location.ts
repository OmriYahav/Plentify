import * as Location from 'expo-location';
import {en}from'@/translations/en';
export type LocationCoords={lat:number;lng:number};
export type LocationErrorKey='locationServicesOff'|'locationAccessPrompt'|'locationPermissionDisabled';
export type CurrentLocationResult={coords:LocationCoords|null;granted:boolean;errorKey?:LocationErrorKey};
export async function requestCurrentLocation():Promise<CurrentLocationResult>{const services=await Location.hasServicesEnabledAsync();if(!services)return{coords:null,granted:false,errorKey:'locationServicesOff'};const {status,canAskAgain}=await Location.requestForegroundPermissionsAsync();if(status!=='granted')return{coords:null,granted:false,errorKey:canAskAgain?'locationAccessPrompt':'locationPermissionDisabled'};const p=await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});return{coords:{lat:p.coords.latitude,lng:p.coords.longitude},granted:true};}
export type LocationTranslationKey=keyof typeof en;
