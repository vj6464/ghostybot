import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import * as React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import AlertMessage from "@components/AlertMessage";
import Guild from "types/Guild";
import Loader from "@components/Loader";

interface Props {
  isAuth: boolean;
  guilds: Guild[];
}

const Dashboard: React.FC<Props> = ({ isAuth, guilds }: Props) => {
  const router = useRouter();
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const { query } = router;
    setMessage((query?.message && `${query.message}`) || null);

    if (!isAuth) {
      router.push("/api/auth/login");
    }
  }, [isAuth, router]);

  if (!isAuth) {
    return <Loader full />;
  }

  return (
    <>
      <AlertMessage
        message={
          <>
            This dashboard is still in beta! It could be that some thing will not work, if you found
            an issue please report this at:{" "}
            <a href="https://discord.gg/XxHrtkA">https://discord.gg/XxHrtkA</a>
          </>
        }
      />
      {message ? <AlertMessage message={message} /> : null}
      <div className="page-title">
        <h4>Please select a server</h4>
      </div>

      <div className="grid">
        {guilds.map((guild) => {
          // take the first letter of all the letters
          const firstLetter = guild.name.split("")[0];

          // take the second word, then the first character of that word
          const secondLetter = guild.name.split(" ")[1]?.split("")[0];

          return (
            <Link key={guild.id} href={guild.inGuild ? `/dashboard/${guild.id}` : "#"}>
              <a
                aria-disabled={!guild.inGuild}
                href={!guild.inGuild ? "#" : `/dashboard/${guild.id}`}
                className={`card guild-card ${!guild.inGuild ? "disabled" : ""}`}
                aria-label={!guild.inGuild ? "The bot must be in this guild!" : undefined}
              >
                {guild.icon === null ? (
                  <div className="guild-card-img no-image">
                    {firstLetter}
                    {secondLetter}
                  </div>
                ) : (
                  <Image
                    alt={guild.name}
                    className="guild-card-img"
                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`}
                    width="65"
                    height="65"
                  />
                )}
                <p>{guild.name}</p>
              </a>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);
  const res = await fetch(`${process.env["NEXT_PUBLIC_DASHBOARD_URL"]}/api/guilds`, {
    headers: {
      Auth: cookies?.token,
    },
  });

  const data = await res.json();

  return {
    props: {
      isAuth: data.error !== "invalid_token",
      guilds: data?.guilds ?? [],
    },
  };
};

export default Dashboard;
