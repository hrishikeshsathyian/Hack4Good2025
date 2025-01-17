# Hack4Good2025
Repository for Hack 4 Good 2025

# What is this
Our project is a full-stack solution designed to digitize and streamline operations for Muhammadiyah Welfare Home's minimart. Built with Next.js for a seamless front-end experience and FastAPI for a high-performance backend, the platform integrates Firebase for secure authentication and Supabase for robust data management. 

**Key Features:**

1. **User Functionality:**
   - Secure Gmail-based login, with only admins authorized to create new accounts.
   - Browse products, redeem voucher points, request sold-out items, and pre-order future stock.
   - Participate in auctions for premium items managed by admins.
   - View transaction history for detailed voucher earning and spending records.
   - Manage purchased items in the **Pending Items Tab** with clear statuses: READY, REQUESTED, and REDEEMED, for easy tracking and claiming.

2. **Admin Dashboard:**
   - **Account Management:** Add, edit, or delete users and adjust voucher points.
   - **Inventory Management:** Monitor and sort product availability, track low-stock items, and add new products.
   - **Auction Management:** Add, monitor, and end auctions with ease.
   - **Voucher Transactions:** Validate and process item claims securely.
   - **Generate Summaries:** Leverage an LLM-powered tool to analyze purchasing trends, identify top products, and answer targeted questions to enhance inventory decisions.

With these features, our app ensures secure, transparent, and efficient minimart management, empowering MWH to serve their residents better while incorporating AI-driven insights for future planning.

# How to Run 


---

## Running the App

### Frontend Setup (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend/hack4good
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Create a `.env.local` file in the `/frontend/hack4good` directory and add the following:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=XXX
   # text @hrishi12345 on telegram for the key
   ```

4. Start the frontend server:
   ```bash
   yarn run dev
   ```

---

### Backend Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (ensure virtualenv is in `.gitignore`):
   - macOS/Linux:
     ```bash
     python3 -m venv .venv
     ```
   - Windows:
     ```bash
     python -m venv .venv
     ```

3. Activate the virtual environment:
   - macOS/Linux:
     ```bash
     source .venv/bin/activate
     ```
   - Windows:
     ```bash
     .venv\Scripts\activate
     ```

4. Ensure the correct Python interpreter is selected in VSCode if using it.

5. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

6. Add Firebase configuration:
   - Drag and drop JSON file (text @hrishi12345 for file on telegram) for Firebase admin operations into the same directory as `main.py`.

7. Create a `.env` file in the `/backend` directory and add the following:
   ```env
   SUPABASE_URL=XXX
   SUPABASE_KEY=XXX
   # ask @hrishi12345 on telegram for the keys
   ```

8. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

---





