const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase keys in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
    console.log("Testing connection to Supabase...");
    // Try to select from 'users' table which should exist if schema was run
    const { data, error } = await supabase.from('users').select('*').limit(1);

    if (error) {
        if (error.code === 'PGRST204' || error.message.includes('relation "public.users" does not exist')) {
            console.log("❌ Connection Successful, BUT Tables are MISSING.");
            console.log("   -> You have NOT run the SQL Schema yet.");
        } else {
            console.error("❌ Connection Failed:", error.message);
        }
    } else {
        console.log("✅ Database Verified! Connection Successful and Tables Exist.");
    }
}

checkDatabase();
