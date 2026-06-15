import 'react-native-gesture-handler';
import {Stack}from'expo-router';
import {StatusBar}from'expo-status-bar';
import {SafeAreaProvider}from'react-native-safe-area-context';
import {BackButton}from'@/components/BackButton';
import {AuthProvider}from'@/hooks/useAuth';
import {ProfileProvider}from'@/hooks/useProfile';
import {I18nProvider,useI18n}from'@/lib/i18n';
import {theme}from'@/constants/theme';

function AppStack(){
  const{t,isRTL}=useI18n();
  const headerBack=()=> <BackButton fallbackHref="/(tabs)/profile" placement="header"/>;
  const inner={
    headerShown:true,
    headerBackVisible:false,
    headerLeft:isRTL?undefined:headerBack,
    headerRight:isRTL?headerBack:undefined,
    headerTitleAlign:'center' as const,
    headerStyle:{backgroundColor:theme.colors.bg},
    headerShadowVisible:false
  };
  return <><StatusBar style="dark"/><Stack screenOptions={{headerShown:false}}><Stack.Screen name="(auth)"/><Stack.Screen name="(tabs)"/><Stack.Screen name="listing/[id]" options={{...inner,title:t('listing')}}/><Stack.Screen name="chat/[id]" options={{...inner,title:t('chat')}}/><Stack.Screen name="edit-profile" options={{...inner,title:t('editProfile')}}/><Stack.Screen name="settings" options={{...inner,title:t('settings')}}/><Stack.Screen name="impact" options={{...inner,title:t('impact')}}/></Stack></>
}
export default function Root(){return <SafeAreaProvider><I18nProvider><AuthProvider><ProfileProvider><AppStack/></ProfileProvider></AuthProvider></I18nProvider></SafeAreaProvider>}
