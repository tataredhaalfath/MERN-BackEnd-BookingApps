const Category = require("../models/Category");

module.exports = {
  addCategory: async (req, res) => {
    console.log(req.body);

    const category = await new Category({
      ...req.body,
    });

    try {
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json(error.message);
    }
  },
};
