const {
  photo: photoModel,
  tag: tagModel,
  searchHistory: searchHistoryModel,
} = require("../models");

const searchPhotoByTagAndSortBy = async (req, res) => {
  // const tag = req.query.tags;
  // const sort = req.query.sort || "ASC";
  const { tags, sort = "ASC", userId } = req.query;
  // Validate the tag
  if (!tags || typeof tags !== "string") {
    return res.status(400).json({ message: "A valid tag is required" });
  }

  try {
    const tagRecord = await tagModel.findAll({
      where: { name: tags },
    });
    console.log(tagRecord);
    if (!tagRecord || tagRecord.length === 0) {
      return res.status(404).json({ message: "Tag not found" });
    }

    // creating search history of the user
    if (userId) {
      const existingSearch = await searchHistoryModel.findOne({
        where: { userId, query: tags },
      });
      if (!existingSearch) {
        await searchHistoryModel.create({
          userId,
          query: tags,
        });
      }
    }

    const photoId = tagRecord.map((tag) => tag.photoId);
    // console.log(photoId);
    if (!photoId || photoId.length === 0) {
      return res
        .status(404)
        .json({ message: "No photos found for the given tag" });
    }
    // sorting the photos by date
    const photos = await photoModel.findAll({
      where: { id: photoId },
      include: [
        {
          model: tagModel,
          attributes: ["name"],
        },
      ],
      order: [["dateSaved", sort.toUpperCase()]],
      attributes: {
        exclude: ["id", "altDescription", "userId", "createdAt", "updatedAt"],
      },
    });

    // transforming the tags into single array
    const transformedPhotos = photos.map((photo) => {
      const tags = photo.tags.map((tag) => tag.name);
      return {
        ...photo.toJSON(),
        tags,
      };
    });
    res.status(200).json({ photos: transformedPhotos });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error searching photos by tag and sort by date",
      error: error.message,
    });
  }
};

module.exports = { searchPhotoByTagAndSortBy };
