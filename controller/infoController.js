const Item = require("../models/Item");
const Info = require("../models/Info");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  get: async (req, res) => {},
  create: async (req, res) => {
    try {
      console.log(req.body);
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
      res.json({ info });
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
  update: async (req, res) => {},
  delete: async (req, res) => {},
};
