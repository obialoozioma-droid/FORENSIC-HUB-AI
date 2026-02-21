
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.45.0';

const supabaseUrl = 'https://ssjliupnsdqqqerdmigk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzamxpdXBuc2RxcXFlcmRtaWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNjg2NTcsImV4cCI6MjA4Njg0NDY1N30.GUb0JYU7BKSpBKpmiHroQ9UkBR9BziISPTz6CpUJorM';

export const supabase = createClient(supabaseUrl, supabaseKey);
