const assert = require("node:assert/strict");
const { test } = require("node:test");
const {
  setProfileImage,
  removeProfileImage,
} = require("./profile-image");

test("uploads, stores the secure URL and public id, then removes the replaced asset", async () => {
  const deleted = [];
  const user = {
    profilePic: "https://res.cloudinary.com/medicare/old.jpg",
    profilePicPublicId: "medicare/profiles/old",
    async save() {},
  };
  const warning = await setProfileImage(
    user,
    { buffer: Buffer.from("image") },
    {
      upload: async () => ({
        secure_url: "https://res.cloudinary.com/medicare/new.jpg",
        public_id: "medicare/profiles/new",
      }),
      destroy: async (publicId) => deleted.push(publicId),
    },
  );

  assert.equal(warning, null);
  assert.equal(user.profilePic, "https://res.cloudinary.com/medicare/new.jpg");
  assert.equal(user.profilePicPublicId, "medicare/profiles/new");
  assert.deepEqual(deleted, ["medicare/profiles/old"]);
});

test("cleans up a new upload if saving its reference fails", async () => {
  const deleted = [];
  const user = {
    profilePic: "legacy/uploads/old.jpg",
    profilePicPublicId: "",
    async save() {
      throw new Error("database write failed");
    },
  };

  await assert.rejects(
    setProfileImage(
      user,
      { buffer: Buffer.from("image") },
      {
        upload: async () => ({
          secure_url: "https://res.cloudinary.com/medicare/new.jpg",
          public_id: "medicare/profiles/new",
        }),
        destroy: async (publicId) => deleted.push(publicId),
      },
    ),
    /database write failed/,
  );
  assert.deepEqual(deleted, ["medicare/profiles/new"]);
  assert.equal(user.profilePicPublicId, "medicare/profiles/new");
});

test("clears the reference before deleting the current Cloudinary asset", async () => {
  const deleted = [];
  const user = {
    profilePic: "https://res.cloudinary.com/medicare/current.jpg",
    profilePicPublicId: "medicare/profiles/current",
    async save() {},
  };
  const warning = await removeProfileImage(user, {
    destroy: async (publicId) => deleted.push(publicId),
  });

  assert.equal(warning, null);
  assert.equal(user.profilePic, "");
  assert.equal(user.profilePicPublicId, "");
  assert.deepEqual(deleted, ["medicare/profiles/current"]);
});

test("reports failed Cloudinary cleanup without restoring a removed reference", async () => {
  const user = {
    profilePic: "https://res.cloudinary.com/medicare/current.jpg",
    profilePicPublicId: "medicare/profiles/current",
    async save() {},
  };
  const warning = await removeProfileImage(user, {
    destroy: async () => {
      throw new Error("Cloudinary unavailable");
    },
  });

  assert.match(warning, /could not be deleted/);
  assert.equal(user.profilePic, "");
  assert.equal(user.profilePicPublicId, "");
});
