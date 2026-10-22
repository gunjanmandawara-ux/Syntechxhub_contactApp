import { Router } from "express";
import mongoose from "mongoose";
import Contact from "../models/Contact.js";

const router = Router();

function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

function getContactInput(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }

  const { name, email, phone, address } = body;
  return { name, email, phone, address };
}

router
  .route("/")
  .get(async (_req, res) => {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  })
  .post(async (req, res) => {
    const input = getContactInput(req.body);
    if (!input) {
      return res.status(400).json({ message: "Request body must be a JSON object." });
    }

    const contact = await Contact.create(input);
    res.status(201).json(contact);
  });

router
  .route("/:id")
  .put(async (req, res) => {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid contact ID." });
    }

    const input = getContactInput(req.body);
    if (!input) {
      return res.status(400).json({ message: "Request body must be a JSON object." });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found." });
    }

    contact.set(input);
    await contact.save();

    return res.json(contact);
  })
  .delete(async (req, res) => {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid contact ID." });
    }

    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found." });
    }

    return res.json({ message: "Contact deleted successfully." });
  });

export default router;
