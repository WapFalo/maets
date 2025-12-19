import fetch from "node-fetch";
import { performance } from "perf_hooks";

const URL = process.env.TARGET_URL || "http://host.docker.internal:3000/health";
const TOTAL_REQUESTS = parseInt(process.env.TOTAL_REQUESTS || "10000");
const CONCURRENCY = parseInt(process.env.CONCURRENCY || "300");

async function worker(requests) {
  for (let i = 0; i < requests; i++) {
    try {
      await fetch(URL);
    } catch (_) {}
  }
}

async function main() {
  const start = performance.now();

  const perWorker = Math.floor(TOTAL_REQUESTS / CONCURRENCY);
  const workers = [];

  for (let i = 0; i < CONCURRENCY; i++) {
    workers.push(worker(perWorker));
  }

  await Promise.all(workers);

  const end = performance.now();
  const duration = (end - start) / 1000;

  console.log("======== FLOOD REPORT ========");
  console.log("Target URL     :", URL);
  console.log("Total requests :", TOTAL_REQUESTS);
  console.log("Concurrency    :", CONCURRENCY);
  console.log("Time           :", duration.toFixed(2), "s");
  console.log("Req/sec        :", (TOTAL_REQUESTS / duration).toFixed(2));
}

main();
