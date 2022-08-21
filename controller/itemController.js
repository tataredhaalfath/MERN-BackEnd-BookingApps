const Item = require("../models/Item");
const Category = require("../models/Category");
const Image = require("../models/Image");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  get: async (req, res) => {
    try {
      const items = await Item.find()
        .populate({
          path: "image",
          select: "id imageUrl",
        })
        .populate({
          path: "category",
          select: "id categoryName",
        }); // populate to relation db

      items.lengh === 0
        ? res.status(404).json({ message: "Data Item Is Empty" })
        : res.json({ items });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      console.log(req.body);
      const { itemName, itemPrice, unit, location, description, category } =
        req.body;

      if (!req.files) {
        return res.status(400).json({ message: "Images Not Found" });
      }

      const getCategory = await Category.findOne({ _id: category });

      if (!getCategory) {
        throw Error("Category Not Found!"); // throw error, so the image uploaded can be deleted from cathing error
      }

      const newItem = new Item({
        category, // category ID
        itemName,
        itemPrice,
        unit,
        location,
        description,
      });

      const item = await Item.create(newItem);
      getCategory.item.push({ _id: item._id }); // input id item to field item in table category
      await getCategory.save();

      for (let i = 0; i < req.files.length; i++) {
        const imageSave = await Image.create({
          imageUrl: `images/${req.files[i].filename}`,
        });

        item.image.push({ _id: imageSave._id }); // save id from table image to array image on item
        await item.save();
      }

      return res.status(201).json({ item });
    } catch (error) {
      for (let i = 0; i < req.files.length; i++) {
        await fs.unlink(path.join(`public/images/${req.files[i].filename}`)); // delete images saved when error input to database
      }
      res.status(500).json({ message: error.message });
    }
  },
};
