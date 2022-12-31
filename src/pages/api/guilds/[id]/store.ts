import { NextApiResponse } from "next";
import { ApiRequest } from "types/ApiRequest";

export default async function handler(req: ApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  try {
    await req.bot.utils.checkAuth(req, { guildId: `${query.id}` });
  } catch (e) {
    return res.json({ status: "error", error: e });
  }

  const guild = await req.bot.utils.getGuildById(`${query.id}`);
  const lang = await req.bot.utils.getGuildLang(`${query.id}`);
  if (!guild) {
    return res.json({
      status: "error",
      error: "An unexpected error occurred",
    });
  }

  switch (method) {
    case "POST": {
      const body = JSON.parse(req.body);

      if (!body.name || !body.price) {
        return res.json({
          error: "Please fill in all fields",
          status: "error",
        });
      }

      const isNumber = /^\d+$/;
      const price = body.price as string;
      const name = body.name.toLowerCase();

      if (!isNumber.test(price.toString())) {
        return res.status(400).json({
          error: lang.ECONOMY.MUST_BE_NUMBER,
          status: "error",
        });
      }

      if (guild.store.find((x) => x.name === name)) {
        return res.status(400).json({
          error: req.bot.utils.translate(lang.ECONOMY.ALREADY_EXISTS, { item: name }),
          status: "error",
        });
      }

      await req.bot.utils.updateGuildById(`${query.id}`, {
        store: [...guild.store, { name, price }],
      });

      return res.json({ status: "success" });
    }
    case "DELETE": {
      const filtered = guild.store.filter(
        (item) => item.name.toLowerCase() !== (query.name as string).toLowerCase(),
      );

      await req.bot.utils.updateGuildById(`${query.id}`, { store: filtered });

      return res.json({
        status: "success",
        message: req.bot.utils.translate(lang.ECONOMY.REMOVED_FROM_STORE, {
          item: query.name as string,
        }),
      });
    }
    default: {
      return res.status(405).json({ error: "Method not allowed", status: "error" });
    }
  }
}
