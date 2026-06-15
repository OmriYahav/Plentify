import {router}from'expo-router';
import {ChevronLeft,ChevronRight}from'lucide-react-native';
import React from'react';
import {I18nManager,StyleProp,StyleSheet,Text,TouchableOpacity,TouchableOpacityProps,ViewStyle}from'react-native';
import {theme,shadow}from'@/constants/theme';
import {useI18n}from'@/lib/i18n';

const ICON_SIZE=20;

type BackButtonProps=Omit<TouchableOpacityProps,'onPress'>&{fallbackHref?:string;onPress?:()=>void;placement?:'content'|'header';containerStyle?:StyleProp<ViewStyle>};

export function BackButton({fallbackHref='/(auth)/welcome',onPress,placement='content',containerStyle,disabled,style,...props}:BackButtonProps){
  const{t,isRTL}=useI18n();
  const rtl=isRTL||I18nManager.isRTL;
  const Icon=rtl?ChevronRight:ChevronLeft;
  const handlePress=()=>{if(disabled)return;if(onPress){onPress();return}if(router.canGoBack())router.back();else router.replace(fallbackHref as never)};
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={t('back')} activeOpacity={0.82} disabled={disabled} onPress={handlePress} style={[styles.button,rtl&&styles.rtl,placement==='header'&&styles.header,disabled&&styles.disabled,containerStyle,style]} {...props}>
    <Icon size={ICON_SIZE} color={theme.colors.text} strokeWidth={2.7}/>
    <Text style={styles.label}>{t('back')}</Text>
  </TouchableOpacity>;
}

export const backButtonMetrics={height:44,minWidth:96,headerHorizontalMargin:12};

const styles=StyleSheet.create({button:{height:backButtonMetrics.height,minWidth:backButtonMetrics.minWidth,alignSelf:'flex-start',alignItems:'center',justifyContent:'center',flexDirection:'row',gap:8,paddingHorizontal:16,backgroundColor:theme.colors.card,borderRadius:999,borderWidth:1,borderColor:'rgba(220,228,219,0.72)',...shadow},rtl:{alignSelf:'flex-end',flexDirection:'row-reverse'},header:{marginHorizontal:backButtonMetrics.headerHorizontalMargin,alignSelf:'center'},label:{color:theme.colors.text,fontSize:16,fontWeight:'800',lineHeight:20},disabled:{opacity:.5}});
