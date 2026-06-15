import React,{useCallback}from'react';
import {Keyboard,KeyboardAvoidingView,Platform,Pressable,StyleSheet,Text,TextInput,TouchableOpacity,TouchableOpacityProps,View} from 'react-native';
import {SafeAreaView}from'react-native-safe-area-context';
import {useFocusEffect}from'expo-router';
import {theme,shadow} from '@/constants/theme';
import {useI18n}from'@/lib/i18n';

export function Screen({children}:{children:React.ReactNode}){
  const{direction,isRTL}=useI18n();
  useFocusEffect(useCallback(()=>()=>Keyboard.dismiss(),[]));
  return <SafeAreaView edges={['top','left','right']} style={[s.safe,{direction},isRTL&&s.rtl]}><KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':undefined} style={s.flex}><Pressable style={[s.screen,{direction},isRTL&&s.rtl]} onPress={Keyboard.dismiss}>{children}</Pressable></KeyboardAvoidingView></SafeAreaView>
}
export function Card({children}:{children:React.ReactNode}){const{direction}=useI18n();return <View style={[s.card,{direction}]}>{children}</View>}
export function Button({title,variant='primary',onPress,style,...p}:TouchableOpacityProps&{title:string;variant?:'primary'|'ghost'}){return <TouchableOpacity {...p} style={[s.btn,variant==='ghost'&&s.ghost,style]} onPress={e=>{Keyboard.dismiss();onPress?.(e)}}><Text style={[s.btnText,variant==='ghost'&&{color:theme.colors.primary}]}>{title}</Text></TouchableOpacity>}
export function Field({style,onSubmitEditing,returnKeyType,blurOnSubmit,multiline,...props}:React.ComponentProps<typeof TextInput>){const{isRTL}=useI18n();return <TextInput {...props} multiline={multiline} placeholderTextColor={theme.colors.muted} textAlign={isRTL?'right':'left'} returnKeyType={returnKeyType??'done'} blurOnSubmit={blurOnSubmit??!multiline} onSubmitEditing={e=>{onSubmitEditing?.(e);if(!multiline)Keyboard.dismiss()}} style={[s.input,isRTL&&s.rtlInput,style]}/>}
export function Chip({label,active,onPress}:{label:string;active?:boolean;onPress?:()=>void}){return <TouchableOpacity onPress={()=>{Keyboard.dismiss();onPress?.()}} style={[s.chip,active&&s.chipActive]}><Text style={[s.chipText,active&&{color:'white'}]}>{label}</Text></TouchableOpacity>}
export function Logo(){return <View style={s.logo}><Text style={{fontSize:30,color:theme.colors.primary}}>⌒</Text></View>}
const s=StyleSheet.create({flex:{flex:1},safe:{flex:1,backgroundColor:theme.colors.bg},screen:{flex:1,backgroundColor:theme.colors.bg,padding:20},rtl:{alignItems:'stretch'},card:{backgroundColor:theme.colors.card,borderRadius:theme.radius.lg,padding:18,borderWidth:1,borderColor:theme.colors.border,...shadow},btn:{backgroundColor:theme.colors.primary,padding:16,borderRadius:theme.radius.lg,alignItems:'center'},ghost:{backgroundColor:theme.colors.secondary},btnText:{color:'white',fontWeight:'700',fontSize:16},input:{backgroundColor:'white',borderWidth:1,borderColor:theme.colors.border,borderRadius:theme.radius.md,padding:14,fontSize:16,color:theme.colors.text},rtlInput:{writingDirection:'rtl'},chip:{paddingHorizontal:14,paddingVertical:9,borderRadius:999,backgroundColor:'white',borderWidth:1,borderColor:theme.colors.border,marginRight:8,marginBottom:8},chipActive:{backgroundColor:theme.colors.primary,borderColor:theme.colors.primary},chipText:{color:theme.colors.text,fontWeight:'600'},logo:{width:64,height:64,borderRadius:32,backgroundColor:theme.colors.secondary,alignItems:'center',justifyContent:'center'}});
