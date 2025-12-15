import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pzjollrrnvrvuqnpmbuk.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6am9sbHJybnZydnVxbnBtYnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NjAwMjUsImV4cCI6MjA4MTMzNjAyNX0.l6oZNGtBvyanmhhld4dxG1mX6sdieXLOh6nz54PIZGE';

export const supabase = createClient(supabaseUrl, supabaseKey);