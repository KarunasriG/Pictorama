const request = require("supertest");
const { app } = require("../index.js");
const axiosInstance = require("../lib/axios.lib.js");

const { photo, tag, searchHistory, user, sequelize } = require("../models");

const { searchPhotoByQuery } = require("../controllers/searchPhotoByQuery.js");
const {
  searchPhotoByTagAndSortBy,
} = require("../controllers/searchPhotoByTagAndSortBy.js");
const {
  searchHistoryByUserId,
} = require("../controllers/searchHistoryByUserId.js");
const { savePhoto } = require("../controllers/savePhoto.js");
const { createNewUser } = require("../controllers/createNewUser.js");
const { addTagsByPhotoId } = require("../controllers/addTagsByPhotoId.js");

jest.mock("../lib/axios.lib", () => ({
  get: jest.fn(),
}));

jest.mock("../models", () => ({
  sequelize: {
    authenticate: jest.fn(() => Promise.resolve()),
    sync: jest.fn(() => Promise.resolve()),
    close: jest.fn(() => Promise.resolve()),
  },
  searchHistory: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
  user: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
  photo: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    save: jest.fn(),
  },
  tag: {
    create: jest.fn(),
    findAll: jest.fn(),
  },
  Sequelize: {
    Op: {
      contains: jest.fn(),
    },
  },
}));

describe("Controller Tests ( Unit Testing : Tests for unit functions)", () => {
  test("createNewUser: should create a new user", async () => {
    const mockResponse = {
      username: "newUser",
      email: "newuser@example.com",
    };

    user.create.mockResolvedValue(mockResponse);

    const req = { body: { username: "newUser", email: "newuser@example.com" } };
    const res = { json: jest.fn(), status: jest.fn(() => res) };

    await createNewUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User created successfully",
      user: mockResponse,
    });
  });

  test("searchPhotoByTagAndSortByDate : should return the sorted list of photos", async () => {
    const mockTagRecord = [{ photoId: 1 }];
    const mockPhotos = [
      {
        toJSON: () => ({
          dateSaved: "2024-01-01T12:00:00Z",
          description: "Mountain view",
          imageUrl: "https://images.unsplash.com/photo-1",
        }),
        tags: [{ name: "mountain" }, { name: "nature" }],
      },
    ];
    tag.findAll.mockResolvedValue(mockTagRecord);
    photo.findAll.mockResolvedValue(mockPhotos);
    searchHistory.findOne.mockResolvedValue(null);
    searchHistory.create.mockResolvedValue({});

    const req = { query: { tags: "nature", sort: "ASC", userId: 1 } };
    const res = { json: jest.fn(), status: jest.fn(() => res) };

    await searchPhotoByTagAndSortBy(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      photos: [
        {
          dateSaved: "2024-01-01T12:00:00Z",
          description: "Mountain view",
          imageUrl: "https://images.unsplash.com/photo-1",
          tags: ["mountain", "nature"],
        },
      ],
    });
  });

  test("searchPhotoByQuery : should return the list of photos", async () => {
    const mockOneResponse = {
      data: {
        results: [
          {
            description: "orange flowers",
            urls: {
              regular: "https://images.unsplash.com/photo/",
            },
            alt_description: "orange flowers",
          },
        ],
      },
    };
    axiosInstance.get.mockResolvedValue(mockOneResponse);
    const req = { query: { query: "nature" } };
    const res = { json: jest.fn(), status: jest.fn(() => res) };
    await searchPhotoByQuery(req, res);

    expect(axiosInstance.get).toHaveBeenCalledWith(
      `/search/photos?query=nature`
    );
    expect(res.json).toHaveBeenCalledWith({
      photos: [
        {
          description: "orange flowers",
          imageUrl: "https://images.unsplash.com/photo/",
          alt_description: "orange flowers",
        },
      ],
    });
  });

  test("searchHistoryByUserId: should return the search history of the specific user", async () => {
    const mockResponse = {
      searchHistory: [
        {
          query: "mountain",
          timestamp: "2024-11-22T10:05:35.820Z",
        },
        {
          query: "nature",
          timestamp: "2024-11-22T10:55:14.729Z",
        },
      ],
    };
    searchHistory.findAll.mockResolvedValue(mockResponse);
    const req = { query: { userId: "1" } };
    const res = { json: jest.fn(), status: jest.fn(() => res) };
    await searchHistoryByUserId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ searchHistory: mockResponse });
  });

  test("savePhoto : should save the photos into collections ", async () => {
    const mockPhoto = {
      imageUrl: "https://images.unsplash.com/photo/",
      description: "Beautiful Sunrise",
      altDescription: "Sunrise view",
      tags: ["rainy", "mountain"],
      userId: 1,
    };
    photo.create.mockResolvedValue(mockPhoto);
    const req = { body: mockPhoto };
    const res = { json: jest.fn(), status: jest.fn(() => res) };

    await savePhoto(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Photo saved successfully",
    });
  });

  test("addTagsByPhotoId : should add tags to the photo", async () => {
    const mockPhoto = {
      id: 1,
      dataValues: {
        tags: [{ name: "nature" }, { name: "landscape" }],
      },
    };
    photo.findByPk.mockResolvedValue(mockPhoto);
    tag.create.mockImplementation(({ name, photoId }) => {
      return Promise.resolve({ name, photoId });
    });
    const req = {
      params: { id: 1 },
      body: { tags: ["sunset", "mountain"] },
    };
    const res = { json: jest.fn(), status: jest.fn(() => res) };

    await addTagsByPhotoId(req, res);

    expect(tag.create).toHaveBeenCalledWith({
      name: "sunset",
      photoId: 1,
    });
    expect(tag.create).toHaveBeenCalledWith({
      name: "mountain",
      photoId: 1,
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tags added successfully",
    });
  });
});

