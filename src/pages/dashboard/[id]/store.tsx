import * as React from "react";
import fetch from "node-fetch";
import { parseCookies } from "nookies";
import Head from "next/head";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { openModal } from "@components/modal";
import AddStoreItem from "@components/modal/add-store-item";
import { useRouter } from "next/router";
import AlertMessage from "@components/AlertMessage";
import Logger from "handlers/Logger";
import Guild from "types/Guild";
import Loader from "@components/Loader";

interface Props {
  guild: Guild | null;
  isAuth: boolean;
  error: string | undefined;
}

const Store: React.FC<Props> = ({ guild, isAuth, error }: Props) => {
  const [message, setMessage] = React.useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuth) {
      router.push("/login");
    }
  }, [router, isAuth]);

  React.useEffect(() => {
    const { query } = router;
    setMessage((query?.message && `${query.message}`) || null);
  }, [router]);

  async function deleteItem(name: string) {
    try {
      const data = await (
        await fetch(
          `${process.env["NEXT_PUBLIC_DASHBOARD_URL"]}/api/guilds/${
            guild?.id
          }/store?name=${encodeURIComponent(name)}`,
          {
            method: "DELETE",
          },
        )
      ).json();

      if (data.status === "success") {
        router.push(`/dashboard/${guild?.id}/store?message=${data.message}`);
      }

      setMessage(data?.error);
    } catch (e) {
      Logger.error("delete_store_item", e);
    }
  }

  function addStoreItem() {
    openModal("addStoreItem");
  }

  if (!isAuth) {
    return <Loader full />;
  }

  if (error) {
    return <AlertMessage type="error" message={error} />;
  }

  if (!guild) {
    return null;
  }

  return (
    <>
      {message ? <AlertMessage type="success" message={message} /> : null}

      <AddStoreItem guild={guild} />
      <Head>
        <title>
          {guild?.name} - Store / {process.env["NEXT_PUBLIC_DASHBOARD_BOTNAME"]} Dashboard
        </title>
      </Head>
      <div className="page-title">
        <h4>{guild?.name} - Store</h4>

        <div>
          <Link href={`/dashboard/${guild.id}`}>
            <a href={`/dashboard/${guild.id}`} className="btn btn-primary">
              Return
            </a>
          </Link>
          <button className="btn btn-primary ml-5" onClick={addStoreItem}>
            Add store item
          </button>
        </div>
      </div>

      {guild?.store?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {guild?.store?.map((item, idx) => {
              return (
                <tr key={idx}>
                  <td className="cmd-response">{item.name}</td>
                  <td>{item.price}</td>
                  <td className="table-actions">
                    <button onClick={() => deleteItem(item.name)} className="btn btn-sm btn-red">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>This guild does not have any items in the store yet</p>
      )}
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);

  const data = await (
    await fetch(`${process.env["NEXT_PUBLIC_DASHBOARD_URL"]}/api/guilds/${ctx.query.id}`, {
      headers: {
        auth: cookies?.token,
      },
    })
  ).json();

  return {
    props: {
      isAuth: data.error !== "invalid_token",
      guild: data?.guild ?? null,
      error: data?.error ?? null,
    },
  };
};

export default Store;
