import {Redirect,Stack}from'expo-router';
import {useAuth}from'@/hooks/useAuth';
export default function AuthLayout(){const{session,loading,demo}=useAuth();if(!loading&&!demo&&session)return <Redirect href="/(tabs)/profile"/>;return <Stack screenOptions={{headerShown:false}}/>}
