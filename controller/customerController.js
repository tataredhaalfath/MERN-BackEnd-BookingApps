const Customer = require("../models/Customer");

module.exports = {
  get: async (req, res) => {
    try {
      const customer = await Customer.find();

      return customer.length === 0
        ? res.status(404).json({ message: "Data Customer Is Empty!" })
        : res.json({ customer });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const customer = new Customer({
        ...req.body,
      });

      // const emailExist = await Customer.findOne({ email: req.body.email });
      // if (emailExist) {
      //   throw Error("Email Already Exist!");
      // }
      await customer.save();
      return res.status(201).json(customer);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdated = ["firstName", "lastName", "email", "phoneNumber"];
      const isValidOperation = updates.every((update) => {
        return allowedUpdated.includes(update);
      });

      if (!isValidOperation) {
        return res.status(403).json({
          message: `Invalid Key Parameter`,
        });
      }

      const customer = await Customer.findById(req.params.id);
      if (!customer) {
        throw Error("Customer Not Found!");
      }
      updates.forEach((update) => {
        customer[update] = req.body[update];
      }); //update customer

      await customer.save();

      return res.status(200).json(customer);
    } catch (error) {
      if (error.message === "Customer Not Found!") {
        return res.status(404).json({ message: error.message });
      } else {
        return res.status(500).json({ message: error.message });
      }
    }
  },

  delete: async (req, res) => {
    try {
      const customer = await Customer.findByIdAndDelete(req.params.id);

      return customer
        ? res.status(200).json({ message: "Customer Deleted" })
        : res.status(404).json({ message: "Customer Not Found!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
