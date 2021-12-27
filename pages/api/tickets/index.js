import dbConnect from "../../../lib/dbConnect";
import Ticket from "../../../models/Ticket";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const tickets = await Ticket.find({});
        res.status(200).json({ success: true, data: tickets });
      } catch (error) {
        res.status(400).json({ success: false, msg: error });
      }
      break;
    case "POST":
      try {
        const ticket = await Ticket.create(JSON.parse(req.body));
        res.status(200).json({ success: true, data: ticket });
      } catch (error) {
        res.status(400).json({ success: false, msg: error });
      }
      break;
  }
}
