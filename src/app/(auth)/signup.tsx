import {router}from'expo-router';
import {useState}from'react';
import {Text,View}from'react-native';
import {z}from'zod';
import {Button,Field,Screen}from'@/components/ui/Primitives';
import {BackButton}from'@/components/navigation/BackButton';
import {useAuth}from'@/hooks/useAuth';
import {signupSchema}from'@/lib/validation';
import {useI18n}from'@/lib/i18n';
import {isSupabaseConfigured}from'@/lib/supabase';

function safeSignupPayload(input:{email:string;password:string;full_name:string;city:string}){
  return {email:input.email.trim().toLowerCase(),full_name:input.full_name.trim(),city:input.city.trim(),password_length:input.password.length};
}

export default function Signup(){
  const a=useAuth();const{t,isRTL}=useI18n();
  const[email,setEmail]=useState(''),[password,setPassword]=useState(''),[name,setName]=useState(''),[city,setCity]=useState(t('defaultCity')),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
  const submit=async()=>{
    if(busy)return;
    setErr('');
    const input={email,password,full_name:name,city};
    try{
      signupSchema.parse(input);
    }catch(e){
      if(e instanceof z.ZodError){
        const field=e.errors[0]?.path[0];
        if(field==='full_name')setErr(t('fullNameRequired'));
        else if(field==='city')setErr(t('cityRequired'));
        else if(field==='email')setErr(t('invalidEmail'));
        else if(field==='password')setErr(t('passwordSignupRequired'));
        else setErr(t('formValidationError'));
        return;
      }
      setErr(t('formValidationError'));
      return;
    }
    if(!isSupabaseConfigured){
      setErr(t('signupUnavailable'));
      if(__DEV__)console.warn('[signup] signup unavailable because Supabase environment variables are missing');
      return;
    }
    setBusy(true);
    const payload=safeSignupPayload(input);
    if(__DEV__)console.info('[signup] submitting payload',payload);
    try{
      await a.signUp(payload.email,password,{full_name:payload.full_name,city:payload.city});
      if(__DEV__)console.info('[signup] signup completed',{email:payload.email});
      router.replace('/(tabs)/profile');
    }catch(e:any){
      const message=e?.message||String(e);
      if(__DEV__)console.warn('[signup] signup failed',{message,status:e?.status,code:e?.code,name:e?.name});
      setErr(message||t('authError'));
    }finally{setBusy(false)}
  };
  return <Screen><BackButton /><Text style={{fontSize:32,fontWeight:'900',marginVertical:24,textAlign:isRTL?'right':'left'}}>{t('joinPlentify')}</Text><View style={{gap:12}}><Field placeholder={t('fullName')} autoComplete="name" value={name} onChangeText={setName} editable={!busy}/><Field placeholder={t('city')} autoComplete="off" value={city} onChangeText={setCity} editable={!busy}/><Field placeholder={t('email')} keyboardType="email-address" autoComplete="email" autoCapitalize="none" value={email} onChangeText={setEmail} editable={!busy}/><Field placeholder={t('password')} autoComplete="new-password" secureTextEntry value={password} onChangeText={setPassword} editable={!busy}/></View><Text style={{minHeight:22,color:'crimson',textAlign:isRTL?'right':'left',marginTop:10}}>{err}</Text><Button title={busy?t('loading'):t('createProfile')} disabled={busy} onPress={submit}/></Screen>
}
