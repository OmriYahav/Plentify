import {z} from 'zod';
export const listingSchema=z.object({title:z.string().min(3),description:z.string().min(8),city:z.string().min(2)});
export const profileSchema=z.object({full_name:z.string().min(2),city:z.string().min(2),neighborhood:z.string().optional()});

export const emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const signupSchema=z.object({full_name:z.string().trim().min(2),city:z.string().trim().min(2),email:z.string().trim().regex(emailRe),password:z.string().min(6)});
