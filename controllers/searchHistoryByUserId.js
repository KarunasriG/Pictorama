const { searchHistory: searchHistoryModel } = require("../models");

const searchHistoryByUserId = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }
    const searchHistory = await searchHistoryModel.findAll({
      where: { userId },
      attributes: ["query", "timestamp"],
    });

    if (searchHistory.length === 0) {
      return res
        .status(404)
        .json({ message: "No search history found for this user" });
    }
    res.status(200).json({ searchHistory });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error searching photos by tag and sort by date",
      error: error.message,
    });
  }
};

module.exports = { searchHistoryByUserId };
