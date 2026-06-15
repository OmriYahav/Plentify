import {router}from'expo-router';
import {useEffect,useState}from'react';
import {Keyboard,Text,View}from'react-native';
import {z}from'zod';
import {Button,Field,Screen}from'@/components/ui/Primitives';
import {useI18n}from'@/lib/i18n';
import {profileSchema}from'@/lib/validation';
import {useProfile}from'@/hooks/useProfile';

export default function EditProfile(){const{t,isRTL}=useI18n();const{profile,loading,saveProfile}=useProfile();const[name,setName]=useState(''),[city,setCity]=useState(''),[neighborhood,setNeighborhood]=useState(''),[err,setErr]=useState(''),[saving,setSaving]=useState(false);
  useEffect(()=>{if(profile){setName(profile.full_name);setCity(profile.city);setNeighborhood(profile.neighborhood??'')}},[profile]);
  const align={textAlign:isRTL?'right':'left'} as const;
  const onSave=async()=>{setErr('');const input={full_name:name,city,neighborhood};try{profileSchema.parse(input);setSaving(true);Keyboard.dismiss();await saveProfile({...input,avatar_url:profile?.avatar_url});router.back()}catch(e:any){if(e instanceof z.ZodError)setErr(e.issues[0]?.message??'Please check the form fields');else setErr(e.message??'Could not save profile')}finally{setSaving(false)}};
  return <Screen><Text style={{fontSize:28,fontWeight:'900',marginBottom:18,...align}}>{t('editProfile')}</Text><Field placeholder={t('fullName')} value={name} onChangeText={setName} editable={!saving&&!loading}/><Field placeholder={t('city')} value={city} onChangeText={setCity} editable={!saving&&!loading} style={{marginTop:12}}/><Field value={neighborhood} onChangeText={setNeighborhood} placeholder={t('neighborhood')} editable={!saving&&!loading} style={{marginTop:12}}/><View style={{minHeight:28}}>{!!err&&<Text style={{color:'crimson',marginTop:10,...align}}>{err}</Text>}</View><Button title={saving?t('loading'):t('saveChanges')} disabled={saving||loading} onPress={onSave} style={{marginTop:8,opacity:saving||loading?.6:1}}/></Screen>;
}
