import { loginGuest, loginWithDiscord } from ".";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bogjwtpfbwbchxteoxlo.supabase.co";
export const supabase = createClient(
  supabaseUrl,
  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZ2p3dHBmYndiY2h4dGVveGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM4MjIyNjUsImV4cCI6MjAyOTM5ODI2NX0.sHJfqpD4AvixbYkbM8eBvgM24i9_aweZyBj3MIZyO6o`,
  {
    auth: {
      flowType: "pkce",
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: true,
    },
  }
);

let a = 1;
loginGuest(supabase).then((e) => {
  console.log(e);
});
loginWithDiscord(supabase).then((user) => {
  console.log(user);
});
