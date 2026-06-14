import {supabase}from'@/lib/supabase';import {demoProfile}from'@/services/demoData';
export async function getProfile(id:string){if(!supabase)return demoProfile;const{data,error}=await supabase.from('profiles').select('*').eq('id',id).single();if(error)throw error;return data;}
export async function updateProfile(id:string,patch:Record<string,unknown>){if(!supabase)return {...demoProfile,...patch};const{data,error}=await supabase.from('profiles').update(patch).eq('id',id).select().single();if(error)throw error;return data;}
