import { SupabaseClient, type User } from "@supabase/supabase-js";
import child_process from "child_process";
import express from "express";
import { LocalStorage } from "node-localstorage";
import os from "os";
export const localStorage = new LocalStorage(os.homedir() + "/profile");

export async function loginWithDiscord<T>(
  supabase: SupabaseClient
): Promise<User | null> {
  return new Promise<User | null>(async (resolve, reject) => {
    const res = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: "http://localhost:9001/login",
        skipBrowserRedirect: true,
      },
    });

    if (localStorage.getItem("data")) {
      const query = JSON.parse(localStorage.getItem("data")!);
      const ses = await supabase.auth.setSession(query);

      if (!ses.error) {
        resolve(ses.data.user);
        return;
      }
    }

    const redirectUrl = res.data.url;
    child_process.exec(`start "" "${redirectUrl}"`);

    const app = express();
    const port = 9001;

    app.get("/login", async (req, res) => {
      if (req.query.code) {
        const ses = await supabase.auth.exchangeCodeForSession(
          req.query.code as any
        );

        let authres = await supabase.auth.setSession({
          ...ses.data.session!,
        });
        localStorage.setItem(
          "data",
          JSON.stringify((await supabase.auth.getSession()).data.session)
        );

        if (!authres.error) {
          resolve(authres.data.user);
          res.send("OK!");
          server.close();
          return;
        } else {
          reject();
          server.close();
          return;
        }
      }

      res.send(`
     <script>
     const hash = window.location.hash;
     if(hash.length > 0 && hash.startsWith("#")) {
       window.location.replace(window.location.href.replace('#','?'));
     }
   </script>`);
    });

    let server = app.listen(port, () => {});
  });
}

export async function loginGuest(supabase: SupabaseClient) {
  const res = await supabase.auth.signInWithPassword({
    email: "sample@hook.ac",
    password: "password",
  });
  return res.data.user;
}
