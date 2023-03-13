import { createLibp2p } from "libp2p";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { tcp } from "@libp2p/tcp";
import { bootstrap } from "@libp2p/bootstrap";
import { gossipsub } from "@chainsafe/libp2p-gossipsub";

const node = await createLibp2p({
  transports: [tcp()],
  connectionEncryption: [noise()],
  streamMuxers: [yamux()],

  peerDiscovery: [
    bootstrap({
      list: [
        "/ip4/184.72.27.233/tcp/44544/p2p/12D3KooWBhAkxEn3XE7QanogjGrhyKBMC5GeM3JUTqz54HqS6VHG",
      ],
    }),
  ],

  pubsub: gossipsub({
    // Do we need any extra config here?
  }),
});

await node.start();

console.log("My peer id:", node.peerId);

node.addEventListener("peer:discovery", function ({ detail }) {
  console.log("%s [PEER FOUND]", now(), detail.id);
});

node.pubsub.addEventListener("message", ({ detail }) => {
  console.log(
    "%s [MSG:%s:%s] %s",
    now(),
    detail.topic,
    detail.type,
    Buffer.from(detail.data).toString("base64"),
  );
});

// https://drand.love/developer/gossipsub/#pubsub-network
node.pubsub.subscribe(
  "/drand/pubsub/v0.0.0/8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce",
);

function now() {
  return new Date().toISOString().split("T")[1];
}
