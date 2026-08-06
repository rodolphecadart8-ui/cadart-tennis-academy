/* ============================================================
   Polyfill de window.storage
   ------------------------------------------------------------
   Le dashboard a été construit dans un environnement (artefact
   Claude) qui fournit nativement window.storage.get/set/delete.
   Ce fichier reproduit la même interface au-dessus de
   localStorage, pour que le dashboard fonctionne à l'identique
   en dehors de cet environnement — sans toucher au code du
   dashboard lui-même.

   ⚠️ ÉTAPE INTERMÉDIAIRE : localStorage n'est stocké QUE dans le
   navigateur de la personne qui l'utilise (pas de partage entre
   appareils, pas de sauvegarde si le cache est vidé). C'est
   suffisant pour tester le déploiement, mais l'étape suivante du
   plan (brancher Supabase) remplacera ce fichier par de vrais
   appels réseau vers une base de données partagée.
   ============================================================ */

const PREFIX = "cadart:";

function read(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? null : JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function write(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

window.storage = {
  async get(key) {
    const value = read(key);
    return value == null ? null : { key, value };
  },
  async set(key, value) {
    write(key, value);
    return { key, value };
  },
  async delete(key) {
    localStorage.removeItem(PREFIX + key);
    return { key, deleted: true };
  },
  async list(prefix) {
    const keys = Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .map((k) => k.slice(PREFIX.length))
      .filter((k) => !prefix || k.startsWith(prefix));
    return { keys };
  },
};
