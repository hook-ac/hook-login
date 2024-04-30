import { SupabaseClient, createClient, type User } from "@supabase/supabase-js";
import express from "express";
import { LocalStorage } from "node-localstorage";
import os from "os";

export const localStorage = new LocalStorage(os.homedir() + "/profile");

export async function loginWithDiscord<T>(
  supabase: SupabaseClient
): Promise<User | null> {
  return new Promise<User | null>(async (resolve, reject) => {
    if (localStorage.getItem("data")) {
      const query = JSON.parse(localStorage.getItem("data")!);
      let authres = await supabase.auth.setSession({
        access_token: query.access_token as string,
        refresh_token: query.refresh_token as string,
      });
      if (!authres.error) {
        resolve(authres.data.user);
        return;
      }
    }

    const res = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: "http://localhost:9001/login",
        skipBrowserRedirect: true,
      },
    });

    const redirectUrl = res.data.url;
    console.log(`Please login at: ${redirectUrl}`);

    const app = express();
    const port = 9001;

    app.get("/login", async (req, res) => {
      if (req.query.access_token) {
        localStorage.setItem("data", JSON.stringify(req.query));
        let authres = await supabase.auth.setSession({
          access_token: req.query.access_token as string,
          refresh_token: req.query.refresh_token as string,
        });
        if (!authres.error) {
          resolve(authres.data.user);
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
