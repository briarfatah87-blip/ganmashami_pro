import { NextResponse } from 'next/server';
import { getSeriesCategories } from '@/lib/xtream-api';

export async function GET() {
    try {
        const categories = await getSeriesCategories();
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching series categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
