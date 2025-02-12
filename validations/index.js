function validateUserQueryParams(query) {
  const errors = [];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!query.username) {
    errors.push("Username is required");
  }
  if (!query.email) {
    errors.push("Email is required");
  } else {
    if (!emailPattern.test(query.email)) {
      errors.push("Invalid email format");
    }
  }
  return errors;
}

function validatePhotoDetails(photo) {
  const errors = [];
  // console.log(photo);
  if (!photo.imageUrl.startsWith("https://images.unsplash.com/")) {
    errors.push("Invalid image URL");
  }

  let tags = photo.tags;
  if (!Array.isArray(tags)) {
    errors.push("Tags must be an array");
  }
  if (tags.length > 5) {
    errors.push("No more than 5 tags are allowed");
  }
  tags.forEach((tag) => {
    if (tag.length > 20) {
      errors.push(`Tag "${tag}" exceeds the 20-character limit`);
    }
  });
  return errors;
}

function validateTags(newTags) {
  const errors = [];
  if (!Array.isArray(newTags)) {
    errors.push("Tags must be provided as an array.");
    return errors;
  }

  newTags.forEach((tag, index) => {
    if (typeof tag !== "string") {
      errors.push("Tags must be non-empty strings");
    }
    if (tag.length > 20) {
      errors.push(`Tag of index "${index}" exceeds the 20-character limit`);
    }
  });

  return errors;
}
module.exports = {
  validateUserQueryParams,
  validatePhotoDetails,
  validateTags,
};
