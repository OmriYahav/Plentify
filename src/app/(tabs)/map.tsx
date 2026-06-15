import {router}from'expo-router';
import {useEffect,useMemo,useRef,useState}from'react';
import {ActivityIndicator,Modal,PanResponder,Pressable,StyleSheet,Text,TouchableOpacity,View}from'react-native';
import MapView,{Circle,Marker}from'react-native-maps';
import {Button,Chip}from'@/components/ui/Primitives';
import {PlentifyMap}from'@/components/map/MapProvider';
import {PlentifyMarker}from'@/components/map/MapMarker';
import {MapPreviewCard}from'@/components/map/MapPreviewCard';
import {theme,shadow}from'@/constants/theme';
import {distanceKm}from'@/lib/distance';
import {useLocation}from'@/hooks/useLocation';
import {useNearbyListings}from'@/hooks/useNearbyListings';
import {Listing}from'@/types/models';
import {useI18n}from'@/lib/i18n';

const MIN_RADIUS=1;
const MAX_RADIUS=100;
const SLIDER_WIDTH=280;

export default function MapScreen(){
  const mapRef=useRef<MapView>(null);
  const {t,isRTL}=useI18n();
  const {coords,granted,loading:locationLoading,error:locationError,refresh}=useLocation();
  const [sel,setSel]=useState<Listing|null>(null);
  const [radiusKm,setRadiusKm]=useState(5);
  const [draftRadius,setDraftRadius]=useState(radiusKm);
  const [radiusOpen,setRadiusOpen]=useState(false);
  const [mapMoved,setMapMoved]=useState(false);
  const {data,loading:itemsLoading,error:itemsError}=useNearbyListings(coords,radiusKm,{enabled:!!coords});

  useEffect(()=>{if(coords){mapRef.current?.animateToRegion(regionFor(coords,radiusKm),700);setMapMoved(false)}},[coords?.lat,coords?.lng]);

  const visibleListings=useMemo(()=>coords?data.filter(l=>distanceKm(coords,{lat:l.lat,lng:l.lng})<=radiusKm):[],[coords,data,radiusKm]);
  const applyRadius=()=>{setRadiusKm(draftRadius);setRadiusOpen(false);if(coords)mapRef.current?.animateToRegion(regionFor(coords,draftRadius),500)};
  const openRadius=()=>{setDraftRadius(radiusKm);setRadiusOpen(true)};
  const centerOnMe=()=>{if(coords){mapRef.current?.animateToRegion(regionFor(coords,radiusKm),500);setMapMoved(false)}else refresh()};

  return <View style={styles.container}>
    <PlentifyMap ref={mapRef} center={coords} radiusKm={radiusKm} onPanDrag={()=>setMapMoved(true)} showsUserLocation={granted===true}>
      {coords&&<>
        <Circle center={{latitude:coords.lat,longitude:coords.lng}} radius={radiusKm*1000} fillColor="rgba(31,94,59,.08)" strokeColor="rgba(31,94,59,.24)" strokeWidth={2}/>
        <Marker coordinate={{latitude:coords.lat,longitude:coords.lng}} anchor={{x:.5,y:.5}} title={t('youAreHere')}>
          <View style={styles.userMarker}><View style={styles.userMarkerDot}/></View>
        </Marker>
      </>}
      {visibleListings.map(l=><PlentifyMarker key={l.id} listing={l} onPress={()=>setSel(l)}/>) }
    </PlentifyMap>

    <View style={styles.topBar}><Chip label={t('distanceKm').replace('{distance}',String(radiusKm))} active onPress={openRadius}/></View>
    <TouchableOpacity style={[styles.centerButton,mapMoved&&styles.centerButtonActive]} onPress={centerOnMe} activeOpacity={.85}><Text style={styles.centerButtonText}>⌖</Text></TouchableOpacity>

    {(locationLoading||itemsLoading)&&<StatusCard><ActivityIndicator color={theme.colors.primary}/><Text style={styles.statusText}>{locationLoading?t('findingLocation'):t('loadingNearbyItems')}</Text></StatusCard>}
    {!locationLoading&&(granted===false||locationError)&&<StatusCard><Text style={styles.statusTitle}>{t('locationUnavailable')}</Text><Text style={styles.statusText}>{locationError??t('locationPermissionNeeded')}</Text><Button title={t('tryAgain')} onPress={refresh}/></StatusCard>}
    {itemsError&&!itemsLoading&&<StatusCard><Text style={styles.statusTitle}>{t('couldNotLoadMapItems')}</Text><Text style={styles.statusText}>{itemsError}</Text></StatusCard>}

    <RadiusSheet t={t} isRTL={isRTL} visible={radiusOpen} value={draftRadius} onChange={setDraftRadius} onApply={applyRadius} onClose={()=>setRadiusOpen(false)}/>
    {sel&&<MapPreviewCard listing={sel} onView={()=>router.push(`/listing/${sel.id}`)}/>} 
  </View>;
}

