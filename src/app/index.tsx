import {Redirect}from'expo-router';import {useAuth}from'@/hooks/useAuth';
export default function Index(){const{session,loading,demo}=useAuth();if(loading)return null;return <Redirect href={!demo&&session?'/(tabs)/profile':'/(auth)/welcome'}/>}
