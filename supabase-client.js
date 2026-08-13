(() => {
  // Evita inicializar o cliente mais de uma vez
  if (window.supabaseClient) {
    return;
  }

  const SUPABASE_URL = "https://cfqvfiquhtzzzfuubltf.supabase.co";

  // Sua chave anon pública válida do Supabase
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcXZmaXF1aHR6enpmdXVibHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTk5NTcsImV4cCI6MjA5Njc3NTk1N30.nmk8hY_QDGLATFLn9eSqNbtWGRF_B-ff3icDCF_HFG0";

  // Verifica se o script do Supabase foi carregado no HTML antes deste arquivo
  if (!window.supabase?.createClient) {
    console.error(
      "A biblioteca do Supabase não foi carregada. Verifique a tag <script> do Supabase no seu HTML."
    );
    return;
  }

  // Inicializa o cliente Supabase globalmente
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
        storageKey: "barberexpress-auth-token"
      }
    }
  );

  console.log("Supabase inicializado com sucesso.");
})();