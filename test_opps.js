const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1];

const supabase = createClient(url, key);

async function test() {
    const { data, error } = await supabase.from('opportunities').select('*, industry:profiles!industry_id(industry_profiles(company_name)), opportunity_skills(required_level, skills(id, name))');
    console.log(JSON.stringify({ data, error }, null, 2));
}

test();
