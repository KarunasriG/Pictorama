const axiosInstance = require("../lib/axios.lib");

const searchPhotoByQuery = async (req, res) => {
  const search = req.query.query;
  if (!search) {
    return res.status(400).json({ message: "Query is required" });
  }
  try {
    const response = await axiosInstance.get(
      `/search/photos?query=${req.query.query}`
    );
    // console.log(response);
    const data = response.data;
    const photos = data.results.map((photo) => ({
      description:
        photo.description ||
        photo.alt_description ||
        "No description available",
      imageUrl: photo.urls.regular,
      alt_description: photo.alt_description || "No alt description available",
    }));
    res.status(200).json({ photos });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error searching photos", error: error.message });
  }
};

module.exports = { searchPhotoByQuery };