describe("API Endpoints Tests (Integration Testing)", () => {
  test("POST: /api/users/ should create new user", async () => {
    const mockResponse = {
      username: "newUser",
      email: "newuser@example.com",
    };

    user.create.mockResolvedValue(mockResponse);

    const response = await request(app).post("/api/users/").send({
      username: "newUser",
      email: "newuser@example.com",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "User created successfully",
      user: mockResponse,
    });
  });

  test("GET /api/search/photos/ should list the searched the photos by query", async () => {
    const mockResponse = {
      data: {
        results: [
          {
            urls: { regular: "https://images.unsplash.com/photo-1" },
            description: "Beautiful landscape",
            alt_description: "Mountain view",
          },
        ],
      },
    };

    axiosInstance.get.mockResolvedValue(mockResponse);

    const response = await request(app)
      .get("/api/search/photos")
      .query({ query: "nature" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      photos: [
        {
          imageUrl: "https://images.unsplash.com/photo-1",
          description: "Beautiful landscape",
          alt_description: "Mountain view",
        },
      ],
    });
  });

  test("POST /api/photos/ should save the image into the collection", async () => {
    const mockPhoto = {
      id: 1,
      imageUrl: "https://images.unsplash.com/photo-1",
      description: "Beautiful landscape",
      altDescription: "Mountain view",
      userId: 1,
    };

    const mockTags = ["nature", "mountain"];

    photo.create.mockResolvedValue(mockPhoto);

    tag.create.mockImplementation(({ name, photoId }) => ({
      id: Math.random(),
      name,
      photoId,
    }));

    const response = await request(app).post("/api/photos").send({
      imageUrl: "https://images.unsplash.com/photo-1",
      description: "Beautiful landscape",
      altDescription: "Mountain view",
      tags: mockTags,
      userId: 1,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Photo saved successfully",
    });

    expect(photo.create).toHaveBeenCalledWith({
      imageUrl: "https://images.unsplash.com/photo-1",
      description: "Beautiful landscape",
      altDescription: "Mountain view",
      userId: 1,
    });
  });

  test("POST /api/photos/:id/tags/ should add tags to photos", async () => {
    const mockPhoto = {
      id: 1,
      dataValues: {
        tags: [{ name: "nature" }, { name: "landscape" }],
      },
    };
    photo.findByPk.mockResolvedValue(mockPhoto);
    tag.create.mockImplementation(({ name, photoId }) => {
      return Promise.resolve({ name, photoId });
    });
    const response = await request(app)
      .post("/api/photos/1/tags")
      .send({
        tags: ["sunset", "beach"],
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Tags added successfully",
    });
  });

  test("GET /api/photos/tag/search/ should return all photos based on query", async () => {
    const mockTags = [{ photoId: 1 }];
    const mockPhotos = [
      {
        dateSaved: "2024-01-01T12:00:00Z",
        description: "Mountain view",
        imageUrl: "https://images.unsplash.com/photo-1",
        tags: [{ name: "nature" }, { name: "mountain" }],
        toJSON() {
          return this;
        },
      },
    ];

    tag.findAll.mockResolvedValue(mockTags);
    photo.findAll.mockResolvedValue(mockPhotos);
    searchHistory.findOne.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/photos/tag/search")
      .query({ tags: "nature", sort: "ASC", userId: "1" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      photos: [
        {
          dateSaved: "2024-01-01T12:00:00Z",
          description: "Mountain view",
          imageUrl: "https://images.unsplash.com/photo-1",
          tags: ["nature", "mountain"],
        },
      ],
    });
  });

  test("GET /api/search-history/ should display the serach history of the user", async () => {
    const mockResponse = {
      searchHistory: [
        {
          query: "mountain",
          timestamp: "2024-11-22T10:05:35.820Z",
        },
        {
          query: "nature",
          timestamp: "2024-11-22T10:55:14.729Z",
        },
      ],
    };

    searchHistory.findAll.mockResolvedValue(mockResponse);

    const response = await request(app)
      .get("/api/search-history")
      .query({ userId: "1" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ searchHistory: mockResponse });
  });
});
