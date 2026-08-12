export interface Vehicle {
    id: number;
    vehicleNumber?: string;
    latitude?: number;
    longitude?: number;
    status?: string;
}

export interface Alert {
    id: number;
    message?: string;
    type?: string;
    createdAt?: string;
}

export interface DashboardResponse {
    totalVehicles: number;
    activeVehicles: number;
    inactiveVehicles: number;
    totalAlerts: number;
    vehicles: Vehicle[];
    recentAlerts: Alert[];
}