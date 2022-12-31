import * as React from "react";
import { parseCookies } from "nookies";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Loader } from "./Loader";
import { useTranslation } from "react-i18next";

export interface User {
  username: string;
  id: string;
  avatar: string | null;
}

export function Navbar() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);
  const { t } = useTranslation("profile");

  const fetchAuth = React.useCallback(async () => {
    const cookies = parseCookies();
    const data = await (
      await fetch(`${process.env["NEXT_PUBLIC_DASHBOARD_URL"]}/api/auth`, {
        method: "POST",
        headers: {
          auth: cookies.token,
        },
      })
    ).json();

    setLoading(false);

    if (data.invalid_token) {
      return router.push("/api/auth/login");
    }

    setUser(data.user);
  }, [router]);

  React.useEffect(() => {
    fetchAuth();
  }, [fetchAuth]);

  if (loading) {
    return <Loader full />;
  }

  return (
    <nav className="nav">
      <div className="nav-content">
        <Link href="/dashboard">
          <a href="/dashboard" className="nav-icon-link">
            {process.env["NEXT_PUBLIC_DASHBOARD_BOTNAME"]}{" "}
            <span className="nav-icon-extra">Dashboard</span>
          </a>
        </Link>
        <div className="dropdown-container">
          <button className="nav-link-dropdown">
            <label htmlFor="image" className="sr-only">
              Dropdown Menu
            </label>
            <Image
              width="40"
              height="40"
              alt="dropdown"
              src={
                user?.avatar === null
                  ? "https://cdn.discordapp.com/embed/avatars/0.png"
                  : `https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.webp`
              }
            />
          </button>

          <div className="dropdown">
            <div className="dropdown-content">
              <Link href="/dashboard">
                <a href="/dashboard" className="dropdown-link">
                  {t("my_servers")}
                </a>
              </Link>
              <Link href="/add">
                <a href="/add" className="dropdown-link">
                  {t("invite")} {process.env["NEXT_PUBLIC_DASHBOARD_BOTNAME"]}
                </a>
              </Link>

              <Link href="/logout">
                <a href="/logout" className="dropdown-link logout">
                  {t("logout")}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
