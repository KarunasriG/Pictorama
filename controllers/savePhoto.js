const { photo: photoModel, tag: tagModel } = require("../models");
const { validatePhotoDetails } = require("../validations/index.js");

const savePhoto = async (req, res) => {
  const errors = validatePhotoDetails(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors });
  }

  try {
    const { imageUrl, description, altDescription, tags, userId } = req.body;
    const photo = await photoModel.create({
      imageUrl,
      description,
      altDescription,
      userId,
    });

    const tagResponse = tags.map((tag) =>
      tagModel.create({ name: tag, photoId: photo.id })
    );

    await Promise.all(tagResponse);
    return res.status(201).json({ message: "Photo saved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating photo" });
  }
};

module.exports = { savePhoto };
