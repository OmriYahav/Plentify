import React from 'react';import {Field}from'@/components/ui/Primitives';import {useI18n}from'@/lib/i18n';
export function ProfileForm(){const{t}=useI18n();return <><Field placeholder={t('fullName')}/><Field placeholder={t('city')} style={{marginTop:12}}/><Field placeholder={t('neighborhood')} style={{marginTop:12}}/></>}