function StatusCard({children}:{children:React.ReactNode}){return <View style={styles.statusCard}>{children}</View>}
function regionFor(coords:{lat:number;lng:number},radiusKm:number){const delta=Math.max(.02,Math.min(3,(radiusKm/111)*2.8));return{latitude:coords.lat,longitude:coords.lng,latitudeDelta:delta,longitudeDelta:delta};}

function RadiusSheet({visible,value,onChange,onApply,onClose,t,isRTL}:{visible:boolean;value:number;onChange:(v:number)=>void;onApply:()=>void;onClose:()=>void;t:(key:any)=>string;isRTL:boolean}){
  const update=(x:number)=>onChange(Math.max(MIN_RADIUS,Math.min(MAX_RADIUS,Math.round(MIN_RADIUS+(x/SLIDER_WIDTH)*(MAX_RADIUS-MIN_RADIUS)))));
  const pan=useMemo(()=>PanResponder.create({onStartShouldSetPanResponder:()=>true,onMoveShouldSetPanResponder:()=>true,onPanResponderGrant:e=>update(e.nativeEvent.locationX),onPanResponderMove:e=>update(e.nativeEvent.locationX)}),[]);
  const pct=(value-MIN_RADIUS)/(MAX_RADIUS-MIN_RADIUS);
  return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <Pressable style={styles.backdrop} onPress={onClose}/>
    <View style={styles.sheet}>
      <View style={styles.handle}/><View style={styles.sheetHeader}><Text style={styles.sheetTitle}>{t('chooseRadius')}</Text><TouchableOpacity onPress={onClose}><Text style={styles.cancelText}>{t('cancel')}</Text></TouchableOpacity></View>
      <Text style={styles.radiusValue}>{t('distanceKm').replace('{distance}',String(value))}</Text>
      <View style={styles.sliderLabels}><Text style={styles.label}>{t('distanceKm').replace('{distance}','1')}</Text><Text style={styles.label}>{t('distanceKm').replace('{distance}','100')}</Text></View>
      <View style={styles.slider} {...pan.panHandlers}><View style={[styles.sliderFill,{width:`${pct*100}%`}]}/><View style={[styles.thumb,{left:pct*SLIDER_WIDTH-12}]}/></View>
      <Button title={t('applyRadius')} onPress={onApply}/>
    </View>
  </Modal>;
}

const styles=StyleSheet.create({container:{flex:1},topBar:{position:'absolute',top:56,left:16},centerButton:{position:'absolute',right:16,top:56,width:46,height:46,borderRadius:23,backgroundColor:'white',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:theme.colors.border,...shadow},centerButtonActive:{backgroundColor:theme.colors.secondary},centerButtonText:{fontSize:28,color:theme.colors.primary,fontWeight:'700'},userMarker:{width:28,height:28,borderRadius:14,backgroundColor:'rgba(31,94,59,.18)',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'white'},userMarkerDot:{width:14,height:14,borderRadius:7,backgroundColor:theme.colors.primary,borderWidth:2,borderColor:'white'},statusCard:{position:'absolute',top:112,left:16,right:16,backgroundColor:'white',borderRadius:theme.radius.lg,padding:16,gap:10,borderWidth:1,borderColor:theme.colors.border,...shadow},statusTitle:{fontSize:16,fontWeight:'800',color:theme.colors.text},statusText:{color:theme.colors.muted,fontWeight:'600'},backdrop:{flex:1,backgroundColor:'rgba(0,0,0,.28)'},sheet:{position:'absolute',left:0,right:0,bottom:0,backgroundColor:theme.colors.card,borderTopLeftRadius:28,borderTopRightRadius:28,padding:24,gap:18},handle:{alignSelf:'center',width:46,height:5,borderRadius:999,backgroundColor:theme.colors.border},sheetHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},sheetTitle:{fontSize:22,fontWeight:'800',color:theme.colors.text},cancelText:{color:theme.colors.primary,fontWeight:'700'},radiusValue:{fontSize:36,fontWeight:'900',color:theme.colors.primary,textAlign:'center'},sliderLabels:{flexDirection:'row',justifyContent:'space-between'},label:{color:theme.colors.muted,fontWeight:'600'},slider:{width:SLIDER_WIDTH,height:36,alignSelf:'center',justifyContent:'center'},sliderFill:{position:'absolute',height:8,borderRadius:999,backgroundColor:theme.colors.primary},thumb:{position:'absolute',width:24,height:24,borderRadius:12,backgroundColor:'white',borderWidth:3,borderColor:theme.colors.primary,...shadow}});
