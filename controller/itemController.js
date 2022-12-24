const Item = require("../models/Item");
const Category = require("../models/Category");
const Image = require("../models/Image");
const Info = require("../models/Info");
const Feature = require("../models/Feature");
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
        })
        .populate({
          path: "info",
          select: "id infoName",
        })
        .populate({
          path: "feature",
          select: "id featureName",
        }); // populate to relation db

      items.length === 0
        ? res.status(404).json({ message: "Data Item Is Empty" })
        : res.json({ items });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res, next) => {
    try {
      const { itemName, itemPrice, unit, location, description, category } =
        req.body;

      // if (req.files.legth) {
      //   return res.status(400).json({ message: "Images Not Found" });
      // }
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
      // first step to delete image using for statement
      // for (let i = 0; i < req.files.length; i++) {
      //   await fs.unlink(path.join(`public/images/${req.files[i].filename}`)); // delete images saved when error input to database
      // }

      // second step to delete iamge using forEach
      req.files.forEach(async (file) => {
        await fs.unlink(path.join(`public/images/${file.filename}`));
      }); // delete image inpuited when throwing error

      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdated = [
        "itemName",
        "unit",
        "itemPrice",
        "location",
        "description",
        "category",
        "isPopular",
      ];
      const isValidate = updates.every((update) => {
        return allowedUpdated.includes(update);
      });

      if (!isValidate) {
        throw Error("Invalid Key Parameter!");
      }

      const item = await Item.findById(req.params.id)
        .populate({
          path: "category",
          select: "id categoryName",
        })
        .populate({
          path: "image",
          select: "id imageUrl",
        })
        .populate({
          path: "info",
          select: "id infoName",
        })
        .populate({
          path: "feature",
          select: "id featureName",
        });

      if (!item) {
        throw Error("Item Not Found");
      }
      updates.forEach((update) => {
        item[update] = req.body[update];
      });

      //delete old image and save new image
      if (req.files.length) {
        item.image.forEach(async (fileImg) => {
          await Image.findOne({ _id: fileImg._id }) // find image from table image
            .then((image) => {
              fs.unlink(path.join(`public/${image.imageUrl}`)); // delete old image
              image.remove(); // remove data from table image
            })
            .catch((err) => {
              res.status(500).json({ message: err.message });
            });
          await item.image.pull({ _id: fileImg._id }); // delete id of image from item table
        });

        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });

          item.image.push({ _id: imageSave._id }); // save id from table image to array image on item
          await item.save();
        }
      } else {
        // guard the old image when new image not be inputed
        // item.image.forEach((img) => {
        //   item.image.push({ _id: img._id });
        // });
        await item.save();
      }

      return res.json({ item });
    } catch (error) {
      req.files.forEach(async (file) => {
        await fs.unlink(path.join(`public/images/${file.filename}`));
      }); // delete image inpuited when throwing error

      if (error.message === "Item Not Found") {
        res.status(400).json({ message: error.message });
      } else if (error.message === "Invalid Key Parameter!") {
        res.status(403).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const item = await Item.findOne({ _id: id });
      if (!item) {
        return res.status(404).json({ message: "Item Not Found!" });
      }

      const category = await Category.findOne({ _id: item.category });
      if (!category) {
        return res.status(404).json({ message: "Category Not Found!" });
      }

      function deleteCategoryItem() {
        category.item.forEach(async (catItem) => {
          if (catItem._id.toString() == item._id.toString()) {
            category.item.pull({
              _id: item._id,
            }); /* delete data field item in category table where related with table item , 
            pull is  is used to remove an element from collection by given key and return the pulled element. */
            await category.save();
          }
        });
      }

      function deleteImage() {
        item.image.forEach(async (image) => {
          await Image.findOne({ _id: image._id })
            .then((img) => {
              fs.unlink(path.join(`public/${img.imageUrl}`));
              img.remove();
            })
            .catch((err) => {
              res.status(500).json({ message: err.message });
            });
        });
      }

      function deleteInfo() {
        item.info.forEach(async (itemInfo) => {
          await Info.findOne(itemInfo._id)
            .then((info) => {
              fs.unlink(path.join(`public/${info.imageUrl}`));
              info.remove();
            })
            .catch((err) => res.status(500).json({ message: err.message }));
        });
      }

      function deleteFeature() {
        item.feature.forEach(async (itemFeature) => {
          await Feature.findByIdAndDelete(itemFeature._id)
            .then((feature) => {
              fs.unlink(path.join(`public/${feature.imageUrl}`));
              feature.remove();
            })
            .catch((err) => res.status(500).json({ message: err.message }));
        });
      }

      // await Promise.all([item.remove(), deleteCategoryItem(), deleteImage()]);
      await item
        .remove()
        .then(() => deleteCategoryItem())
        .then(() => deleteImage())
        .then(() => deleteInfo())
        .then(() => deleteFeature());
      return res.status(200).json({ message: "Item Has Been Deleted!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
