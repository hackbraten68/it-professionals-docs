---
title: Docker Final Project
---

## Docker Weekend Project: Build and Share a Containerized Application

This weekend assignment is your chance to apply everything you've learned about Docker in a real-world mini-project. The goal is to containerize a simple application or tool, document your process, and submit your result by the end of the weekend.

---

## 🎯 Your Task

- Choose or build a simple application or service.
- Dockerize it using a `Dockerfile` and/or `docker-compose.yml`.
- Ensure it runs smoothly in a clean environment.
- Add meaningful configuration and (optional) persistent data.
- Write a short README that documents what you did and how to run it.

---

## 🧠 Suggested Project Ideas

Choose one of the following ideas, or come up with your own:

### Idea 1: Static Website

- Create a small website using HTML/CSS.
- Serve it with an Nginx container.
- Optionally add a second container for future backend/API use.

### Idea 2: Simple API

- Use Python Flask or Node.js to build a minimal REST API.
- Containerize it with a custom `Dockerfile`.
- Bonus: Add Swagger UI or Postman collection for testing.

### Idea 3: Personal Dashboard (Prebuilt Tools)

- Run a prebuilt dashboard like Portainer, Uptime Kuma, or Whoogle.
- Use `docker-compose.yml` to define services.
- Write config instructions in the README.

### Idea 4: Development Toolchain

- Build a container-based toolchain (e.g., Jupyter, code-server).
- Focus on usability and clear setup instructions.
- Document environment variables and mounting points.

---

## 🗂️ Recommended Folder Structure

Structure your submission like this:

```markdown
/docker-weekend-project/
├── docker-compose.yml
├── Dockerfile (if needed)
├── /src/ or /app/
├── README.md
└── .env (optional)
```

---

## 📝 README Requirements

Your `README.md` should include:

- 📌 Project title and short description
- 🚀 How to start the project (commands)
- 🧩 Explanation of what each container does
- 🔧 Any required environment variables or ports
- 💾 Notes on volumes or persistent data (if used)
- 🧪 Optional: test data or curl commands to verify functionality

---

## ⏳ Submission Deadline

Please submit your project **by Sunday at 23:59**.  
You can either:

- Push it to a public GitHub/GitLab repository and send the link  
**OR**
- Upload a `.zip` archive with all project files

---

## 🧭 Tips & Hints

- Test everything by running it on a clean machine (e.g., `docker system prune` or VM).
- Use official base images where possible.
- Keep it simple – quality over complexity!
- Comment your `Dockerfile` and `docker-compose.yml` where helpful.

---

## 🙋 Need Help?

If you get stuck:

- Check the official Docker documentation
- Review past examples from the course
- Reach out in the course chat (before Sunday afternoon!)

Good luck and have fun dockerizing 🚢
