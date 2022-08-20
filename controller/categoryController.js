const Category = require("../models/Category");

module.exports = {
  addCategory: async (req, res) => {
    try {
      console.log(req.body);

      const category = new Category({
        ...req.body,
      });

      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json(error.message);
    }
  },

  getCategory: async (req, res) => {
    try {
      const categories = await Category.find();
      categories.length === 0
        ? res.status(404).json({ message: "Data Category is Empty" })
        : res.status(200).json(categories);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  updateCategory: async (req, res) => {
    try {
      console.log(req.body);
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

      updates.forEach((update) => {
        category[update] = req.body[update];
      }); //update category

      await category.save();

      return res.status(200).json(category);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};
