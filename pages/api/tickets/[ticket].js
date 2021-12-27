import dbConnect from "../../../lib/dbConnect";
import Ticket from "../../../models/Ticket";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;
  const id = req.body._id;

  switch (method) {
    case "GET":
      try {
        const ticket = Ticket.findById({ id });
        res.status(200).json({ success: true, data: ticket });
      } catch (error) {
        res.status(400).json({ success: false, msg: error });
      }
      break;
    case "PUT":
      try {
        const ticket = await Ticket.findByIdAndUpdate(
          { id },
          { ticket: req.body },
          { new: true }
        );
        if (!project) {
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
