#!/usr/bin/env node
/**
 * Android 정적 빌드 스크립트
 * - Edge runtime API route(api/og)와 sitemap.ts를 임시 제외한 뒤 next build 실행
 * - BUILD_TARGET=app 환경변수로 next.config.ts의 output:'export' 활성화
 */
const { execSync } = require("child_process");
const fs   = require("fs");
const path = require("path");
const os   = require("os");

const appDir = path.resolve(__dirname, "../src/app");
const tmpBase = path.join(os.tmpdir(), "silverdrive_bak_" + Date.now());

// 앱 빌드 시 제외할 파일/디렉토리 (정적 export 비호환 또는 웹 전용)
const EXCLUDE = [
  { src: path.join(appDir, "api"),         bak: path.join(tmpBase, "api"),         isDir: true  },
  { src: path.join(appDir, "sitemap.ts"),  bak: path.join(tmpBase, "sitemap.ts"),  isDir: false },
  { src: path.join(appDir, "share"),       bak: path.join(tmpBase, "share"),       isDir: true  },
];

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src,  entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

let restored = false;
function restore() {
  if (restored) return;
  restored = true;
  for (const { src, bak, isDir } of EXCLUDE) {
    if (!fs.existsSync(bak)) continue;
    if (!fs.existsSync(src)) {
      if (isDir) copyDir(bak, src);
      else fs.copyFileSync(bak, src);
    }
    fs.rmSync(bak, { recursive: true, force: true });
  }
  if (fs.existsSync(tmpBase)) fs.rmSync(tmpBase, { recursive: true, force: true });
}

process.on("exit",    restore);
process.on("SIGINT",  () => { restore(); process.exit(1); });
process.on("SIGTERM", () => { restore(); process.exit(1); });

try {
  fs.mkdirSync(tmpBase, { recursive: true });
  for (const { src, bak, isDir } of EXCLUDE) {
    if (!fs.existsSync(src)) continue;
    if (isDir) copyDir(src, bak);
    else fs.copyFileSync(src, bak);
    fs.rmSync(src, { recursive: true });
  }

  execSync("next build", {
    stdio: "inherit",
    env: {
      ...process.env,
      BUILD_TARGET: "app",
      NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS: "1",
    },
  });
} finally {
  restore();
}
