/* eslint-disable no-console */
'use strict';

const fs = require('fs');
const path = require('path');

function app() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error('Expected 2 arguments');

    return;
  }

  const [src, dest] = args;

  if (src === dest) {
    return;
  }

  try {
    const st = fs.statSync(src);

    if (!st.isFile()) {
      console.error(`Source must be a file: ${src}`);

      return;
    }
  } catch {
    console.error(`Source file does not exist: ${src}`);

    return;
  }

  const srcBase = path.basename(src);

  try {
    const dstSt = fs.statSync(dest);

    if (dstSt.isDirectory()) {
      const finalDest = path.join(dest, srcBase);

      fs.renameSync(src, finalDest);

      return;
    }

    try {
      fs.unlinkSync(dest);
    } catch {}

    fs.renameSync(src, dest);

    return;
  } catch {}

  if (dest.endsWith('/')) {
    console.error('Wrong destination directory');

    return;
  }

  const parent = path.dirname(dest);

  try {
    const parentSt = fs.statSync(parent);

    if (!parentSt.isDirectory()) {
      console.error('Wrong destination directory');

      return;
    }
  } catch {
    console.error('Wrong destination directory');

    return;
  }

  fs.renameSync(src, dest);
}

app();
