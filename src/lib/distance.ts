import {en}from'@/translations/en';
export const DEFAULT_COORD={lat:32.1782,lng:34.9076};
export function distanceKm(a:{lat:number;lng:number},b:{lat:number;lng:number}){const R=6371;const dLat=(b.lat-a.lat)*Math.PI/180;const dLng=(b.lng-a.lng)*Math.PI/180;const s=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;return R*2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s));}
type T=(key:keyof typeof en)=>string;
export const formatDistance=(km:number|undefined,t:T)=>t('distanceKm').replace('{distance}',km?.toFixed(1)??'—');
export const timeAgo=(iso:string,t:T)=>{const m=Math.floor((Date.now()-new Date(iso).getTime())/60000);if(m<60)return t('timeAgoMinutes').replace('{count}',String(Math.max(1,m)));const h=Math.floor(m/60);if(h<24)return t('timeAgoHours').replace('{count}',String(h));return t('timeAgoDays').replace('{count}',String(Math.floor(h/24)));};
