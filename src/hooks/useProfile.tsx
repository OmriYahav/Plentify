import AsyncStorage from '@react-native-async-storage/async-storage';
import React,{createContext,useCallback,useContext,useEffect,useMemo,useState}from'react';
import {useAuth}from'@/hooks/useAuth';
import {getProfile,updateProfile}from'@/services/profiles';
import {demoProfile}from'@/services/demoData';
import {Profile}from'@/types/models';

const STORAGE_KEY='plentify.demoProfile';
type EditableProfile=Pick<Profile,'full_name'|'city'|'neighborhood'|'avatar_url'>;
type ProfileContextValue={profile:Profile|null;loading:boolean;error:string;refreshProfile:()=>Promise<void>;saveProfile:(patch:Partial<EditableProfile>)=>Promise<Profile>};
const ProfileContext=createContext<ProfileContextValue|undefined>(undefined);

export function ProfileProvider({children}:{children:React.ReactNode}){const{userId,demo}=useAuth();const[profile,setProfile]=useState<Profile|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState('');
  const refreshProfile=useCallback(async()=>{setLoading(true);setError('');try{if(demo){const saved=await AsyncStorage.getItem(STORAGE_KEY);setProfile(saved?{...demoProfile,...JSON.parse(saved)}:demoProfile)}else setProfile(await getProfile(userId) as Profile)}catch(e:any){setError(e.message??'Could not load profile')}finally{setLoading(false)}},[demo,userId]);
  useEffect(()=>{refreshProfile()},[refreshProfile]);
  const saveProfile=useCallback(async(patch:Partial<EditableProfile>)=>{setError('');const clean={...patch,full_name:patch.full_name?.trim(),city:patch.city?.trim(),neighborhood:patch.neighborhood?.trim()||null};try{const saved=demo?{...(profile??demoProfile),...clean,updated_at:new Date().toISOString()} as Profile:await updateProfile(userId,clean) as Profile;if(demo)await AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(saved));setProfile(saved);return saved}catch(e:any){setError(e.message??'Could not save profile');throw e}},[demo,profile,userId]);
  const value=useMemo(()=>({profile,loading,error,refreshProfile,saveProfile}),[profile,loading,error,refreshProfile,saveProfile]);return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
export function useProfile(){const ctx=useContext(ProfileContext);if(!ctx)throw new Error('ProfileProvider missing');return ctx;}
