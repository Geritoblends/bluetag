# BlueTag - Bluetooth Tag Tracking Frontend

A modern Next.js frontend for tracking Bluetooth tags with real-time MQTT integration.

## Features

- **User Authentication**: Login and signup with JWT tokens
- **Tag Management**: Add, view, and delete Bluetooth tags
- **MQTT Integration**: Real-time distance tracking via MQTT
- **Device Scanning**: Discover available ESP32 devices
- **Real-time Tracking**: Visual tracking page with pulsating distance indicators
- **Sound Emission**: Trigger sounds on tags remotely
- **Data Persistence**: Automatic syncing of distance updates to backend

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Zustand** - State management
- **MQTT.js** - Real-time messaging
- **Shadcn UI** - Component library
- **Module CSS** - Scoped styling (no Tailwind in components)

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create `.env.local` from example:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

3. Update environment variables:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_MQTT_BROKER=ws://localhost:9001
\`\`\`

4. Run development server:
\`\`\`bash
npm run dev
\`\`\`

## MQTT Topics

### Emit Sound
- **Topic**: `tags/{MAC_ADDRESS}/emit_sound`
- **Message**: `1`
- **Description**: Triggers sound on the tag

### Distance Updates
- **Topic**: `tags/{MAC_ADDRESS}/distance`
- **Message**: Distance in meters (float)
- **Description**: Receives real-time distance updates

### Available Tags
- **Topic**: `availableTags/{MAC_ADDRESS}`
- **Message**: MAC address string
- **Description**: Discovers available devices for pairing

## API Integration

The frontend expects the following endpoints:

- `POST /login` - User login
- `POST /signup` - User registration
- `GET /users/:id/tags` - Get user's tags
- `POST /users/:id/tags` - Create new tag
- `DELETE /users/:id/tags/:tagId` - Delete tag
- `GET /users/:id/tags/:tagId/updates` - Get tag updates
- `POST /users/:id/tags/:tagId/updates` - Post distance updates

## Tag Cards

Each tag displays:
- Alias and icon
- MAC address (smaller, grey text)
- Battery level
- Last distance
- Emit Sound button
- Search button (opens tracking page)

## Tracking Page

Real-time tracking features:
- Large icon with pulsating border (green/yellow/red based on distance)
- Distance thresholds:
  - **Green**: < 2 meters (Very Close)
  - **Yellow**: 2-5 meters (Nearby)
  - **Red**: > 5 meters (Far Away)
- Real-time distance display in meters
- Emit Sound button
- Auto-sync updates to backend when leaving page

## Project Structure

\`\`\`
app/
├── dashboard/          # Main dashboard with tag grid
├── login/             # Login page
├── signup/            # Signup page
└── tags/[id]/track/   # Real-time tracking page

lib/
├── api.ts             # REST API client
└── mqtt-client.ts     # MQTT connection and helpers

store/
├── auth-store.ts      # Authentication state
├── tags-store.ts      # Tags state
└── mqtt-store.ts      # MQTT distance updates
\`\`\`

## Notes

- Distance updates are collected locally and sent to backend in batches when leaving the tracking page
- MQTT connection uses WebSocket protocol
- All styling uses module.css files (no Tailwind classes in components)
- Minimal, modern design without gradients or blurs
