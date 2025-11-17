// ✅ Supabase Client with Clerk Auth (FULL FEATURED: rpc, from, storage, signed URLs)
import { createClient } from "@supabase/supabase-js";

console.log("🧩 [SupabaseClient] initializing...");

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Missing Supabase env vars");
}

// --------------------------------------------------
// 1️⃣ Base anon client (with no auth)
// --------------------------------------------------
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --------------------------------------------------
// 2️⃣ Full authenticated client via Clerk token
// --------------------------------------------------
export async function getSupabaseWithAuth(getToken) {
  let token = null;

  try {
    token = await getToken({ template: "supabase" });
    console.log("🔑 [Supabase] Clerk token received");
  } catch (err) {
    console.warn("⚠️ [Supabase] No Clerk token, falling back to anon:", err);
  }

  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: token ? `Bearer ${token}` : `Bearer ${SUPABASE_ANON_KEY}`,
      },
    },
  });

  return client; // ← ← ← Теперь это ПОЛНОЦЕННЫЙ CLIENT
}

// --------------------------------------------------
// 3️⃣ Legacy storage upload (your custom system)
// --------------------------------------------------

// helper
function buildStorageUploadUrl(bucket, path) {
  return `${SUPABASE_URL}/storage/v1/object/${encodeURIComponent(bucket)}/${path}`;
}

async function storageUpload({ bucket, path, file, headers }) {
  const h = new Headers(headers);

  if (!h.has("apikey")) h.set("apikey", SUPABASE_ANON_KEY);
  if (!h.has("Authorization"))
    h.set("Authorization", `Bearer ${SUPABASE_ANON_KEY}`);

  h.set("Content-Type", file.type || "application/octet-stream");

  const url = buildStorageUploadUrl(bucket, path);
  console.log("📤 Upload →", url);

  const resp = await fetch(url, { method: "POST", headers: h, body: file });

  if (!resp.ok) {
    const msg = await resp.text();
    console.error("❌ Storage upload error:", msg);
    return { data: null, error: msg };
  }

  return { data: await resp.json(), error: null };
}

// --------------------------------------------------
// 4️⃣ Storage-only client (backward compatibility)
// --------------------------------------------------
export const supabaseCompat = {
  storage: {
    from(bucket) {
      return {
        upload: (path, file, options = {}) =>
          storageUpload({
            bucket,
            path,
            file,
            headers: options.headers || {},
          }),
      };
    },
  },
};
