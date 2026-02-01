export interface HousingUnit {
    id: string;
    name: string;
    capacity: number;
    city: string;
}

export interface Booking {
    unitId: string;
    checkIn: Date;
    checkOut: Date;
}

// Mock Database of Units
const MOCK_HOUSING_INVENTORY: HousingUnit[] = [
    { id: "h1", name: "Nizamuddin Apt 4B", capacity: 2, city: "New Delhi" },
    { id: "h2", name: "Defence Colony Villa", capacity: 3, city: "New Delhi" },
    { id: "h3", name: "Kochi Riverside A1", capacity: 2, city: "Kochi" },
];

const MOCK_EXISTING_BOOKINGS: Booking[] = [
    {
        unitId: "h1",
        checkIn: new Date("2024-06-01"),
        checkOut: new Date("2024-06-30")
    },
    {
        unitId: "h1",
        checkIn: new Date("2024-06-01"),
        checkOut: new Date("2024-06-30")
    }
    // Unit h1 is now FULL (Capacity 2, 2 Bookings) for June
];

/**
 * Checks if a specific unit has capacity for the requested dates.
 */
function isUnitAvailable(unit: HousingUnit, existingBookings: Booking[], startDate: Date, endDate: Date): boolean {
    const overlappingBookings = existingBookings.filter(b => {
        return b.unitId === unit.id && (
            (startDate >= b.checkIn && startDate < b.checkOut) ||
            (endDate > b.checkIn && endDate <= b.checkOut) ||
            (startDate <= b.checkIn && endDate >= b.checkOut)
        );
    });

    return overlappingBookings.length < unit.capacity;
}

/**
 * ALGORITHM: Housing Allocation
 * 1. Filter units by city.
 * 2. Check overlap against capacity.
 * 3. Return available match or waitlist.
 */
export function findHousingMatch(city: string, startDate: Date, endDate: Date) {
    const cityUnits = MOCK_HOUSING_INVENTORY.filter(u => u.city === city);
    const availableUnits: HousingUnit[] = [];

    for (const unit of cityUnits) {
        if (isUnitAvailable(unit, MOCK_EXISTING_BOOKINGS, startDate, endDate)) {
            availableUnits.push(unit);
        }
    }

    if (availableUnits.length > 0) {
        return {
            status: "AVAILABLE",
            assignedUnit: availableUnits[0], // Simple assignment: First available
            alternativeOptions: availableUnits.slice(1)
        };
    } else {
        return {
            status: "WAITLIST",
            message: "No standard housing available. Upgrade to Premium (+ $500/mo)?"
        };
    }
}
