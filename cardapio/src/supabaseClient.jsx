import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tjjzuuvriigpejqptgbe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqanp1dXZyaWlncGVqcXB0Z2JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNzQyNTcsImV4cCI6MjAzODY1MDI1N30.c4kHiJW-tXf-vfjDrdRyEotXdgjJMauH2sN0uZBjHpQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
