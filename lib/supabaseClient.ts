import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://utknvryduzgxcsqapkmi.supabase.co";
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0a252cnlkdXpneGNzcWFwa21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMzk2OTIsImV4cCI6MjA2NTYxNTY5Mn0.XdbL34EIDOsPT54uuIczu-kTDXqwMoy-JpS-O6d3URw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
