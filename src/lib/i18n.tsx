import AsyncStorage from '@react-native-async-storage/async-storage';
import React,{createContext,useContext,useEffect,useMemo,useState}from'react';
import {I18nManager}from'react-native';
import {en}from'@/translations/en';
import {he}from'@/translations/he';

export type Language='en'|'he';
const STORAGE_KEY='plentify.language';
const resources={en,he};
const rtlLanguages:Language[]=['he'];

type Key=keyof typeof en;
type I18nContextValue={language:Language;direction:'ltr'|'rtl';isRTL:boolean;ready:boolean;t:(key:Key)=>string;setLanguage:(language:Language)=>Promise<void>};
const I18nContext=createContext<I18nContextValue|undefined>(undefined);

export function I18nProvider({children}:{children:React.ReactNode}){const[language,setLanguageState]=useState<Language>('en'),[ready,setReady]=useState(false);
  useEffect(()=>{let mounted=true;AsyncStorage.getItem(STORAGE_KEY).then(saved=>{if(mounted&&saved==='he')setLanguageState('he');}).finally(()=>mounted&&setReady(true));return()=>{mounted=false}},[]);
  const setLanguage=async(next:Language)=>{setLanguageState(next);await AsyncStorage.setItem(STORAGE_KEY,next)};
  const value=useMemo<I18nContextValue>(()=>{const isRTL=rtlLanguages.includes(language);I18nManager.allowRTL(isRTL);I18nManager.forceRTL(isRTL);return{language,direction:isRTL?'rtl':'ltr',isRTL,ready,t:key=>resources[language][key]??resources.en[key]??String(key),setLanguage}},[language,ready]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
export function useI18n(){const ctx=useContext(I18nContext);if(!ctx)throw new Error('useI18n must be used within I18nProvider');return ctx;}
export const languages:{code:Language;label:string}[]=[{code:'en',label:'English'},{code:'he',label:'עברית'}];
