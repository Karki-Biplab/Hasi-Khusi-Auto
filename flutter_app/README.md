# Workshop Management Flutter App

A comprehensive workshop management system built with Flutter that works both online and offline.

## Features

### Core Modules
- **Authentication**: Firebase Auth with role-based access
- **Dashboard**: Role-specific dashboards with analytics
- **Inventory Management**: CRUD operations for parts and accessories
- **Job Cards**: Customer service requests and repair management
- **Invoice Generation**: PDF invoice creation and management
- **Activity Logs**: Comprehensive audit trail
- **Offline Sync**: Local storage with cloud synchronization

### User Roles
- **Owner**: Full system access, user management
- **Admin**: Job card management, invoice generation, limited product access
- **Worker**: Product viewing, job card creation, no invoice finalization

### Technical Features
- Material 3 design system
- Offline-first architecture
- Real-time data synchronization
- Role-based UI components
- Responsive design
- PDF generation
- Image capture and storage

## Getting Started

### Prerequisites
- Flutter SDK (>=3.0.0)
- Firebase project setup
- Android/iOS development environment

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   flutter pub get
   ```
3. Configure Firebase:
   - Add your `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   - Update Firebase configuration

4. Run the app:
   ```bash
   flutter run
   ```

## Architecture

The app follows Clean Architecture principles:

```
lib/
├── core/
│   ├── models/           # Data models
│   ├── services/         # Business logic services
│   ├── theme/           # UI theme configuration
│   └── utils/           # Utility functions
├── features/
│   ├── auth/            # Authentication feature
│   ├── dashboard/       # Dashboard feature
│   ├── inventory/       # Inventory management
│   ├── job_cards/       # Job card management
│   └── invoices/        # Invoice generation
└── main.dart           # App entry point
```

## State Management
- **Riverpod** for state management
- **StreamProvider** for real-time data
- **FutureProvider** for async operations

## Local Storage
- **Hive** for lightweight local storage
- **SQLite** for complex relational data
- Automatic sync when online

## Offline Capabilities
- Local data persistence
- Conflict resolution
- Automatic sync on connectivity
- Offline-first design

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
This project is licensed under the MIT License.