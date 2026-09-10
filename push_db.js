const { Client } = require('pg');
const fs = require('fs');

async function pushDb() {
  // Let's read the migration file and seed file
  const migration = fs.readFileSync('supabase/migrations/20240910000000_initial_schema.sql', 'utf8');
  const seed = fs.readFileSync('supabase/seed.sql', 'utf8');

  // Try different password variations just in case
  const passwords = ['push12@\\\\23', 'push12@\\23'];
  
  for (const pwd of passwords) {
      console.log('Trying password...', pwd);
      const client = new Client({
        connectionString: `postgresql://postgres:${pwd}@db.bskfgwouthlelumidlpg.supabase.co:5432/postgres`
      });

      try {
        await client.connect();
        console.log('Connected!');
        
        console.log('Running migration...');
        await client.query(migration);
        console.log('Migration successful.');

        console.log('Running seed...');
        await client.query(seed);
        console.log('Seed successful.');
        
        await client.end();
        return; // Success
      } catch (err) {
        console.error('Failed with password:', err.message);
      }
  }
}

pushDb();
