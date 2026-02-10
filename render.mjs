import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const run = async () => {
  const bundleLocation = await bundle({
    entryPoint: path.resolve(__dirname, "./src/index.ts"),
    webpackOverride: (config) => config,
  });

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "MyVideo",
    chromeMode: "chrome-for-testing",
    browserExecutable:
      "/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome",
  });

  console.log(`Rendering ${composition.id}...`);
  console.log(
    `Resolution: ${composition.width}x${composition.height}, ${composition.durationInFrames} frames @ ${composition.fps}fps`
  );

  const outputLocation = path.resolve(__dirname, "out/video.mp4");

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation,
    chromeMode: "chrome-for-testing",
    browserExecutable:
      "/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome",
    onProgress: ({ progress }) => {
      process.stdout.write(`\rRendering: ${(progress * 100).toFixed(1)}%`);
    },
  });

  console.log(`\nVideo rendered to ${outputLocation}`);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
