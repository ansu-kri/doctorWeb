const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const { File } = require("node:buffer");
const express = require("express");
const {
  upload,
  validateImageContent,
  detectImageType,
  MAX_IMAGE_SIZE_BYTES,
} = require("./upload");

const app = express();
app.post(
  "/upload",
  upload.single("profilePic"),
  validateImageContent,
  (req, res) => res.status(201).json({ uploaded: Boolean(req.file) }),
);
app.use((error, _req, res, _next) =>
  res.status(error.statusCode || (error.code === "LIMIT_FILE_SIZE" ? 413 : 400)).json({
    message: error.message,
  }),
);

let server;
let endpoint;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  endpoint = `http://127.0.0.1:${server.address().port}/upload`;
});

after(async () => {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});

const uploadFile = async (buffer, filename, contentType) => {
  const form = new FormData();
  form.append("profilePic", new File([buffer], filename, { type: contentType }));
  return fetch(endpoint, { method: "POST", body: form });
};

test("accepts supported image signatures", () => {
  assert.equal(detectImageType(Buffer.from([0xff, 0xd8, 0xff])), "image/jpeg");
  assert.equal(
    detectImageType(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    "image/png",
  );
  assert.equal(detectImageType(Buffer.from("GIF89a")), "image/gif");
  assert.equal(detectImageType(Buffer.from("RIFFxxxxWEBP")), "image/webp");
  assert.equal(detectImageType(Buffer.from("<svg></svg>")), null);
});

test("accepts a valid multipart image in memory", async () => {
  const response = await uploadFile(
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    "profile.png",
    "image/png",
  );
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { uploaded: true });
});

test("rejects mismatched image bytes and unsupported upload types", async () => {
  const mismatched = await uploadFile(Buffer.from("not an image"), "profile.png", "image/png");
  assert.equal(mismatched.status, 400);

  const unsupported = await uploadFile(Buffer.from("<svg></svg>"), "profile.svg", "image/svg+xml");
  assert.equal(unsupported.status, 400);
});

test("rejects files larger than two megabytes", async () => {
  const oversized = Buffer.alloc(MAX_IMAGE_SIZE_BYTES + 1);
  oversized.set([137, 80, 78, 71, 13, 10, 26, 10]);
  const response = await uploadFile(oversized, "large.png", "image/png");
  assert.equal(response.status, 413);
});
