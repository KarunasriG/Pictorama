# **Pictorama**  
**A Photo Curation App**  

Pictorama is a photo curation app that lets users search for images using the **Unsplash API**, save them to collections, add tags, search by tags, and track search history.  

---

## **Features**  
- **Search Photos**: Find images using keywords.  
- **Save Photos**: Save images to your collections.  
- **Tagging**: Add tags to photos for easy organization.  
- **Search by Tags**: Find photos using specific tags.  
- **Search History**: Track your search queries.  
- **User Management**: Create and manage user accounts.  

---

## **Technologies Used**  
- **Backend**: Node.js, Express.js  
- **Database**: Supabase (PostgreSQL), Sequelize (ORM) 
- **API Integration**: Unsplash API  
- **Testing**: Jest, Supertest  

---

## **Setup**  
1. Clone the repo:  
   ```bash
   git clone https://github.com/your-username/pictorama.git
   cd pictorama
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Add your Unsplash API key to `.env`:  
   ```env
   # Unsplash API Key
   UNSPLASH_ACCESS_KEY=your_unsplash_access_key

   # Supabase Database Credentials
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=postgres
   DB_HOST=your_database_host
   DB_PORT=5432
   ```

4. Set up the database:  
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

5. Start the server:  
   ```bash
   npm start
   ```

6. Access the app at `http://localhost:3000`.  

---

## **API Documentation**  
### **Base URL**  
`http://localhost:3000/api`  

### **Endpoints**  
#### **User Management**  
- **Create User**: `POST /users`  
  Request Body:  
  ```json
  {
    "username": "newUser",
    "email": "newuser@example.com"
  }
  ```

#### **Photo Search**  
- **Search Photos**: `GET /photos/search?query=nature`  

#### **Photo Management**  
- **Save Photo**: `POST /photos`  
  Request Body:  
  ```json
  {
    "imageUrl": "https://images.unsplash.com/photo-...",
    "description": "Beautiful landscape",
    "altDescription": "Mountain view",
    "tags": ["nature", "mountain"],
    "userId": 1
  }
  ```

- **Add Tags**: `POST /photos/:photoId/tags`  
  Request Body:  
  ```json
  {
    "tags": ["newTag1", "newTag2"]
  }
  ```

#### **Search History**  
- **Get Search History**: `GET /search-history?userId=1`  

---

## **API Response Examples**  
For detailed API response examples, refer to the **[Google Doc](https://docs.google.com/document/d/1cOqnIpev29uv4zNyR9XMeEfYmFS6MEQzQI9BlfdItSM/edit?usp=sharing)**.  

---

## **Testing**  
Run tests with:  
```bash
npm test
```

Tests are written using **Jest** and **Supertest** and cover:  
- API endpoints  
- Database operations  
- Validation logic  

---

## **License**  
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.  

---

## **Acknowledgements**  
- **Unsplash** for providing the amazing photo API.  
- **Sequelize** for making database management a breeze.  
- **Node.js** and **Express.js** for powering the backend.  

---
