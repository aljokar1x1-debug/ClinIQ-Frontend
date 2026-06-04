import { createServer } from "node:http";

let handler;

async function getHandler() {
  if (!handler) {
    const mod = await import("../dist/server/index.js");
    handler = mod.default;
  }
  return handler;
}

export default async function (req, res) {
  const h = await getHandler();
  const webReq = new Request(
    `http://${req.headers.host}${req.url}`,
    {
      method: req.method,
      headers: req.headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req,
    }
  );
  const webRes = await h.fetch(webReq);
  res.statusCode = webRes.status;
  webRes.headers.forEach((v, k) => res.setHeader(k, v));
  res.end(Buffer.from(await webRes.arrayBuffer()));
}

export const config = {
  runtime: "nodejs",
};
