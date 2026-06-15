import {useCallback,useEffect,useRef,useState}from'react';
import * as Location from 'expo-location';
import {LocationCoords,LocationTranslationKey,requestCurrentLocation}from'@/lib/location';
import {useI18n}from'@/lib/i18n';

type Area=string|null;

function formatArea(place:Location.LocationGeocodedAddress|null|undefined){
  if(!place)return null;
  return place.district||place.subregion||place.city||place.region||place.name||null;
}

export function useLocation(){
  const{t}=useI18n();
  const[coords,setCoords]=useState<LocationCoords|null>(null);
  const[area,setArea]=useState<Area>(null);
  const[granted,setGranted]=useState<boolean|null>(null);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState<string|null>(null);
  const watchRef=useRef<Location.LocationSubscription|null>(null);

  const stopWatching=useCallback(()=>{watchRef.current?.remove();watchRef.current=null},[]);

  const updateArea=useCallback(async(next:LocationCoords|null)=>{
    if(!next){setArea(null);return}
    try{
      const[place]=await Location.reverseGeocodeAsync({latitude:next.lat,longitude:next.lng});
      setArea(formatArea(place));
    }catch{setArea(null)}
  },[]);

  const applyCoords=useCallback((next:LocationCoords|null)=>{setCoords(next);void updateArea(next)},[updateArea]);

  const startWatching=useCallback(async()=>{
    stopWatching();
    watchRef.current=await Location.watchPositionAsync(
      {accuracy:Location.Accuracy.Balanced,distanceInterval:250,timeInterval:30000},
      p=>applyCoords({lat:p.coords.latitude,lng:p.coords.longitude})
    );
  },[applyCoords,stopWatching]);

  const refresh=useCallback(async()=>{
    setLoading(true);setError(null);
    try{
      const r=await requestCurrentLocation();
      applyCoords(r.coords);setGranted(r.granted);setError(r.errorKey?t(r.errorKey as LocationTranslationKey):null);
      if(r.granted)await startWatching();else stopWatching();
    }catch{
      applyCoords(null);setGranted(false);setError(t('locationCurrentFailed'));stopWatching();
    }finally{setLoading(false)}
  },[applyCoords,startWatching,stopWatching,t]);

  useEffect(()=>{refresh();return stopWatching},[refresh,stopWatching]);
  return{coords,area,granted,loading,error,refresh};
}
