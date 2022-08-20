const Category = require("../models/Category");

module.exports = {
  addCategory: async (req, res) => {
    console.log(req.body);

    const category = new Category({
      ...req.body,
    });

    try {
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
        ? res.status(404).json({message:"Data Category is Empty"})
        : res.status(200).json(categories);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};
