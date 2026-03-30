import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

async function fixColumns() {
  console.log("Ensuring all required columns exist in the DB...");
  
  // Helper: add column if missing
  const addCol = async (table: string, col: string, type: string) => {
    try {
      await sql`ALTER TABLE ${sql(table)} ADD COLUMN ${sql(col)} ${sql(type)}`;
      console.log(`✓ Added ${table}.${col}`);
    } catch (e: any) {
      if (e.message?.includes('already exists')) {
        console.log(`- ${table}.${col} already exists`);
      } else {
        console.error(`✗ ${table}.${col}:`, e.message);
      }
    }
  };

  // Stories table - add missing columns
  await addCol('stories', 'matters_to_you', 'TEXT');
  await addCol('stories', 'matters_to_you_hi', 'TEXT');
  await addCol('stories', 'read_time', 'VARCHAR(30)');
  await addCol('stories', 'read_time_hi', 'VARCHAR(30)');
  await addCol('stories', 'update_info', 'VARCHAR(100)');
  await addCol('stories', 'update_info_hi', 'VARCHAR(100)');
  await addCol('stories', 'tags', 'TEXT[]');
  await addCol('stories', 'image_url', 'TEXT');
  await addCol('stories', 'is_breaking', 'BOOLEAN DEFAULT false');
  await addCol('stories', 'title_hi', 'TEXT');
  await addCol('stories', 'category_hi', 'VARCHAR(100)');
  await addCol('stories', 'content_hi', 'TEXT');
  await addCol('stories', 'insights', 'TEXT[]');
  await addCol('stories', 'insights_hi', 'TEXT[]');

  // Chat messages - add content column
  await addCol('chat_messages', 'content', 'TEXT');

  console.log("\nAll done. Now re-check the schema.");

  // Verify stories columns exist
  const cols: any[] = await sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'stories'
    ORDER BY ordinal_position
  `;
  console.log("\nStories columns:", cols.map((c: any) => c.column_name).join(', '));
  
  process.exit(0);
}

fixColumns().catch(err => { console.error(err); process.exit(1); });
