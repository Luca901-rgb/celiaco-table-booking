// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ubneuyykhiufttdbcejp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVibmV1eXlraGl1ZnR0ZGJjZWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MjY1OTEsImV4cCI6MjA2NTQwMjU5MX0.9tKsjYilyxZPd2s8z4KpuDpM1z8Pvapg2jAdMCBwTe4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);