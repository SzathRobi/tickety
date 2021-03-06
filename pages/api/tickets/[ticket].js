import dbConnect from "../../../lib/dbConnect";
import Ticket from "../../../models/Ticket";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;
  const id = req.query.ticket;

  switch (method) {
    case "GET":
      try {
        const ticket = await Ticket.findById(id);
        res.status(200).json({ success: true, data: ticket });
      } catch (error) {
        res.status(400).json({ success: false });
        console.log(error);
      }
      break;
    case "PUT":
      //console.log("req.body:", req.body);
      try {
        const ticket = await Ticket.findByIdAndUpdate(
          { _id: id },
          JSON.parse(req.body),
          { new: true }
        );
        if (!ticket) {
          return res
            .status(400)
            .json({ success: false, msg: "Did not found anything" });
        }
        res.status(200).json({ success: true, data: ticket });
      } catch (error) {
        res.status(400).json({ success: false, msg: error });
      }
      break;
    case "DELETE":
      try {
        const deletedTicket = await Ticket.deleteOne({ id });
        if (!deletedTicket) {
          return res
            .status(400)
            .json({ success: false, msg: "Did not found anything" });
        }
        res
          .status(200)
          .json({ success: true, msg: "Ticket successfully deleted" });
      } catch (error) {
        res.status(400).json({ success: false, msg: error });
      }
      break;
  }
}
