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

      return features.length === 0
        ? res.status(404).json({ message: "Data Feature Is Empty!" })
        : res.json({ features });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    try {
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

      await feature.save();
      return res.json({ feature });
    } catch (error) {
      if (req.file) {
        await fs.unlink(path.join(`public/images/${req.file.filename}`));
      }
      switch (error.message) {
        case "Item Not Found":
          return res.status(404).json({ message: error.message });

        default:
          return res.status(500).json({ message: error.message });
      }
    }
  },

  update: async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdated = ["featureName", "qty", "item"];
      const isValidOperation = updates.every((update) => {
        return allowedUpdated.includes(update);
      });

      if (!isValidOperation) {
        throw Error("Invalid Key Parameter");
      }

      const feature = await Feature.findById(req.params.id);
      if (!feature) {
        throw Error("Feature Not Found!");
      }

      const itemDB = await Item.findOne({ _id: req.body.item });
      if (!itemDB) {
        throw Error("Item Not Found!");
      }

      if (req.file) {
        await fs.unlink(path.join(`public/${feature.imageUrl}`)); // unlink old image if now image has been input
        feature.imageUrl = `images/${req.file.filename}`;
      }

      updates.forEach((update) => {
        feature[update] = req.body[update];
      });

      await feature.save();
      return res.json(feature);
    } catch (error) {
      if (req.file) {
        await fs.unlink(path.join(`public/images/${req.file.filename}`)); // unlink image file when data doesn input into database
      }

      switch (error.message) {
        case "Feature Not Found!":
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
      const feature = await Feature.findOne({ _id: id });
      if (!feature) {
        return res.status(404).json({ message: "Feature Not Found!" });
      }

      const item = await Item.findOne({ _id: feature.item });
      if (!item) {
        return res.status(404).json({ message: "Item Not Found!" });
      }

      function deleteItemFeature() {
        item.feature.forEach(async (itemFeature) => {
          if (itemFeature._id.toString() === feature._id.toString()) {
            item.feature.pull({
              _id: feature._id,
            }); /* delete data field feature in item table where related with table feature , 
            pull is  is used to remove an element from collection by given key and return the pulled element. */
            await item.save();
          }
        });
      }

      await feature
        .remove()
        .then(() => deleteItemFeature())
        .then(() => fs.unlink(path.join(`public/${feature.imageUrl}`)));

      return res.status(200).json({ message: "Feature Has Been Deleted!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
