const { photo: photoModel, tag: tagModel } = require("../models");
const { validateTags } = require("../validations/index.js");

const addTagsByPhotoId = async (req, res) => {
  try {
    const photoId = req.params.id;
    const { tags } = req.body;

    // Validate tags
    const errors = validateTags(req.body.tags);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors });
    }

    // Check if photo exists
    const photo = await photoModel.findByPk(photoId);
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    // Check total tags
    const existingTags = await tagModel.count({ where: { photoId } });
    if (existingTags + tags.length > 5) {
      return res
        .status(400)
        .json({ message: "Maximum 5 tags allowed per photo" });
    }

    // Add tags
    await Promise.all(
      tags.map((tag) => tagModel.create({ name: tag, photoId }))
    );

    res.status(201).json({ message: "Tags added successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error while updating the tags by photo id" });
  }
};

module.exports = { addTagsByPhotoId };
