const Item = require("../models/Item");
const Booking = require("../models/Booking");

module.exports = {
  get: async (req, res) => {
    try {
      let sumBooked, sumProcess, sumAccept, sumReject, sumItem;
      const totalBooked = await Booking.find();
      const process = await Booking.find({ "payments.status": "Process" });
      const accept = await Booking.find({ "payments.status": "Accept" });
      const reject = await Booking.find({ "payments.status": "Reject" });
      const item = await Item.find();

      sumBooked = totalBooked.length != 0 ? totalBooked.length : 0;
      sumProcess = process.length != 0 ? process.length : 0;
      sumAccept = accept.length != 0 ? accept.length : 0;
      sumReject = reject.length != 0 ? reject.length : 0;
      sumItem = item.length != 0 ? item.length : 0;

      res.status(200).json({
        booked: String(sumBooked),
        process: String(sumProcess),
        accept: String(sumAccept),
        reject: String(sumReject),
        item: String(sumItem),
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
