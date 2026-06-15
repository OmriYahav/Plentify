import {router}from'expo-router';
import {useEffect,useState}from'react';
import {Platform,Text,TouchableOpacity,View}from'react-native';
import {Button,Field,Screen}from'@/components/ui/Primitives';
import {BackButton}from'@/components/BackButton';
import {theme}from'@/constants/theme';
import {useAuth}from'@/hooks/useAuth';
import {useI18n}from'@/lib/i18n';

type Social='apple'|'google';
const emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function authMessage(message:string,t:(key:any)=>string){
  const m=message.toLowerCase();
  if(m.includes('invalid login')||m.includes('invalid credentials'))return t('invalidCredentials');
  if(m.includes('email not confirmed'))return t('emailNotConfirmed');
  if(m.includes('network')||m.includes('fetch')||m.includes('offline'))return t('networkAuthError');
  if(m.includes('missing_oauth')||m.includes('authorization_url')||m.includes('provider')||m.includes('oauth'))return t('socialAuthError');
  if(m.includes('supabase is not configured'))return t('authConfigMissing');
  return t('authError');
}

export default function Login(){
  const[email,setEmail]=useState(''),[password,setPassword]=useState(''),[err,setErr]=useState(''),[info,setInfo]=useState(''),[showPassword,setShowPassword]=useState(false),[loadingSocial,setLoadingSocial]=useState<Social|null>(null),[loadingEmail,setLoadingEmail]=useState(false),[loadingReset,setLoadingReset]=useState(false);
  const a=useAuth();const{t,isRTL}=useI18n();
  const busy=a.loading||loadingEmail||loadingReset||!!loadingSocial;
  useEffect(()=>{if(!a.loading&&!a.demo&&a.session)router.replace('/(tabs)/profile')},[a.loading,a.demo,a.session]);
  const validateEmail=()=>{if(!emailRe.test(email.trim())){setErr(t('invalidEmail'));return false}return true};
  const social=async(provider:Social)=>{if(busy)return;setErr('');setInfo('');setLoadingSocial(provider);try{const result=await a.signInWithProvider(provider);if(result==='cancelled'){setInfo(t('socialAuthCancelled'));return}router.replace('/(tabs)/profile')}catch(e:any){setErr(authMessage(e?.message||'',t))}finally{setLoadingSocial(null)}};
  const emailLogin=async()=>{if(busy)return;setErr('');setInfo('');if(!validateEmail())return;if(!password.trim()){setErr(t('passwordRequired'));return}setLoadingEmail(true);try{await a.signIn(email,password);router.replace('/(tabs)/profile')}catch(e:any){setErr(authMessage(e?.message||'',t))}finally{setLoadingEmail(false)}};
  const forgot=async()=>{if(busy)return;setErr('');setInfo('');if(!validateEmail())return;setLoadingReset(true);try{await a.resetPassword(email);setInfo(t('resetPasswordSent'))}catch(e:any){setErr(authMessage(e?.message||'',t))}finally{setLoadingReset(false)}};
  return <Screen>
    <BackButton disabled={busy} />
    <Text style={{fontSize:32,fontWeight:'900',marginTop:16,marginBottom:24,textAlign:isRTL?'right':'left'}}>{t('welcomeBack')}</Text>
    <View style={{gap:12}}>
      {Platform.OS==='ios'&&<Button accessibilityLabel={t('continueWithApple')} title={loadingSocial==='apple'?t('loading'):t('continueWithApple')} variant="ghost" disabled={busy} onPress={()=>social('apple')} style={{backgroundColor:'#111'}} textStyle={{color:'white'}}/>}
      <Button accessibilityLabel={t('continueWithGoogle')} title={loadingSocial==='google'?t('loading'):t('continueWithGoogle')} variant="ghost" disabled={busy} onPress={()=>social('google')} style={{backgroundColor:'white',borderWidth:1,borderColor:theme.colors.border}} textStyle={{color:theme.colors.text}}/>
    </View>
    <View style={{alignItems:'center',marginVertical:18}}><Text style={{color:theme.colors.muted,fontWeight:'600'}}>{t('orContinueWith')}</Text></View>
    <Field placeholder={t('email')} keyboardType="email-address" autoComplete="email" textContentType="emailAddress" autoCapitalize="none" autoCorrect={false} value={email} onChangeText={setEmail} editable={!busy}/>
    <View style={{marginTop:12}}><Field placeholder={t('password')} autoComplete="password" textContentType="password" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} editable={!busy} onSubmitEditing={emailLogin} style={{paddingLeft:isRTL?64:14,paddingRight:isRTL?14:64}}/><TouchableOpacity accessibilityRole="button" accessibilityLabel={showPassword?t('hidePassword'):t('showPassword')} disabled={busy} onPress={()=>setShowPassword(v=>!v)} style={{position:'absolute',top:0,bottom:0,justifyContent:'center',left:isRTL?14:undefined,right:isRTL?undefined:14}}><Text style={{color:theme.colors.primary,fontWeight:'700'}}>{showPassword?t('hidePassword'):t('showPassword')}</Text></TouchableOpacity></View>
    <TouchableOpacity accessibilityRole="button" disabled={busy} onPress={forgot} style={{marginTop:10,alignSelf:isRTL?'flex-end':'flex-start',opacity:busy?0.5:1}}><Text style={{color:theme.colors.primary,fontWeight:'700'}}>{loadingReset?t('loading'):t('forgotPassword')}</Text></TouchableOpacity>
    <Text accessibilityLiveRegion="polite" style={{minHeight:22,color:err?'crimson':theme.colors.primary,textAlign:isRTL?'right':'left',marginTop:8}}>{err||info}</Text>
    <Button title={loadingEmail?t('loading'):t('login')} disabled={busy} onPress={emailLogin}/>
    <View style={{height:1,backgroundColor:theme.colors.border,marginVertical:16}}/>
    <Button title={t('createAccount')} variant="ghost" disabled={busy} onPress={()=>router.push('/(auth)/signup')}/>
  </Screen>
}
