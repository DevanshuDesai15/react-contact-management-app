# 📱 ContactHub - Modern Contact Management App

[![CI Pipeline](https://github.com/devanshudesai/react-contact-management-app/actions/workflows/ci.yml/badge.svg)](https://github.com/devanshudesai/react-contact-management-app/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=flat&logo=mui&logoColor=white)](https://mui.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern, full-stack contact management application built with React, TypeScript, and Material-UI. Features a beautiful glass-morphism UI, comprehensive testing, and robust backend API.

## ✨ Features

- 🎨 **Modern UI** - Glass morphism design with Material-UI components
- 📱 **Responsive** - Mobile-first design that works on all devices
- 🔍 **Search & Filter** - Advanced contact search and filtering
- ✅ **Full CRUD** - Add, edit, delete, and view contacts
- 🔒 **Authentication** - Secure user login and registration
- 🧪 **Well Tested** - Comprehensive test coverage with Jest & Vitest
- 🚀 **CI/CD Ready** - Automated testing and deployment pipeline
- 💾 **PostgreSQL** - Robust database with Sequelize ORM
- 🔧 **TypeScript** - Full type safety across frontend and backend

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Material-UI v6** - Professional UI components
- **TailwindCSS v4** - Utility-first styling
- **Vitest** - Fast unit testing
- **Vite** - Lightning-fast development

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type-safe backend
- **PostgreSQL** - Relational database
- **Sequelize** - Database ORM
- **JWT** - Authentication
- **Jest** - Backend testing

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/devanshudesai/react-contact-management-app.git
   cd react-contact-management-app
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd server
   npm install
   ```

4. **Set up environment variables**

   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Start the development servers**

   ```bash
   # Backend (in server directory)
   npm run dev

   # Frontend (in root directory)
   npm run dev
   ```

## 🧪 Testing

### Run All Tests

```bash
# Frontend tests
npm run test

# Backend tests
cd server && npm test

# Coverage reports
npm run test:coverage
cd server && npm run test:coverage
```

### CI Pipeline

Every push and pull request triggers automated testing for:

- ✅ Frontend unit tests (Vitest)
- ✅ Backend unit tests (Jest)
- ✅ TypeScript compilation
- ✅ Security audits
- ✅ Build verification

## 📸 Screenshots

### Contact Dashboard

<img src="https://user-images.githubusercontent.com/46750877/147806092-e7bf76d2-14cd-4488-bcb6-a50ae6e78ae6.PNG" height="300" width="800">

### Add New Contact

<img src="https://user-images.githubusercontent.com/46750877/147806096-f1e29b8c-2cfc-4076-a524-7f78b1933265.PNG" height="300" width="800">

- Can edit the contacts
  <img src="https://user-images.githubusercontent.com/46750877/147806095-b2cdcc0d-d3b4-4839-809e-2a791a8284e5.PNG" height="300" width="800">

- Searching of the contact
  <img src="https://user-images.githubusercontent.com/46750877/147806094-8d322275-6bb5-4edb-8bef-3d44d73df7e0.PNG" height="300" width="800">

- The contacts that appear on the list are stored in this JSON file and if we add a contact from app then it will also be added in the JSON file and edit works the same.

![apiJSON](https://user-images.githubusercontent.com/46750877/147806091-4053ed19-a28a-4a7d-b7a9-105299418de2.PNG)

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
