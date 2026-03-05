import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://drdhdgnsbevqekcijyem.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZGhkZ25zYmV2cWVrY2lqeWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NzQwMDgsImV4cCI6MjA4ODI1MDAwOH0.eWuXFH8yFom-ubTx6U2iSUyNb7uOyhHLoIurhb7pkeA";

export const supabase = createClient(supabaseUrl, supabaseKey);