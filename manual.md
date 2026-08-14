# CloudFleet User Manual

CloudFleet is a real-time fleet management application for vehicle tracking, geofencing, and alerts.

## 🧪 How to Test CloudFleet

### 1. Register

1. Open the CloudFleet application.
2. Go to the **Register** page.
3. Enter the required user details.
4. Create your account successfully.

### 2. Login

1. Open the **Login** page.
2. Enter your registered credentials.
3. Login to CloudFleet.
4. Open the **Dashboard**.

### 3. Create a Vehicle

1. Open the **Vehicles** section.
2. Click **Create/Add Vehicle**.
3. Enter the required vehicle details.
4. Save the vehicle.
5. Verify that the vehicle appears in the vehicle list.

### 4. Create a Geofence

1. Open the **Geofences** section.
2. Create a new geofence.
3. Select a location on the map.
4. Configure the geofence as a **circle**.
5. Set the required radius.
6. Save the geofence.
7. Verify that the circular geofence appears on the map.

### 5. Test Vehicle Entry

1. Go back to the **Dashboard**.
2. Find the vehicle marker on the map.
3. Use the vehicle marker/location controls to move the vehicle.
4. Move the vehicle marker **inside the circular geofence**.
5. The backend should detect the vehicle entering the geofence.
6. Verify that an **entry alert** is generated.

### 6. Test Vehicle Exit

1. Keep the same vehicle selected.
2. Move the vehicle marker from inside the geofence to **outside the circle**.
3. The backend should detect the vehicle leaving the geofence.
4. Verify that an **exit alert** is generated.

### 7. Verify Alerts

Open the **Alerts** section and verify that the vehicle's geofence events are recorded.

You should see:

- Vehicle entered geofence
- Vehicle exited geofence
- Vehicle information
- Event/alert details

## 🔄 Complete Test Flow

```text
Register
   ↓
Login
   ↓
Create Vehicle
   ↓
Create Circular Geofence
   ↓
Open Dashboard
   ↓
Move Vehicle Marker
   ↓
┌──────────────────────┐
│ Move inside circle   │
│ → Entry Alert        │
└──────────────────────┘
           ↓
┌──────────────────────┐
│ Move outside circle  │
│ → Exit Alert         │
└──────────────────────┘
           ↓
      Check Alerts
```

## 🧪 Test Account

Use the following dummy account to test the application:

| Field    | Value              |
| -------- | ------------------ |
| Email    | `deepak@gmail.com` |
| Password | `123456`           |

> **Note:** This is a dummy/test account intended only for testing the CloudFleet application. Do not use these credentials in production.
