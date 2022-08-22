const Item = require("../models/Item");
const Feature = require("../models/Feature");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  get: async (req, res) => {
    try {
      const features = await Feature.find().populate({
        path: "item",
        select: "_id itemName",
      });

      features.length === 0
        ? res.status(404).json({ message: "Data Feature Is Empty!" })
        : res.json({ features });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      console.log(req.body);

      const { featureName, qty, item } = req.body;
      if (!req.file) {
        return res.status(403).json({ message: "Image Not Found!" });
      }

      const feature = new Feature({
        featureName,
        qty,
        item,
        imageUrl: `images/${req.file.filename}`,
      });

      const itemDB = await Item.findOne({ _id: item });
      if (!itemDB) {
        throw Error("Item Not Found!");
      }
      itemDB.feature.push({ _id: feature._id });
      await itemDB.save();

      feature.save();

      return res.json({ feature });
    } catch (error) {
      await fs.unlink(path.join(`public/images/${req.file.filename}`));
      switch (error.message) {
        case "Item Not Found":
          res.status(404).json({ message: error.message });
          break;
        default:
          res.status(500).json({ message: error.message });
          break;
      }
    }
  },
};
