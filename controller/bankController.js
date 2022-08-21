const Bank = require("../models/Bank");
const path = require("path");
const fs = require("fs-extra");
module.exports = {
  get: async (req, res) => {
    try {
      const banks = await Bank.find();
      banks.length === 0
        ? res.status(404).json({ message: "Data Bank Not Found" })
        : res.json(banks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  create: async (req, res) => {
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
      return res.status(201).json({ bank });
    } catch (error) {
      await fs.unlink(path.join(`public/images/${req.file.filename}`)); // unlink image file when data doesn input into database
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      console.log(req.body);

      const updates = Object.keys(req.body);
      const allowedUpdated = ["bankName", "accountHolder", "accountNumber"];
      const isValidOperation = updates.every((update) => {
        return allowedUpdated.includes(update);
      });

      if (!isValidOperation) {
        return res.status(403).json({ message: "Invalid Key Parameter" });
      }

      const bank = await Bank.findById(req.params.id);
      if (!bank) {
        return res.status(404).json({ message: "Bank Not Found!" });
      }

      if (req.file) {
        await fs.unlink(path.join(`public/${bank.imageUrl}`)); // unlink old image if now image has been input
        bank.imageUrl = `images/${req.file.filename}`;
      }

      updates.forEach((update) => {
        bank[update] = req.body[update];
      });

      await bank.save();
      return res.json(bank);
    } catch (error) {
      await fs.unlink(path.join(`public/images/${req.file.filename}`)); // unlink image file when data doesn input into database
      res.status(500).json({ message: error.message });
    }
  },
};
