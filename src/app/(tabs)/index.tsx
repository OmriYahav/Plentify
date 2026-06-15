import {router,useFocusEffect}from'expo-router';
import {useCallback,useState}from'react';
import {FlatList,ScrollView,Text,View}from'react-native';
import {Button,Chip,Field,Screen}from'@/components/ui/Primitives';
import {ListingCard}from'@/components/listings/ListingCard';
import {CATEGORY_KEYS,CATEGORIES}from'@/constants/categories';
import {theme}from'@/constants/theme';
import {useLocation}from'@/hooks/useLocation';
import {useNearbyListings}from'@/hooks/useNearbyListings';
import {Category}from'@/types/models';
import {useI18n}from'@/lib/i18n';

export default function Home(){
  const{coords,area,granted,loading:locationLoading,error:locationError,refresh:refreshLocation}=useLocation();
  const[rad,setRad]=useState(3),[cat,setCat]=useState<Category|null>(null),[q,setQ]=useState('');
  const{data,loading,error,refresh}=useNearbyListings(coords,rad,null,cat,q);
  const{t,isRTL}=useI18n();
  const align={textAlign:isRTL?'right':'left'} as const;
  const hasLocation=!!coords&&granted===true;
  const onRefresh=useCallback(async()=>{await refreshLocation();if(coords)await refresh()},[coords,refresh,refreshLocation]);
  useFocusEffect(useCallback(()=>{void refreshLocation()},[refreshLocation]));

  return <Screen><FlatList
    ListHeaderComponent={<>
      <Text style={{fontSize:30,fontWeight:'900',textAlign:isRTL?'right':'left'}}>{t('goodNearby')}</Text>
      <Text style={{color:theme.colors.muted,marginBottom:14,textAlign:isRTL?'right':'left'}}>{t('currentAreaRadius').replace('{area}',area||t('currentLocationArea')).replace('{radius}',String(rad))}</Text>
      {!hasLocation&&!locationLoading&&<View style={{backgroundColor:'white',borderColor:theme.colors.border,borderWidth:1,borderRadius:18,padding:14,marginBottom:14,gap:10}}><Text style={[{color:theme.colors.text,fontWeight:'800'},align]}>{t('locationUnavailable')}</Text><Text style={[{color:theme.colors.muted},align]}>{locationError??t('locationDenied')}</Text><Button title={t('enableLocation')} onPress={refreshLocation}/></View>}
      <Field placeholder={t('searchPlaceholder')} value={q} onChangeText={setQ}/>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginVertical:12}}>{[1,3,5,10].map(r=><Chip key={r} label={t('distanceKm').replace('{distance}',String(r))} active={rad===r} onPress={()=>setRad(r)}/>)}</ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>{CATEGORY_KEYS.map(k=><Chip key={k} label={t(CATEGORIES[k].labelKey)} active={cat===k} onPress={()=>setCat(cat===k?null:k)}/>)}</ScrollView>
      {(locationLoading||loading)&&<Text style={{margin:20,textAlign:isRTL?'right':'left'}}>{locationLoading?t('findingLocation'):t('loadingNearby')}</Text>}
      {error&&hasLocation&&<Text style={{margin:20,color:'crimson',textAlign:isRTL?'right':'left'}}>{error}</Text>}
    </>}
    data={hasLocation?data:[]}
    refreshing={locationLoading||loading}
    onRefresh={onRefresh}
    keyExtractor={i=>i.id}
    renderItem={({item})=><ListingCard item={item} onPress={()=>router.push(`/listing/${item.id}`)}/>}
    ListEmptyComponent={!locationLoading&&!loading?<View style={{padding:24}}><Text style={{textAlign:isRTL?'right':'left'}}>{hasLocation?t('homeEmpty'):t('locationDenied')}</Text></View>:null}/>
  </Screen>;
}
