import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
const supabaseUrl = 'https://xztxiaykhehyttvllnbu.supabase.co'; // Өөрийн Supabase URL-аар солино уу
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6dHhpYXlraGVoeXR0dmxsbmJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0ODk3ODMsImV4cCI6MjA5NTA2NTc4M30.TFwMhIKmFKRV3lsREZvsTtdocHBagTtbaIV9XtLLdyE'; // Өөрийн Anon Key-ээр солино уу


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});