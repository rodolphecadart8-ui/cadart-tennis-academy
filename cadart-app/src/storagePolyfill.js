/* ============================================================
   Polyfill de window.storage — branché sur Supabase
   ------------------------------------------------------------
   Le dashboard a été construit dans un environnement (artefact
   Claude) qui fournit nativement window.storage.get/set/delete.
   Ce fichier reproduit la même interface, mais s'appuie
   maintenant sur une vraie base de données partagée (Supabase)
   au lieu du stockage local du navigateur — pour que toi et tes
   coachs voyiez tous les mêmes données, en temps réel.

   Exception : la clé "session" (qui indique qui est connecté sur
   CET appareil) reste volontairement en local — sinon, se
   connecter sur ton téléphone déconnecterait tout le monde
   ailleurs.

   ⚠️ Sécurité : la clé utilisée ici (VITE_SUPABASE_ANON_KEY) est
   volontairement publique (visible dans le code envoyé au
   navigateur) — c'est normal et standard pour Supabase. Pour
   l'instant, la base autorise toute lecture/écriture avec cette
   clé (RLS permissive), en cohérence avec le niveau de sécurité
   actuel de l'app (codes d'accès joueurs simples). La vraie
   sécurisation viendra avec Supabase Auth, à l'étape suivante.
   ============================================================ */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn(
    "[CADART] Supabase non configuré — variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquantes. " +
    "Les données ne pourront pas être sauvegardées tant qu'elles ne sont pas définies (voir Vercel → Settings → Environment Variables)."
  );
}
export { supabase };

const LOCAL_PREFIX = "cadart:";
const isLocalOnlyKey = (key) => key.includes("session");

/* ---------- Repli local (utilisé pour la session, ou si Supabase n'est pas configuré) ---------- */
function localGet(key) {
  try {
    const raw = localStorage.getItem(LOCAL_PREFIX + key);
    return raw == null ? null : JSON.parse(raw);
  } catch (e) { return null; }
}
function localSet(key, value) { localStorage.setItem(LOCAL_PREFIX + key, JSON.stringify(value)); }
function localDelete(key) { localStorage.removeItem(LOCAL_PREFIX + key); }

window.storage = {
  async get(key) {
    if (isLocalOnlyKey(key) || !supabase) {
      const value = localGet(key);
      return value == null ? null : { key, value };
    }
    const { data, error } = await supabase.from("kv_store").select("value").eq("key", key).maybeSingle();
    if (error) { console.error("[CADART] Supabase get error:", error); return null; }
    if (!data) return null;
    return { key, value: JSON.stringify(data.value) };
  },

  async set(key, value) {
    if (isLocalOnlyKey(key) || !supabase) {
      localSet(key, value);
      return { key, value };
    }
    let parsed;
    try { parsed = JSON.parse(value); } catch (e) { parsed = value; }
    const { error } = await supabase.from("kv_store").upsert({ key, value: parsed, updated_at: new Date().toISOString() });
    if (error) { console.error("[CADART] Supabase set error:", error); return null; }
    return { key, value };
  },

  async delete(key) {
    if (isLocalOnlyKey(key) || !supabase) {
      localDelete(key);
      return { key, deleted: true };
    }
    const { error } = await supabase.from("kv_store").delete().eq("key", key);
    if (error) { console.error("[CADART] Supabase delete error:", error); return null; }
    return { key, deleted: true };
  },

  async list(prefix) {
    if (!supabase) return { keys: [] };
    let query = supabase.from("kv_store").select("key");
    if (prefix) query = query.like("key", `${prefix}%`);
    const { data, error } = await query;
    if (error) { console.error("[CADART] Supabase list error:", error); return { keys: [] }; }
    return { keys: (data || []).map((r) => r.key) };
  },
};
