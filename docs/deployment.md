# FocusFlow Deployment Guide

This guide explains how to deploy FocusFlow to a public server so it can be accessed over the internet.

## Stack: Render + MongoDB Atlas

- **Render** – Hosts the Node.js application (free tier available)
- **MongoDB Atlas** – Cloud database (free M0 tier available)

---

## Step 1: Create a MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and sign up or log in.
2. Create a new Cluster (choose **M0 Free**).
3. Create a database user:
   - Database Access → Add New User
   - Set a username and password (save these securely).
4. Configure network access:
   - Network Access → Add IP Address
   - Add `0.0.0.0/0` (Allow Access from Anywhere) so Render can connect.
5. Get your connection string:
   - Database → Connect → Drivers
   - Copy the connection string, e.g.:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your credentials.
   - Insert the database name before `?`: `/focusflow`, e.g.:
     ```
     mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/focusflow?retryWrites=true&w=majority
     ```

---

## Step 2: Deploy to Render

1. Push your code to **GitHub** (ensure the repo is public or Render has access).

2. Go to [Render](https://render.com) and sign up (GitHub login works).

3. Create a Web Service:
   - Dashboard → **New** → **Web Service**
   - Connect your GitHub repo and select the FocusFlow project.
   - If `render.yaml` exists in the project root, Render will use it.
   - Otherwise, set manually:
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

4. Add environment variables:
   - In the Web Service, go to **Environment**
   - Add:
     - **Key**: `MONGODB_URI`
     - **Value**: Your Atlas connection string from Step 1.

5. Click **Create Web Service** and wait for the build and deploy to finish.

6. After deployment, Render will show a public URL, e.g.:
   ```
   https://focusflow-xxxx.onrender.com
   ```

---

## Step 3: Seed Sample Data (Optional)

To add 1000+ sample records to the deployed database:

1. Create a local `.env` with the same `MONGODB_URI` as Render.
2. Run: `npm run seed`
3. Data is written to Atlas; refresh the deployed app to see it.

---

## Free Tier Limitations & Stability

Both Render and MongoDB Atlas offer free tiers, which are suitable for demos, coursework, and small projects. However, there are some trade-offs:

- **Render Free Tier**
  - The instance **spins down after ~15 minutes of inactivity**.
  - The first request after spin-down may take **30–60 seconds** to wake the service.
  - This is expected behavior, not a bug.

- **MongoDB Atlas Free Tier**
  - 512MB storage, shared cluster.
  - Generally stable for light usage; under heavy load, free tiers can occasionally be slower or less responsive.

- **Recommendation**
  - For course submissions or demos, the free tier is usually sufficient.
  - If you need consistent uptime and faster response, consider paid plans on Render and/or Atlas.

---

## Troubleshooting

### App fails to start

- Verify `MONGODB_URI` is set correctly in Render’s Environment.
- If the password contains special characters (`@`, `#`, `%`, etc.), use [URL encoding](https://www.w3schools.com/tags/ref_urlencode.asp).
- Check Render **Logs** for the exact error message.

### Connection refused / localhost:27017

- This means `MONGODB_URI` is not set in Render.
- Add it under Environment and redeploy.

### CORS issues

- The app uses the `cors` middleware; cross-origin requests should work.
- If problems persist, review CORS settings in `src/server/index.js`.

