import {router,useFocusEffect}from'expo-router';
import {useCallback,useMemo,useState}from'react';
import {FlatList,ScrollView,Text,View}from'react-native';
import {Button,Chip,Field,Screen}from'@/components/ui/Primitives';
import {ListingCard}from'@/components/listings/ListingCard';
import {CATEGORY_KEYS,CATEGORIES}from'@/constants/categories';
import {LISTING_TYPES}from'@/constants/listingTypes';
import {demoCommunityCircles}from'@/services/demoData';
import {theme}from'@/constants/theme';
import {useLocation}from'@/hooks/useLocation';
import {useNearbyListings}from'@/hooks/useNearbyListings';
import {Category,ListingType}from'@/types/models';
import {useI18n}from'@/lib/i18n';

export default function Home(){
  const{coords,area,granted,loading:locationLoading,error:locationError,refresh:refreshLocation}=useLocation();
  const[rad,setRad]=useState(2),[cat,setCat]=useState<Category|null>(null),[type,setType]=useState<ListingType|null>(null),[q,setQ]=useState(''),[sort,setSort]=useState<'nearest'|'newest'>('nearest'),[circle,setCircle]=useState<string|null>(null);
  const{data,loading,error,refresh}=useNearbyListings(coords,rad,{enabled:!!coords,communityCircle:circle},cat,q);
  const{t,isRTL}=useI18n();const align={textAlign:isRTL?'right':'left'} as const;const hasLocation=!!coords;
  const feed=useMemo(()=>data.filter(i=>!type||i.type===type).sort((a,b)=>sort==='newest'?new Date(b.created_at).getTime()-new Date(a.created_at).getTime():(a.distance_km||0)-(b.distance_km||0)),[data,type,sort]);
  const onRefresh=useCallback(async()=>{await refreshLocation();if(coords)await refresh()},[coords,refresh,refreshLocation]);
  useFocusEffect(useCallback(()=>{void refreshLocation()},[refreshLocation]));
  return <Screen><FlatList ListHeaderComponent={<>
    <Text style={{fontSize:30,fontWeight:'900',textAlign:isRTL?'right':'left'}}>{t('nearbyFeed')}</Text>
    <Text style={{color:theme.colors.muted,marginBottom:14,textAlign:isRTL?'right':'left'}}>{t('currentAreaRadius').replace('{area}',area||t('currentLocationArea')).replace('{radius}',String(rad))}</Text>
    {granted===false&&!locationLoading&&<View style={{backgroundColor:'white',borderColor:theme.colors.border,borderWidth:1,borderRadius:18,padding:14,marginBottom:14,gap:10}}><Text style={[{color:theme.colors.text,fontWeight:'800'},align]}>{t('usingFallbackLocation')}</Text><Text style={[{color:theme.colors.muted},align]}>{locationError??t('locationDenied')}</Text><Button title={t('enableLocation')} onPress={refreshLocation}/></View>}
    <Field placeholder={t('searchPlaceholder')} value={q} onChangeText={setQ}/>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginVertical:12}}>{[2,5,10,25,100].map(r=><Chip key={r} label={t('distanceKm').replace('{distance}',String(r))} active={rad===r} onPress={()=>setRad(r)}/>)}</ScrollView>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:12}}><Chip label={t('nearestFirst')} active={sort==='nearest'} onPress={()=>setSort('nearest')}/><Chip label={t('newestFirst')} active={sort==='newest'} onPress={()=>setSort('newest')}/></ScrollView>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:12}}>{Object.keys(LISTING_TYPES).map(k=><Chip key={k} label={t(LISTING_TYPES[k as ListingType].shortKey)} active={type===k} onPress={()=>setType(type===k?null:k as ListingType)}/>)}</ScrollView>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:12}}>{CATEGORY_KEYS.map(k=><Chip key={k} label={t(CATEGORIES[k].labelKey)} active={cat===k} onPress={()=>setCat(cat===k?null:k)}/>)}</ScrollView>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>{demoCommunityCircles.map(c=><Chip key={c} label={c} active={circle===c} onPress={()=>setCircle(circle===c?null:c)}/>)}</ScrollView>
    {(locationLoading||loading)&&<Text style={{margin:20,textAlign:isRTL?'right':'left'}}>{locationLoading?t('findingLocation'):t('loadingNearby')}</Text>}{error&&hasLocation&&<Text style={{margin:20,color:'crimson',textAlign:isRTL?'right':'left'}}>{error}</Text>}
  </>} data={hasLocation?feed:[]} refreshing={locationLoading||loading} onRefresh={onRefresh} keyExtractor={i=>i.id} renderItem={({item})=><ListingCard item={item} onPress={()=>router.push(`/listing/${item.id}`)}/>} ListEmptyComponent={!locationLoading&&!loading?<View style={{padding:24,gap:10}}><Text style={[{fontWeight:'800'},align]}>{t('noPostsNearby')}</Text><Text style={align}>{t('tryIncreasingRadius')}</Text><Button title={t('beFirstToPost')} onPress={()=>router.push('/create')}/></View>:null}/></Screen>;
}
