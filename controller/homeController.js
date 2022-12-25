const Bank = require("../models/Bank");
const Category = require("../models/Category");
const Item = require("../models/Item");
const Info = require("../models/Info");

module.exports = {
  homePage: async (req, res) => {
    try {
      const hotItem = await Item.find()
        .select(
          "_id itemName location itemPrice unit imageId sumBooked isPopular"
        )
        .sort({ sumBooked: -1 })
        .limit(5)
        .populate({
          path: "image",
          select: "_id imageUrl",
        });

      const Hotel = await Category.find({ categoryName: "Hotel" });
      const Event = await Category.find({ categoryName: "Event" });
      const Tour = await Category.find({ categoryName: "Tour Package" });

      const sumHotel = Hotel.reduce(
        (count, current) => count + current.item.length,
        0
      );
      const sumEvent = Event.reduce(
        (count, current) => count + current.item.length,
        0
      );
      const sumTour = Tour.reduce(
        (count, current) => count + current.item.length,
        0
      );

      const testimony = await Info.find({
        type: "Testimony",
        isHightLight: true,
      })
        .select("_id infoName type imageUrl description utem")
        .limit(3)
        .populate({ path: "item", select: "_id itemName location" });

      const categoryList = await Category.find({ "item.3": { $exists: true } })
        .limit(3)
        .populate({
          path: "item",
          select:
            "_id itemName location itemPrice unit imageId isPopular",
          perDocumentLimit: 4,
          options: { sort: { sumBooked: -1 } },
          populate: { path: "image", perDocumentLimit: 1 },
        });

      return res.status(200).json({
        summaryInfo: {
          sumHotel,
          sumEvent,
          sumTour,
        },
        hotItem,
        categoryList,
        testimony,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
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
          match: { type: { $in: ["NearBy", "Testimony"] } },
        })
        .populate({
          path: "feature",
        }); // populate to relation db

      const bank = await Bank.find();

      return res.json({ ...item._doc, bank });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
