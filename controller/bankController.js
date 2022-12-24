const Bank = require("../models/Bank");
const path = require("path");
const fs = require("fs-extra");

module.exports = {
  get: async (req, res) => {
    try {
      const banks = await Bank.find();
      return banks.length === 0
        ? res.status(404).json({ message: "Data Bank Is Empty!" })
        : res.json(banks);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    try {
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
      return res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdated = ["bankName", "accountHolder", "accountNumber"];
      const isValidOperation = updates.every((update) => {
        return allowedUpdated.includes(update);
      });

      if (!isValidOperation) {
        throw Error("Invalid Key Parameter");
      }

      const bank = await Bank.findById(req.params.id);
      if (!bank) {
        throw Error("Bank Not Found!");
      }

      if (req.file) {
        await fs.unlink(path.join(`public/${bank.imageUrl}`)); // unlink old image if new image has been input
        bank.imageUrl = `images/${req.file.filename}`;
      }

      updates.forEach((update) => {
        bank[update] = req.body[update];
      });

      await bank.save();
      return res.json(bank);
    } catch (error) {
      await fs.unlink(path.join(`public/images/${req.file.filename}`)); // unlink image file when data doesn input into database
      if (error.message === "Bank Not Found!") {
        return res.status(404).json({ message: error.message });
      } else if (error.message === "Invalid Key Parameter") {
        return  res.status(403).json({ message: error.message });
      } else {
        return res.status(500).json({ message: error.message });
      }
    }
  },

  delete: async (req, res) => {
    try {
      const bank = await Bank.findByIdAndDelete(req.params.id);
      if (!bank) {
        return res.status(404).json({ message: "Bank Not Found!" });
      }
      await bank
        .remove()
        .then(() => fs.unlink(path.join(`public/${bank.imageUrl}`))); // delete from database then delete image file

      return res.status(200).json({ message: "Bank Has Been Deleted!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
