import dbConnect from "../../../lib/dbConnect";
import Project from "../../../models/Project";

export default async function handler(req, res) {
  const { method } = req;
  const projectName = req.query.project;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const project = await Project.find({ name: projectName });
        res.status(200).json({ success: true, data: project });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST": {
      try {
        const project = await Project.create(JSON.parse(req.body));
        res.status(201).json({ success: true, data: project });
      } catch (error) {
        res.status(400).json({ success: false });
        console.log(error);
      }
      break;
    }
    case "PUT" /* Edit a model by its ID */:
      try {
        const { nameT } = req.body;
        console.log(nameT);
        const project = await Project.findOneAndUpdate(
          { name: projectName },
          { devs_assigned: JSON.parse(req.body) },
          { new: true }
        );
        if (!project) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: project });
      } catch (error) {
        res.status(400).json({ success: false });
        console.log(error);
      }
      break;
    case "DELETE" /* Delete a model by its ID */:
      try {
        const id = req.body.id;
        const deletedProject = await Project.deleteOne({ _id: id });
        if (!deletedProject) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
        console.log(error);
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
