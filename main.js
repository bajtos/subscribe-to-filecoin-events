import { createLibp2p } from "libp2p";
import { kadDHT } from "@libp2p/kad-dht";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { tcp } from "@libp2p/tcp";
import { bootstrap } from "@libp2p/bootstrap";
import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { decode } from "@ipld/dag-cbor";

const node = await createLibp2p({
  transports: [tcp()],
  connectionEncryption: [noise()],
  streamMuxers: [yamux()],

  peerDiscovery: [
    bootstrap({
      list: [
        // Punchr bootstrap nodes
        // https://github.com/libp2p/punchr/blob/b43900e079e654b964531ea6a0b4531c18265b8e/rust-client/src/main.rs#L275-L287
        "/ip4/139.178.91.71/tcp/4001/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",

        // https://github.com/mxinden/kademlia-exporter/blob/9fea15bc50ae50637033d5437ebb21aa53959e73/config.toml#L6-L9
        "/ip4/139.178.91.71/tcp/4001/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",

        // ipfs bootstrap
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
        "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",

        // Filecoin mainnet
        // https://github.com/ChainSafe/forest/blob/276a9ac200427791a7/networks/src/mainnet/mod.rs
        "/dns4/bootstrap-0.mainnet.filops.net/tcp/1347/p2p/12D3KooWCVe8MmsEMes2FzgTpt9fXtmCY7wrq91GRiaC8PHSCCBj",
        "/dns4/bootstrap-1.mainnet.filops.net/tcp/1347/p2p/12D3KooWCwevHg1yLCvktf2nvLu7L9894mcrJR4MsBCcm4syShVc",
        "/dns4/bootstrap-2.mainnet.filops.net/tcp/1347/p2p/12D3KooWEWVwHGn2yR36gKLozmb4YjDJGerotAPGxmdWZx2nxMC4",
        "/dns4/bootstrap-3.mainnet.filops.net/tcp/1347/p2p/12D3KooWKhgq8c7NQ9iGjbyK7v7phXvG6492HQfiDaGHLHLQjk7R",
        "/dns4/bootstrap-4.mainnet.filops.net/tcp/1347/p2p/12D3KooWL6PsFNPhYftrJzGgF5U18hFoaVhfGk7xwzD8yVrHJ3Uc",
        "/dns4/bootstrap-5.mainnet.filops.net/tcp/1347/p2p/12D3KooWLFynvDQiUpXoHroV1YxKHhPJgysQGH2k3ZGwtWzR4dFH",
        "/dns4/bootstrap-6.mainnet.filops.net/tcp/1347/p2p/12D3KooWP5MwCiqdMETF9ub1P3MbCvQCcfconnYHbWg6sUJcDRQQ",
        "/dns4/bootstrap-7.mainnet.filops.net/tcp/1347/p2p/12D3KooWRs3aY1p3juFjPy8gPN95PEQChm2QKGUCAdcDCC4EBMKf",
        "/dns4/bootstrap-8.mainnet.filops.net/tcp/1347/p2p/12D3KooWScFR7385LTyR4zU1bYdzSiiAb5rnNABfVahPvVSzyTkR",
        "/dns4/lotus-bootstrap.ipfsforce.com/tcp/41778/p2p/12D3KooWGhufNmZHF3sv48aQeS13ng5XVJZ9E6qy2Ms4VzqeUsHk",
        "/dns4/bootstrap-0.starpool.in/tcp/12757/p2p/12D3KooWDqaZkm3oSczUm3dvAJ5aL2rdSeQ5VQbnHRTQNEFShhmc",
        "/dns4/bootstrap-1.starpool.in/tcp/12757/p2p/12D3KooWSkxqRYoFwtoHJ8cVcoeSpAkfrr4f3wzBUGxhNLYr8Dyb",
        "/dns4/node.glif.io/tcp/1235/p2p/12D3KooWBF8cpp65hp2u9LK5mh19x67ftAam84z9LsfaquTDSBpt",
        "/dns4/bootstrap-0.ipfsmain.cn/tcp/34721/p2p/12D3KooWQnwEGNqcM2nAcPtRR9rAX8Hrg4k9kJLCHoTR5chJfz6d",
        "/dns4/bootstrap-1.ipfsmain.cn/tcp/34723/p2p/12D3KooWMKxMkD5DMpSWsW7dBddKxKT7L2GgbNuckz9otxvkvByP",
        "/dns4/bootstarp-0.1475.io/tcp/61256/p2p/12D3KooWRzCVDwHUkgdK7eRgnoXbjDAELhxPErjHzbRLguSV1aRt",
      ],
    }),
  ],

  dht: kadDHT({
    clientMode: true,
  }),

  pubsub: gossipsub({
    // Do we need any extra config here?
  }),
});

await node.start();
console.log("My peer id:", node.peerId);

// node.addEventListener("peer:discovery", function ({ detail }) {
//   console.log("%s [PEER FOUND]", now(), detail.id);
// });

node.pubsub.addEventListener("message", ({ detail }) => {
  console.log(
    "%s [MSG:%s:%s] %s",
    now(),
    detail.topic,
    detail.type,
    Buffer.from(detail.data).toString("base64"),
  );
  if (detail.topic === "/indexer/ingest/mainnet") {
    let message = decode(detail.data);
    console.log(message);
    const cid = /** @type import("multiformats/cid").CID */ (message[0]);
    console.log("CID:", cid.toString());
  }
});

node.pubsub.subscribe("/fil/blocks/mainnet");
node.pubsub.subscribe("/fil/blocks/testnet");
node.pubsub.subscribe("/fil/msgs/mainnet");
node.pubsub.subscribe("/fil/msgs/testnet");
node.pubsub.subscribe("/indexer/ingest/mainnet");

function now() {
  return new Date().toISOString().split("T")[1];
}
