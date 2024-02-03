// db.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ijgskaxxxqznqdirasbz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqZ3NrYXh4eHF6bnFkaXJhc2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4MTQzNTAsImV4cCI6MjAyMjM5MDM1MH0.XSulZC6wcUKUXCAg87CgCs5ezBthCuA_183ZOn4dti8';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
