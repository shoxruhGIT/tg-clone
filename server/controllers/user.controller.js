const { CONST } = require("../lib/constants");
const messageModal = require("../models/message.modal");

class UserController {
  // [GET]

  async getMessages(req, res, next) {
    try {
      const user = "68f27d6dd1f882c419c42191";
      const { contactId } = req.params;

      const messages = await messageModal
        .find({
          $or: [
            { sender: user, receiver: contactId },
            { sender: contactId, receiver: user },
          ],
        })
        .populate({ path: "sender", select: "email" })
        .populate({ path: "receiver", select: "email" });

      await messageModal.updateMany(
        { sender: contactId, receiver: user, status: "SENT" },
        { status: CONST.READ }
      );

      res.status(200).json({ messages });
    } catch (error) {
      next(error);
    }
  }

  // [POST]
  async createMessage(req, res, next) {
    try {
      const newMessage = await messageModel.create(req.body);
      const currentMessage = await messageModel
        .findById(newMessage._id)
        .populate({ path: "sender", select: "email" })
        .populate({ path: "receiver", select: "email" });
      res.status(201).json({ newMessage: currentMessage });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
