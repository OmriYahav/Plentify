export type Json=string|number|boolean|null|{[key:string]:Json|undefined}|Json[];
export type Database={public:{Tables:Record<string,never>;Functions:{nearby_listings:{Args:{user_lat:number;user_lng:number;radius_km:number;type_filter?:string|null;category_filter?:string|null;search_query?:string|null};Returns:unknown[]}}}};
