import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Client-side Supabase client for reading mock data (since we don't have real backend API for public read yet)
const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type HousingUnit = Database['public']['Tables']['housing_units']['Row'];
export type HousingBooking = Database['public']['Tables']['housing_bookings']['Row'];

export interface HousingMatchResult {
    status: 'AVAILABLE' | 'WAITLIST' | 'ERROR';
    assignedUnit?: HousingUnit;
    alternativeOptions?: HousingUnit[];
    message?: string;
}

/**
 * Checks if a specific unit has capacity for the requested dates.
 * Queries the database for overlapping bookings.
 */
async function isUnitAvailable(unitId: string, capacity: number, checkIn: Date, checkOut: Date): Promise<boolean> {
    const { data: bookings, error } = await supabase
        .from('housing_bookings')
        .select('id')
        .eq('unit_id', unitId)
        .or(`and(check_in.lte.${checkOut.toISOString()},check_out.gte.${checkIn.toISOString()})`); // Overlap logic

    if (error) {
        console.error('Error checking availability:', error);
        return false;
    }

    // Number of bookings during this period
    const bookingCount = bookings?.length || 0;

    // Available if bookings < capacity
    return bookingCount < capacity;
}

/**
 * ALGORITHM: Housing Allocation (Real Implementation)
 * 1. Fetch units in city.
 * 2. Check overlap against capacity for each unit in DB.
 * 3. Return available match or waitlist.
 */
export async function findHousingMatch(city: string, startDate: Date, endDate: Date): Promise<HousingMatchResult> {
    try {
        // 1. Get units in the city
        const { data: units, error } = await supabase
            .from('housing_units')
            .select('*')
            .eq('city', city);

        if (error || !units) {
            console.error("Error fetching units:", error);
            return { status: 'ERROR', message: 'Failed to fetch housing inventory.' };
        }

        const availableUnits: HousingUnit[] = [];

        // 2. Check availability for each
        for (const unit of units) {
            // Note: In a real high-traffic app, we'd do this join in SQL or a stored procedure
            // But for this scale, individual checks are acceptable or we could simple fetch all bookings
            const isAvailable = await isUnitAvailable(unit.id, unit.capacity, startDate, endDate);

            if (isAvailable) {
                availableUnits.push(unit);
            }
        }

        if (availableUnits.length > 0) {
            return {
                status: "AVAILABLE",
                assignedUnit: availableUnits[0], // Simple assignment strategies can be improved
                alternativeOptions: availableUnits.slice(1)
            };
        } else {
            return {
                status: "WAITLIST",
                message: "No standard housing available for these dates. Try Premium options?"
            };
        }

    } catch (err) {
        console.error("Housing algorithm error:", err);
        return { status: 'ERROR', message: 'Algorithm failure' };
    }
}
