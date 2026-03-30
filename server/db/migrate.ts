import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  console.log("Running manual column migration...");
  try {
    // Rename matters_template → matters_to_you on stories
    await sql`ALTER TABLE stories RENAME COLUMN matters_template TO matters_to_you`;
    console.log("✓ Renamed matters_template → matters_to_you");
  } catch (e: any) {
    if (e.message?.includes('does not exist')) console.log("⚠ matters_template column not found (may already be renamed)");
    else throw e;
  }

  try {
    await sql`ALTER TABLE stories RENAME COLUMN matters_template_hi TO matters_to_you_hi`;
    console.log("✓ Renamed matters_template_hi → matters_to_you_hi");
  } catch (e: any) {
    if (e.message?.includes('does not exist')) console.log("⚠ matters_template_hi column not found (may already be renamed)");
    else throw e;
  }

  try {
    // chat_messages: rename text → content
    await sql`ALTER TABLE chat_messages RENAME COLUMN text TO content`;
    console.log("✓ Renamed text → content in chat_messages");
  } catch (e: any) {
    if (e.message?.includes('does not exist')) console.log("⚠ text column not found in chat_messages");
    else throw e;
  }

  // Also add the new columns if they don't exist (for newly created columns from drizzle push)
  try {
    await sql`ALTER TABLE stories ADD COLUMN IF NOT EXISTS matters_to_you TEXT`;
    await sql`ALTER TABLE stories ADD COLUMN IF NOT EXISTS matters_to_you_hi TEXT`;
    console.log("✓ Verified matters_to_you columns exist in stories");
  } catch (e: any) {
    console.log("Note:", e.message);
  }

  try {
    await sql`ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS content TEXT`;
    console.log("✓ Verified content column exists in chat_messages");
  } catch (e: any) {
    console.log("Note:", e.message);
  }

  console.log("Migration complete.");
  process.exit(0);
}

migrate().catch(err => { console.error(err); process.exit(1); });
