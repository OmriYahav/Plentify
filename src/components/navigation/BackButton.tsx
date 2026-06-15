import {router}from'expo-router';
import {ChevronLeft,ChevronRight}from'lucide-react-native';
import React from'react';
import {I18nManager,StyleProp,StyleSheet,Text,TouchableOpacity,TouchableOpacityProps,ViewStyle}from'react-native';
import {theme,shadow}from'@/constants/theme';
import {useI18n}from'@/lib/i18n';
const ICON_SIZE=34;

type BackButtonProps=Omit<TouchableOpacityProps,'onPress'>&{fallbackHref?:string;onPress?:()=>void;containerStyle?:StyleProp<ViewStyle>};

export function BackButton({fallbackHref='/(auth)/welcome',onPress,containerStyle,disabled,style,...props}:BackButtonProps){
  const{t,isRTL}=useI18n();
  const rtl=isRTL||I18nManager.isRTL;
  const Icon=rtl?ChevronLeft:ChevronRight;
  const handlePress=()=>{if(disabled)return;if(onPress){onPress();return}if(router.canGoBack())router.back();else router.replace(fallbackHref as never)};
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('back')} activeOpacity={0.8} disabled={disabled} onPress={handlePress} style={[styles.button,{flexDirection:rtl?'row':'row-reverse'},disabled&&styles.disabled,containerStyle,style]} {...props}>
    <Icon size={ICON_SIZE} color={theme.colors.text} strokeWidth={3}/>
    <Text style={styles.label}>{t('back')}</Text>
  </TouchableOpacity>;
}

export const backButtonMetrics={height:56,width:132,topMargin:theme.space.sm};

const styles=StyleSheet.create({button:{height:backButtonMetrics.height,minWidth:backButtonMetrics.width,alignSelf:'flex-start',alignItems:'center',justifyContent:'center',gap:theme.space.sm,paddingHorizontal:theme.space.md,backgroundColor:theme.colors.card,borderRadius:theme.radius.xl,borderWidth:1,borderColor:'rgba(220,228,219,0.55)',...shadow},label:{color:theme.colors.text,fontSize:24,fontWeight:'800',lineHeight:30},icon:{width:ICON_SIZE,height:ICON_SIZE},disabled:{opacity:.5}});
