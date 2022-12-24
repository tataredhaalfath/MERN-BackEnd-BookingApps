const Item = require("../models/Item");
const Booking = require("../models/Booking");
const Customer = require("../models/Customer");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  create: async (req, res) => {
    try {
      const {
        itemId,
        itemBooked,
        bookingStartDate,
        bookingEndDate,
        firstName,
        lastName,
        email,
        phoneNumber,
        bankFrom,
        accountHolder,
      } = req.body;

      if (!req.file) {
        throw Error("Image Not Found!");
      }

      if (
        itemId === undefined ||
        itemBooked === undefined ||
        bookingStartDate === undefined ||
        bookingEndDate === undefined ||
        firstName === undefined ||
        lastName === undefined ||
        email === undefined ||
        phoneNumber === undefined ||
        bankFrom === undefined ||
        accountHolder === undefined
      ) {
        throw Error("Please Input All Data!");
      }

      const item = await Item.findOne({ _id: itemId });
      if (!item) {
        throw Error("Item Not Found!");
      }

      let total = item.itemPrice * itemBooked;
      let tax = total * 0.1;

      const invoice = Math.floor(1000000 + Math.random() * 90000);

      const customer = await Customer.create({
        firstName,
        lastName,
        email,
        phoneNumber,
      });

      const newBooking = {
        invoice,
        bookingStartDate,
        bookingEndDate,
        total: (total += tax),
        item: {
          _id: item._id,
          name: item.itemName,
          price: item.itemPrice,
          booked: itemBooked,
        },
        customer: customer._id,
        payments: {
          proofPayment: `images/${req.file.filename}`,
          bankFrom: bankFrom,
          accountHolder: accountHolder,
        },
      };

      const booking = await Booking.create(newBooking);
      return res.status(201).json({ message: "Success Booking", booking });
    } catch (error) {
      if (req.file) {
        await fs.unlink(path.join(`public/images/${req.file.filename}`));
      }
      switch (error.message) {
        case "Image Not Found!":
        case "Please Input All Data!":
        case "Item Not Found!":
          return res.status(400).json({ message: error.message });

        default:
          return res.status(500).json({ message: error.message });
      }
    }
  },

  get: async (req, res) => {
    try {
      const booking = await Booking.find();
      return booking.length === 0
        ? res.status(404).json({ message: "Data Booking Is Empty!" })
        : res.json(booking);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getDetail: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id).populate(
        "customer"
      );
      return booking.length === 0
        ? res.status(404).json({ message: "Data Booking Is Empty!" })
        : res.json(booking);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  reject: async (req, res) => {
    try {
      const booking = await Booking.findOne({ _id: req.params.id });
      if (!booking) {
        throw Error("Booking Not Found!");
      }

      if (booking.payments.status == "Reject") {
        throw Error("Booking Order Already Rejected!");
      }

      if (booking.payments.status === "Accept") {
        throw Error("Booking Order Already Accept!");
      }

      booking.payments.status = "Reject";
      await booking.save();

      return res
        .status(200)
        .json({ message: "Booking Has Been Rejected", booking });
    } catch (error) {
      switch (error.message) {
        case "Booking Not Found!":
          res.status(404).json({ message: error.message });
          break;
        case "Booking Order Already Rejected!":
        case "Booking Order Already Accept!":
          return res.status(403).json({ message: error.message });
        default:
          return res.status(500).json({ message: error.message });
      }
    }
  },

  accept: async (req, res) => {
    try {
      const booking = await Booking.findOne({ _id: req.params.id });
      if (!booking) {
        throw Error("Booking Not Found!");
      }

      if (booking.payments.status == "Reject") {
        throw Error("Booking Order Already Rejected!");
      }

      if (booking.payments.status === "Accept") {
        throw Error("Booking Order Already Accept!");
      }

      const {
        item: { _id, booked },
      } = booking;

      const item = await Item.findOne({ _id: _id });
      if (!item) {
        throw Error("Item Not Found!");
      }

      item.sumBooked += parseInt(booked);
      await item.save();
      booking.payments.status = "Accept";
      await booking.save();

      return res
        .status(200)
        .json({ message: "Booking Has Been Accepted", booking });
    } catch (error) {
      switch (error.message) {
        case "Booking Not Found!":
        case "Item Not Found!":
          return res.status(404).json({ message: error.message });
        case "Booking Order Already Rejected!":
        case "Booking Order Already Accept!":
          return res.status(403).json({ message: error.message });
        default:
          return res.status(500).json({ message: error.message });
      }
    }
  },

  delete: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        throw Error("Booking Not Found!");
      }

      const {
        payments: { status, proofPayment },
      } = booking;

      if (status != "Process") {
        throw Error("Only can delete booking with status Process!");
      }

      await booking
        .remove()
        .then(() => fs.unlink(path.join(`public/${proofPayment}`)));
      return res.json({ message: "Booking Deleted" });
    } catch (error) {
      switch (error.message) {
        case "Booking Not Found!":
          return res.status(404).json({ message: error.message });
        case "Only can delete booking with status Process!":
          return res.status(403).json({ message: error.message });
        default:
          return res.status(500).json({ message: error.message });
      }
    }
  },
};
