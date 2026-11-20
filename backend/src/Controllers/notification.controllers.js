const Notification = require("../Model/Notification");

const getNotifications = async (req, res) => {
  const items = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(40);
  res.status(200).json({ success: true, data: items });
};

const markRead = async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  res.status(200).json({ success: true });
};

module.exports = { getNotifications, markRead };
