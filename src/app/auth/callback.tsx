import {router,useLocalSearchParams}from'expo-router';
import {useEffect,useState}from'react';
import {Text}from'react-native';
import * as Linking from'expo-linking';
import {Screen}from'@/components/ui/Primitives';
import {theme}from'@/constants/theme';
import {useAuth}from'@/hooks/useAuth';
import {useI18n}from'@/lib/i18n';

export default function AuthCallback(){
  const auth=useAuth();const{t,isRTL}=useI18n();const params=useLocalSearchParams();const[error,setError]=useState('');
  useEffect(()=>{let mounted=true;(async()=>{try{const url=Linking.createURL('auth/callback',{queryParams:Object.fromEntries(Object.entries(params).map(([k,v])=>[k,Array.isArray(v)?v[0]:v??'']))});await auth.completeOAuthCallback(url);if(mounted)router.replace('/(tabs)/profile')}catch(e){console.warn('[auth] callback screen failed',{message:e instanceof Error?e.message:String(e)});if(mounted)setError(t('socialAuthError'))}})();return()=>{mounted=false}},[auth,params,t]);
  return <Screen><Text style={{color:error?'crimson':theme.colors.text,textAlign:isRTL?'right':'left',fontSize:18,fontWeight:'700'}}>{error||t('loading')}</Text></Screen>
}
