import { NextResponse } from 'next/server';
import { getSeries, mapSeriesToApp } from '@/lib/xtream-api';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('category_id') || undefined;
        const limit = parseInt(searchParams.get('limit') || '0');

        const seriesList = await getSeries(categoryId);
        let mapped = seriesList.map(s => mapSeriesToApp(s));

        if (limit > 0) {
            mapped = mapped.slice(0, limit);
        }

        return NextResponse.json(mapped);
    } catch (error) {
        console.error('Error fetching series:', error);
        return NextResponse.json({ error: 'Failed to fetch series' }, { status: 500 });
    }
}
