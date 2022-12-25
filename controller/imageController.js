const Item = require("../models/Item");
const Image = require("../models/Image");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  create: async (req, res) => {
    try {
      //id item
      const { itemId } = req.params;

      if (!req.file) {
        return res.status(400).json({ message: "Please Upload Image" });
      }
      const item = await Item.findOne({ _id: itemId });
      if (!item) {
        throw Error("Item Not Found!");
      }

      const imageSave = await Image.create({
        imageUrl: `images/${req.file.filename}`,
      });

      item.image.push({ _id: imageSave._id });
      item.save();
      return res.status(201).json(imageSave);
    } catch (error) {
      if (req.file) {
        fs.unlink(path.join(`public/images/${req.file.filename}`));
      }
      return res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      // id => image._id, itemId => item._id
      const { id, itemId } = req.params;

      const item = await Item.findOne({ _id: itemId });
      if (!item) {
        return res.status(404).json({ message: "Item Not Found!" });
      }

      const image = await Image.findOne({ _id: id });
      if (!image) {
        return res.status(404).json({ message: "Image Not Found!" });
      }

      function deleteImageOnItem() {
        item.image.forEach(async (itemImage) => {
          if (itemImage._id.toString() === image._id.toString()) {
            item.image.pull({ _id: image._id });
            await item.save();
          }
        });
      }

      await image
        .remove()
        .then(() => deleteImageOnItem())
        .then(() => fs.unlink(path.join(`public/${image.imageUrl}`)));
      return res.status(200).json({ message: "Image Has Been Deleted!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
