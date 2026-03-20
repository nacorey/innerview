/**
 * Seed 4 new diagnostic tools into Supabase via REST API
 * Usage: node scripts/seed-new-tools.mjs
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars");
  process.exit(1);
}

const SEED_FILES = ["kwsd.json", "leadership.json", "followership.json", "attitude.json"];

function loadSeed(filename) {
  const raw = JSON.parse(readFileSync(resolve(__dirname, "../data/seed", filename), "utf-8"));
  // Map to DB column names (snake_case)
  return {
    slug: raw.slug,
    name: raw.name,
    name_en: raw.name_en,
    description: raw.description,
    icon: raw.icon,
    questions: raw.questions,
    scale_type: raw.scale_type,
    scale_options: raw.scale_options,
    category_map: raw.category_map,
    reverse_items: raw.reverse_items ?? [],
    max_scale: raw.max_scale,
    interpretations: raw.interpretations,
    chart_config: raw.chart_config ?? {},
    pattern_config: raw.pattern_config ?? {},
    is_active: raw.is_active ?? true,
    sort_order: raw.sort_order ?? 0,
    zone: raw.zone,
    zone_label: raw.zone_label,
    zone_order: raw.zone_order ?? 0,
  };
}

async function insertTool(tool) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/diagnostic_tools`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(tool),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to insert ${tool.slug}: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data[0];
}

async function main() {
  console.log("Seeding new diagnostic tools...\n");

  for (const file of SEED_FILES) {
    const tool = loadSeed(file);
    try {
      const result = await insertTool(tool);
      console.log(`✅ ${tool.slug} (${tool.name}) → id: ${result.id}`);
    } catch (err) {
      // If already exists, update instead
      if (err.message.includes("23505") || err.message.includes("duplicate")) {
        console.log(`⚠️  ${tool.slug} already exists, updating...`);
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/diagnostic_tools?slug=eq.${tool.slug}`,
          {
            method: "PATCH",
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=representation",
            },
            body: JSON.stringify(tool),
          }
        );
        if (res.ok) {
          console.log(`✅ ${tool.slug} updated successfully`);
        } else {
          console.error(`❌ ${tool.slug} update failed: ${await res.text()}`);
        }
      } else {
        console.error(`❌ ${err.message}`);
      }
    }
  }

  console.log("\nDone!");
}

main();
