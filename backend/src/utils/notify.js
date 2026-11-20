const Notification = require("../Model/Notification");

const notifyUser = async ({ user, title, message, type = "appointment", appointment }) => {
  if (!user) return;
  await Notification.create({ user, title, message, type, appointment });
};

module.exports = { notifyUser };
