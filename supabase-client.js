(() => {
  if (window.supabaseClient) {
    return;
  }

  const SUPABASE_URL =
    "https://cfqvfiquhtzzzfuubltf.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_q1Ckt9CnEi7cJSzFsHPjug_TLc2kWwX";

  if (!window.supabase?.createClient) {
    console.error(
      "A biblioteca do Supabase não foi carregada."
    );

    return;
  }

  window.supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: window.localStorage
        }
      }
    );

  console.log(
    "Supabase inicializado com sessão persistente."
  );
})();