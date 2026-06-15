import React,{createContext,useCallback,useContext,useEffect,useMemo,useState}from'react';
import {Session,User}from'@supabase/supabase-js';
import * as Linking from'expo-linking';
import * as WebBrowser from'expo-web-browser';
import {isSupabaseConfigured,supabase}from'@/lib/supabase';
import {demoProfile}from'@/services/demoData';

type SocialProvider='apple'|'google';
type Auth={session:Session|null;userId:string;loading:boolean;demo:boolean;signIn:(e:string,p:string)=>Promise<void>;signUp:(e:string,p:string)=>Promise<void>;signInWithProvider:(provider:SocialProvider)=>Promise<'success'|'cancelled'>;resetPassword:(email:string)=>Promise<void>;signOut:()=>Promise<void>};
const C=createContext<Auth|null>(null);

function getRedirectUrl(){return Linking.createURL('auth/callback')}

function getProfilePatch(user:User){
  const meta=user.user_metadata??{};
  const fullName=meta.full_name||meta.name||meta.display_name||user.email?.split('@')[0]||'חבר/ה Plentify';
  return {id:user.id,full_name:String(fullName),city:String(meta.city||'כפר סבא'),avatar_url:meta.avatar_url||meta.picture||null,updated_at:new Date().toISOString()};
}

async function ensureProfile(sessionValue:Session|null){
  if(!supabase||!sessionValue?.user)return;
  const patch=getProfilePatch(sessionValue.user);
  const{error}=await supabase.from('profiles').upsert(patch,{onConflict:'id'});
  if(error)throw error;
}

async function completeOAuth(url:string){
  const parsed=new URL(url);const code=parsed.searchParams.get('code');
  if(code){const{data,error}=await supabase!.auth.exchangeCodeForSession(code);if(error)throw error;await ensureProfile(data.session);return}
  const accessToken=parsed.hash.match(/access_token=([^&]+)/)?.[1];const refreshToken=parsed.hash.match(/refresh_token=([^&]+)/)?.[1];
  if(accessToken&&refreshToken){const{data,error}=await supabase!.auth.setSession({access_token:decodeURIComponent(accessToken),refresh_token:decodeURIComponent(refreshToken)});if(error)throw error;await ensureProfile(data.session);return}
  throw new Error('Missing OAuth session data')
}

export function AuthProvider({children}:{children:React.ReactNode}){const[session,setSession]=useState<Session|null>(null);const[loading,setLoading]=useState(true);
  useEffect(()=>{WebBrowser.maybeCompleteAuthSession();if(!supabase){setLoading(false);return}supabase.auth.getSession().then(({data})=>{setSession(data.session);setLoading(false);if(data.session)ensureProfile(data.session).catch(()=>{})});const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>{setSession(s);if(s)ensureProfile(s).catch(()=>{})});return()=>subscription.unsubscribe()},[]);
  const signIn=useCallback(async(e:string,p:string)=>{if(!supabase)throw new Error('Supabase is not configured');const{data,error}=await supabase.auth.signInWithPassword({email:e.trim().toLowerCase(),password:p});if(error)throw error;await ensureProfile(data.session)},[]);
  const signUp=useCallback(async(e:string,p:string)=>{if(!supabase)throw new Error('Supabase is not configured');const{data,error}=await supabase.auth.signUp({email:e.trim().toLowerCase(),password:p});if(error)throw error;await ensureProfile(data.session)},[]);
  const signInWithProvider=useCallback(async(provider:SocialProvider)=>{if(!supabase)throw new Error('Supabase is not configured');const redirectTo=getRedirectUrl();const{data,error}=await supabase.auth.signInWithOAuth({provider,options:{redirectTo,skipBrowserRedirect:true,queryParams:provider==='google'?{access_type:'offline',prompt:'select_account'}:undefined}});if(error)throw error;if(!data?.url)throw new Error('OAuth provider did not return a URL');const result=await WebBrowser.openAuthSessionAsync(data.url,redirectTo);if(result.type!=='success')return'cancelled';await completeOAuth(result.url);return'success'},[]);
  const resetPassword=useCallback(async(email:string)=>{if(!supabase)throw new Error('Supabase is not configured');const{error}=await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(),{redirectTo:getRedirectUrl()});if(error)throw error},[]);
  const value=useMemo<Auth>(()=>({session,userId:session?.user.id||demoProfile.id,loading,demo:!isSupabaseConfigured,signIn,signUp,signInWithProvider,resetPassword,signOut:async()=>{await supabase?.auth.signOut();setSession(null)}}),[session,loading,signIn,signUp,signInWithProvider,resetPassword]);
  return <C.Provider value={value}>{children}</C.Provider>}
export function useAuth(){const ctx=useContext(C);if(!ctx)throw new Error('AuthProvider missing');return ctx;}
