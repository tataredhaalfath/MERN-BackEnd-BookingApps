const Bank = require("../models/Bank");
const path = require("path");
const fs = require("fs-extra");
module.exports = {
  addBank: async (req, res) => {
    try {
      console.log(req.body);

      const { bankName, accountHolder, accountNumber } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "Image Not Found!" });
      }

      const bank = new Bank({
        bankName,
        accountHolder,
        accountNumber,
        imageUrl: `images/${req.file.filename}`,
      });

      await bank.save();
      return res.json({ bank });
    } catch (error) {
      await fs.unlink(path.join(`public/images/${req.file.filename}`)); // unlink image file when data doesn input into database
      res.status(500).json({message: error.message});
    }
  },
};
