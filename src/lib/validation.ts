import {z} from 'zod';
export const listingSchema=z.object({title:z.string().min(3),description:z.string().min(8),city:z.string().min(2)});
export const profileSchema=z.object({full_name:z.string().min(2),city:z.string().min(2),neighborhood:z.string().optional()});
