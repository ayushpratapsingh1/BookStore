# Bookstore Project

This is a full-stack application that allows users to manage a collection of books, including uploading PDFs and cover images. The backend is built with Node.js & Express using MongoDB for data storage, while the frontend is built with React & Tailwind CSS for the UI.

## Features

- **Book Management**: Add and view books, including PDF and cover images.  
- **File Uploads**: Store PDFs and cover images on the server using Multer.  
- **Responsive Design**: Leveraging Tailwind CSS for consistent and responsive UI.  
- **User-Friendly API**: Seamless communication between frontend and backend.

## Tech Stack

- **Front End**:  
  - React  
  - Tailwind CSS  
  - Axios (optional for API calls if not using fetch)

- **Back End**:  
  - Node.js & Express  
  - MongoDB & Mongoose  
  - Multer (for file uploads)

## Prerequisites

- Node.js & npm  
- MongoDB (local or on MongoDB Atlas)
- (Optional) AWS EC2 for deployment

## Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Bookstore
```

### 2. Backend Setup

- Navigate into the backend folder:

  ```bash
  cd Backend
  ```

- Install dependencies:

  ```bash
  npm install
  ```

- Create a `.env` file containing your MongoDB connection string. For example:

  ```bash
  MONGO_URI=mongodb://localhost:27087/bookstore
  ```
  
- Start the server:

  ```bash
  node server.js
  ```
  
- By default, the backend runs on <http://localhost:5000>.

### 3. Frontend Setup

- Navigate to the frontend folder:

  ```bash
  cd ../Frontend
  ```

- Install dependencies:

  ```bash
  npm install
  ```

- (Optional) Create a `.env` or `.env.local` file with:

  ```bash
  VITE_API_URL=http://localhost:5000
  ```
  
- Start the development server:

  ```bash
  npm run dev
  ```
  
- This typically runs the frontend on <http://localhost:5173>.

## Usage

1. Access the frontend at <http://localhost:5173>.  
2. The API endpoints are available at <http://localhost:5000/api/books> and <http://localhost:5000/api/stats>.

You can upload new books, including their PDFs and cover images. The uploaded files will be stored in the `uploads` folder on the server.

## Serving Static Files
The server uses:
```js
app.use('/uploads', express.static('uploads'));
```
Any files placed inside the "uploads" folder can be accessed via the `/uploads` path. For example, cover images in `uploads/covers` are accessible at:
```
http://localhost:5000/uploads/covers/<filename>
```
PDFs in `uploads/pdfs` are accessible at:
```
http://localhost:5000/uploads/pdfs/<filename>
```

## Deployment

### 1. Deploying Backend to AWS EC2 (Optional)

1. **Set Up an EC2 Instance**  
   Launch an EC2 instance on AWS and SSH into it.

2. **Install Dependencies on EC2**  
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm mongodb
   ```

3. **Clone the Repository & Install**  
   ```bash
   git clone <your-repo-url>
   cd Bookstore/Backend
   npm install
   ```

4. **Configure & Run**  
   Add your `.env` with `MONGO_URI`. Then:
   ```bash
   node server.js
   ```

5. **NGINX Configuration for Reverse Proxy**  
   Set up an NGINX reverse proxy to forward requests from port 80 or 443 to port 5000.

### 2. Deploying Frontend to Vercel (Optional)

1. Push your frontend code to GitHub.  
2. Sign up on Vercel and link your GitHub repository.  
3. Import the frontend project and follow Vercel’s guide to deploy.

### Security & SSL

- Use Let’s Encrypt (Certbot) to acquire SSL certificates and serve content over HTTPS (particularly important for production).

## Contributing

Feel free to open issues, fork the repo, and create pull requests. Contributions are appreciated!

## License

This project is under the [MIT License](./LICENSE).
