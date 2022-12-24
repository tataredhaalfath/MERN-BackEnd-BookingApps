const Category = require("../models/Category");

module.exports = {
  create: async (req, res) => {
    try {
      const category = new Category({
        ...req.body,
      });

      await category.save();
      return res.status(201).json(category);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  get: async (req, res) => {
    try {
      const categories = await Category.find();
      return categories.length === 0
        ? res.status(404).json({ message: "Data Category is Empty" })
        : res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdated = ["categoryName"];
      const isValidOperation = updates.every((update) => {
        return allowedUpdated.includes(update);
      });

      if (!isValidOperation) {
        return res.status(403).json({
          message: `Invalid Key Parameter`,
        });
      }

      const category = await Category.findById(req.params.id);
      category
        ? updates.forEach((update) => {
            category[update] = req.body[update];
          }) //update category
        : res.status(404).json({ message: "Category Not Found!" });

      await category.save();

      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);

      category
        ? res.status(200).json({ message: "Category Deleted" })
        : res.status(404).json({ message: "Category Not Found!" });
      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
