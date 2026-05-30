# TaskFlow Dashboard

A modern task management dashboard built with **Next.js**, **Firebase Authentication**, **Cloud Firestore**, and **Recharts**.

## Overview

TaskFlow Dashboard is a full-stack CRUD application that allows users to securely manage their personal tasks. The application uses Firebase as a Backend-as-a-Service (BaaS) platform and provides real-time analytics through dynamic data visualizations.

---

## Features

### Authentication

* User Registration
* User Login
* Firebase Authentication
* Protected User-Specific Data

### CRUD Operations

#### Create

Users can create new tasks with:

* Title
* Description

#### Read

Tasks are fetched from Firestore and displayed dynamically on the dashboard.

#### Update

Users can edit existing tasks using a pre-filled form.

#### Delete

Users can delete tasks after confirming the action through a confirmation dialog.

### Task Status Management

* Pending Tasks
* Completed Tasks
* Mark Tasks as Completed

### Analytics Dashboard

* Total Tasks Counter
* Pending Tasks Counter
* Completed Tasks Counter
* Dynamic Pie Chart Visualization

---

## Tech Stack

### Frontend

* Next.js
* React
* Tailwind CSS

### Backend as a Service (BaaS)

* Firebase Authentication
* Cloud Firestore

### Data Visualization

* Recharts

---

## Project Structure

src/

├── app/

│   ├── page.jsx

│   ├── login/

│   │   └── page.jsx

│   ├── register/

│   │   └── page.jsx

│   └── dashboard/

│       └── page.jsx

│

├── lib/

│   └── firebase.js

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

Install Recharts:

```bash
npm install recharts
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Firebase Configuration

Create a Firebase project and enable:

1. Authentication

   * Email/Password Sign-In

2. Cloud Firestore Database

Add your Firebase configuration inside:

```javascript
src/lib/firebase.js
```

---

## Functional Requirements Implemented

### Phase 1: Create & Read

* Fetch user-specific tasks from Firestore
* Create new tasks and store them in the cloud
* Dynamic UI updates after creation

### Phase 2: Update & Delete

* Edit existing tasks
* Update Firestore documents
* Delete tasks with confirmation dialog
* Dynamic UI updates after deletion

### Data Visualization

* Real-time task statistics
* Pie chart analytics
* Dashboard summary cards

---
## Screenshots
<img width="682" height="524" alt="image" src="https://github.com/user-attachments/assets/34ba5707-849f-4228-b4f4-f2b8387cc74d" />
<img width="1374" height="830" alt="image" src="https://github.com/user-attachments/assets/d2c2415b-4af5-467c-8f55-dc33e1dba3f6" />
<img width="1356" height="801" alt="image" src="https://github.com/user-attachments/assets/b7580c1c-d30d-47e2-bb7f-7ef4ec752be4" />

