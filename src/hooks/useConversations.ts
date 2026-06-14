import {useEffect,useState}from'react';import {fetchConversations}from'@/services/messages';import {Conversation}from'@/types/models';
export function useConversations(){const[data,setData]=useState<Conversation[]>([]);const[loading,setLoading]=useState(true);useEffect(()=>{fetchConversations().then(setData as any).finally(()=>setLoading(false))},[]);return{data,loading};}
