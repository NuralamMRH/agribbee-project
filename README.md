# Agribbee - Smart Agricultural Auction Platform

A comprehensive agricultural marketplace and auction platform built with modern web technologies, featuring multiple applications for different user types.

## 🚀 Project Overview

Agribbee is a full-stack agricultural platform that connects farmers, buyers, and agricultural service providers through an innovative auction system. The platform includes web applications, mobile apps, and a robust backend API.

## 📁 Project Structure

```
AgribbeeMain/
├── agribbee-dashboard/          # Admin dashboard (Next.js)
├── agribbee-frontend/           # Main frontend application (Next.js)
├── agribbee-dump/              # Database dumps and exports
├── backend/                    # Node.js/Express API server
├── iTruckSeaApplications/      # Mobile and web applications
│   ├── mobile_app/            # React Native mobile app
│   └── web_app/               # Additional web application
├── caddy/                     # Caddy web server configuration
└── docker-compose.yml         # Docker orchestration
```

## 🛠️ Technology Stack

### Frontend

- **Next.js** - React framework for web applications
- **Material-UI (MUI)** - UI component library
- **Redux** - State management
- **React Query** - Data fetching and caching
- **Socket.io** - Real-time communication

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Socket.io** - Real-time features
- **Multer** - File upload handling

### Mobile

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform

### DevOps

- **Docker** - Containerization
- **Caddy** - Web server and reverse proxy
- **GitHub** - Version control and CI/CD

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Docker (optional)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/NuralamMRH/agribbee-project.git
   cd agribbee-project
   ```

2. **Install dependencies for each application**

   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../agribbee-frontend
   npm install

   # Dashboard
   cd ../agribbee-dashboard
   npm install

   # Web App
   cd ../iTruckSeaApplications/web_app
   npm install
   ```

3. **Environment Setup**

   - Copy `.env.example` to `.env` in each application directory
   - Configure database connections and API keys

4. **Database Setup**
   ```bash
   # Import database dumps (if available)
   cd agribbee-dump
   # Follow database import instructions
   ```

### Running the Applications

#### Development Mode

1. **Start the backend server**

   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend applications**

   ```bash
   # Main frontend
   cd agribbee-frontend
   npm run dev

   # Dashboard
   cd agribbee-dashboard
   npm run dev

   # Web app
   cd iTruckSeaApplications/web_app
   npm run dev
   ```

#### Production Mode with Docker

```bash
docker-compose up -d
```

## 📱 Applications

### 1. Agribbee Frontend (`agribbee-frontend/`)

- **Purpose**: Main customer-facing web application
- **Features**: Product browsing, auction participation, user accounts
- **Port**: 3000 (development)

### 2. Agribbee Dashboard (`agribbee-dashboard/`)

- **Purpose**: Administrative dashboard for platform management
- **Features**: User management, auction oversight, analytics
- **Port**: 3001 (development)

### 3. Backend API (`backend/`)

- **Purpose**: RESTful API and real-time services
- **Features**: Authentication, auction management, file uploads
- **Port**: 5000 (development)

### 4. Mobile Application (`iTruckSeaApplications/mobile_app/`)

- **Purpose**: Cross-platform mobile app
- **Features**: Mobile-optimized auction experience
- **Platform**: iOS and Android

### 5. Web Application (`iTruckSeaApplications/web_app/`)

- **Purpose**: Additional web interface
- **Features**: Extended functionality and integrations

## 🔧 Configuration

### Environment Variables

Each application requires specific environment variables. See individual `.env.example` files for details.

### Database Configuration

The platform uses MongoDB for data storage. Database dumps are available in the `agribbee-dump/` directory.

### File Uploads

User-generated content (images, documents) is stored in `backend/public/uploads/` and is excluded from version control.

## 🚀 Deployment

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment

1. Build production versions of all applications
2. Configure web server (Caddy configuration provided)
3. Set up environment variables
4. Start services

## 📊 Features

### Core Features

- **Auction System**: Real-time bidding and auction management
- **User Management**: Multi-role user system (farmers, buyers, admins)
- **Product Catalog**: Agricultural product listings and search
- **Payment Integration**: Secure payment processing
- **Real-time Notifications**: Live updates and alerts
- **Mobile Support**: Cross-platform mobile applications

### Advanced Features

- **Geolocation Services**: Location-based product discovery
- **Multi-language Support**: Internationalization
- **Analytics Dashboard**: Business intelligence and reporting
- **File Management**: Document and image handling
- **API Integration**: Third-party service integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and questions:

- Create an issue in this repository
- Contact the development team
- Check the documentation in individual application directories

## 🔄 Version History

- **v1.0.0** - Initial release with core auction functionality
- **v1.1.0** - Added mobile application support
- **v1.2.0** - Enhanced dashboard and analytics
- **v1.3.0** - Improved real-time features and notifications

## 📈 Roadmap

- [ ] Enhanced mobile app features
- [ ] Advanced analytics and reporting
- [ ] Integration with external agricultural APIs
- [ ] Machine learning for price prediction
- [ ] Blockchain integration for transparency
- [ ] Multi-tenant architecture support

---

**Note**: This is a large-scale agricultural platform. Ensure proper testing and staging environment setup before production deployment.
