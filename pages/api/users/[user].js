import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

export default async function handler(req, res) {
  const { method } = req;
  console.log(req.query);
  const userEmail = req.query.user;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const user = await User.findOne({ email: userEmail });
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT" /* Edit a model by its ID */:
      try {
        const user = await User.findOneAndUpdate(
          { email: userEmail },
          { user_metadata: JSON.parse(req.body) },
          { new: true }
        );
        if (!user) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
        console.log(error);
      }
      break;
  }
}
