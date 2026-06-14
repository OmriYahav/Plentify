export type ListingType='OFFER'|'REQUEST'|'SWAP'|'LEND'|'HELP'|'PUBLIC_TREE';
export type Category='produce'|'herbs'|'eggs'|'seeds'|'seedlings'|'cuttings'|'compost'|'tools'|'help'|'public_trees'|'other';
export type ListingStatus='available'|'reserved'|'closed';
export type Profile={id:string;full_name:string;avatar_url?:string|null;city:string;neighborhood?:string|null;rating_avg:number;rating_count:number;completed_count:number;created_at:string};
export type Listing={id:string;owner_id:string;type:ListingType;category:Category;title:string;description:string;quantity?:string|null;exchange_preference?:string|null;price?:number|null;status:ListingStatus;city:string;neighborhood?:string|null;lat:number;lng:number;image_url?:string|null;pickup_notes?:string|null;availability_notes?:string|null;expires_at?:string|null;created_at:string;completed_at?:string|null;distance_km?:number;owner?:Profile};
export type Conversation={id:string;listing_id:string;participant_a:string;participant_b:string;last_message?:string|null;last_message_at?:string|null;created_at:string;listing?:Listing;other_user?:Profile};
export type Message={id:string;conversation_id:string;sender_id:string;body:string;read_at?:string|null;created_at:string};
