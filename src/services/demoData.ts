import {Listing,Profile,Conversation,Message} from '@/types/models';

const now=new Date();

export const demoProfile:Profile={id:'demo-user',full_name:'מאיה כהן',city:process.env.EXPO_PUBLIC_DEMO_CITY||'כפר סבא',neighborhood:'מרכז ירוק',rating_avg:4.9,rating_count:18,completed_count:24,created_at:'2025-03-01T00:00:00Z'};

export const demoListings:Listing[]=[
  {id:'1',owner_id:'u1',type:'OFFER',category:'produce',title:'סל לימונים',description:'לימונים טריים מעץ החצר שלנו. הביאו שקית קטנה וקחו כמה שאתם צריכים.',quantity:'10–15 לימונים',status:'available',city:'כפר סבא',neighborhood:'עלייה',lat:32.181,lng:34.905,created_at:new Date(now.getTime()-3600e3).toISOString(),distance_km:.7,owner:{...demoProfile,id:'u1',full_name:'נועה לוי',completed_count:12}},
  {id:'2',owner_id:'u2',type:'LEND',category:'tools',title:'מקדחה אלחוטית לסוף השבוע',description:'בשמחה אשאיל לתיקונים קטנים בבית. נא להחזיר טעונה.',status:'available',city:'כפר סבא',neighborhood:'קפלן',lat:32.174,lng:34.91,created_at:new Date(now.getTime()-7200e3).toISOString(),distance_km:1.1,owner:{...demoProfile,id:'u2',full_name:'עמית בר'}},
  {id:'3',owner_id:'u3',type:'PUBLIC_TREE',category:'public_trees',title:'עץ תות ציבורי',description:'נמצא בבירור על השביל הציבורי. קטפו בעדינות והשאירו גם לציפורים ולשכנים.',status:'available',city:'כפר סבא',neighborhood:'שביל הפארק',lat:32.179,lng:34.914,created_at:new Date(now.getTime()-86400e3).toISOString(),distance_km:1.4,owner:{...demoProfile,id:'u3',full_name:'ליאור דן'}}
];

export const demoConversations:Conversation[]=[{id:'c1',listing_id:'1',participant_a:'demo-user',participant_b:'u1',last_message:'בטח, אפשר להגיע אחרי 17:00.',last_message_at:new Date().toISOString(),created_at:new Date().toISOString(),listing:demoListings[0],other_user:demoListings[0].owner}];
export const demoMessages:Message[]=[{id:'m1',conversation_id:'c1',sender_id:'demo-user',body:'הלימונים עדיין זמינים?',created_at:new Date(Date.now()-1800e3).toISOString()},{id:'m2',conversation_id:'c1',sender_id:'u1',body:'בטח, אפשר להגיע אחרי 17:00.',created_at:new Date().toISOString()}];
