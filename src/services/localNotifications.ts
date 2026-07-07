import {Category,ListingType}from'@/types/models';

export type LocalNotificationRule={
  id:string;
  titleKey:'notificationNewNearby'|'notificationReply'|'notificationMatchingRequest'|'notificationSavedCategory';
  radiusKm?:number;
  category?:Category;
  type?:ListingType;
  enabled:boolean;
};

export const defaultLocalNotificationRules:LocalNotificationRule[]=[
  {id:'new-post-2km',titleKey:'notificationNewNearby',radiusKm:2,enabled:true},
  {id:'reply-to-post',titleKey:'notificationReply',enabled:true},
  {id:'matching-request',titleKey:'notificationMatchingRequest',type:'REQUEST',enabled:true},
  {id:'saved-category-nearby',titleKey:'notificationSavedCategory',radiusKm:2,enabled:false}
];
