# FileDrop

A **mini version of Google Drive** to upload, manage, and share small files effortlessly. FileDrop allows users to store files securely in the cloud and retrieve them when needed.

---

## 🌟 Features

- **Upload and Download Files:**
  Upload single or multiple files of any type and download them when required.

- **Folder Management:**
  Create, delete, and organize your files in folders.

- **Secure Authentication:**
  Session-based authentication using Passport.js with a local strategy ensures secure access.

- **Supabase Integration:**
  Files are stored and retrieved using Supabase storage buckets. File uploads are handled via Multer.

- **Persistent Data Storage:**
  PostgreSQL, managed with Prisma ORM, stores models and data for reliability and scalability.

- **File Sharing:**
  Share files with non-authenticated users using secure links.

- **Form Validation:**
  All forms are validated for enhanced security and data accuracy.

- **Error Handling:**
  Seamless error management for an improved user experience.

---

## 🛠️ Tech Stack

| Technology      | Purpose                                     |
| --------------- | ------------------------------------------- |
| **Express.js**  | Backend framework for routing and API logic |
| **EJS**         | Templating engine for dynamic web pages     |
| **Supabase**    | Cloud storage for file management           |
| **Multer**      | File upload middleware                      |
| **Passport.js** | Authentication using local strategy         |
| **PostgreSQL**  | Database for storing app data               |
| **Prisma ORM**  | Managing database models                    |

---

## 🚀 How to Run Locally

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/filedrop.git
   cd filedrop
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and configure the following:

   ```env
   PORT=<your-port>
   SECRET=<your-secret>
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_KEY=<your-supabase-key>
   DATABASE_URL=<your-database-url>
   ```

4. **Navigate to Root Directory and Start the App**

   ```bash
   node app.js
   ```

5. **Access the App**
   Visit `http://localhost:<PORT>` in your browser.

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request.

1. Fork the Project.
2. Create your Feature Branch: `git checkout -b feature/amazing_feature`.
3. Commit your Changes: `git commit -m 'Add some amazing_feature'`.
4. Push to the Branch: `git push origin feature/amazing_feature`.
5. Open a Pull Request.

---

## 📧 Contact

If you have any questions, feel free to reach out:

- **Email:** [Aditya Kirti](mailto:adityakirti.dev@gmail.com)
- **GitHub:** [addy118](https://github.com/addy118)

---

_FileDrop - Your Cloud Storage Solution!_
