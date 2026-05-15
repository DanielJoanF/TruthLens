import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkTables() {
  const { data, error } = await supabase.rpc('get_tables'); // Try rpc if available, or just standard query
  
  // Since we might not have RPC, let's just try to select from each table and see if it throws 42P01
  const tables = ['users', 'analysis_history', 'claims', 'embeddings', 'sources'];
  
  console.log("Mengecek ketersediaan tabel...");
  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      if (error.code === '42P01') {
        console.log(`❌ Tabel '${table}' BELUM DIBUAT.`);
      } else {
        console.log(`❌ Tabel '${table}' error lain: ${error.message}`);
      }
    } else {
      console.log(`✅ Tabel '${table}' SUDAH DIBUAT.`);
    }
  }
}

checkTables();
