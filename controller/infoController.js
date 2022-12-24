const Item = require("../models/Item");
const Info = require("../models/Info");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  get: async (req, res) => {
    try {
      const info = await Info.find().populate({
        path: "item",
        select: "_id itemName",
      });

      return info.length === 0
        ? res.status(404).json({ message: "Data Info Is Empty!" })
        : res.json({ info });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const { infoName, type, isHightLight, description, item } = req.body;

      if (!req.file) {
        return res.status(403).json({ message: "Image Not Found!" });
      }

      const info = new Info({
        infoName,
        type,
        isHightLight,
        description,
        item,
        imageUrl: `images/${req.file.filename}`,
      });

      const itemDB = await Item.findById(item);
      if (!itemDB) {
        throw Error("Item Not Found!");
      }

      itemDB.info.push({ _id: info._id });
      await itemDB.save();

      await info.save();
      return res.json({ info });
    } catch (error) {
      if (req.file) {
        fs.unlink(path.join(`public/images/${req.file.filename}`));
      }
      switch (error.message) {
        case "Item Not Found!":
          return res.status(404).json({ message: error.message });

        default:
          return res.status(500).json({ message: error.message });
      }
    }
  },

  update: async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdated = [
        "infoName",
        "type",
        "isHightLight",
        "description",
        "item",
      ];
      const isValidOperation = updates.every((update) => {
        return allowedUpdated.includes(update);
      });

      if (!isValidOperation) {
        throw Error("Invalid Key Parameter");
      }

      const info = await Info.findById(req.params.id);

      if (!info) {
        throw Error("Info Not Found!");
      }
      const itemDB = await Item.findById(req.body.item);
      if (!itemDB) {
        throw Error("Item Not Found!");
      }

      if (req.file) {
        await fs.unlink(path.join(`public/${info.imageUrl}`)); // unlink old image if now image has been input
        info.imageUrl = `images/${req.file.filename}`;
      }

      updates.forEach((update) => {
        info[update] = req.body[update];
      });

      await info.save();
      return res.json(info);
    } catch (error) {
      if (req.file) {
        await fs.unlink(path.join(`public/images/${req.file.filename}`)); // unlink image file when data doesn input into database
      }
      switch (error.message) {
        case "Info Not Found!":
          res.status(404).json({ message: error.message });
          break;
        case "Item Not Found!":
          res.status(404).json({ message: error.message });
          break;
        case "Invalid Key Parameter":
          res.status(403).json({ message: error.message });
          break;
        default:
          res.status(500).json({ message: error.message });
          break;
      }
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const info = await Info.findOne({ _id: id });
      if (!info) {
        return res.status(404).json({ message: "Info Not Found!" });
      }

      const item = await Item.findOne({ _id: info.item });
      if (!item) {
        return res.status(404).json({ message: "Item Not Found!" });
      }

      function deleteItemInfo() {
        item.info.forEach(async (itemInfo) => {
          if (itemInfo._id.toString() == info._id.toString()) {
            item.info.pull({ _id: info._id });
            await item.save();
          }
        });
      }

      await info
        .remove()
        .then(() => deleteItemInfo())
        .then(() => fs.unlink(path.join(`public/${info.imageUrl}`)));

      return res.status(200).json({ message: "Info Has Been Deleted!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
