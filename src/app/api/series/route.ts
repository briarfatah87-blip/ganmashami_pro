import { NextResponse } from 'next/server';
import { getSeries, mapSeriesToApp } from '@/lib/xtream-api';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('category_id') || undefined;
        const limit = parseInt(searchParams.get('limit') || '0');

        const seriesList = await getSeries(categoryId);
        // Xtream "last_modified" is a unix timestamp string; show newest updates first.
        const sortedSeries = [...seriesList].sort((a, b) => {
            const aModified = Number(a.last_modified) || 0;
            const bModified = Number(b.last_modified) || 0;
            return bModified - aModified;
        });

        let mapped = sortedSeries.map(s => mapSeriesToApp(s));

        if (limit > 0) {
            mapped = mapped.slice(0, limit);
        }

        return NextResponse.json(mapped);
    } catch (error) {
        console.error('Error fetching series:', error);
        return NextResponse.json({ error: 'Failed to fetch series' }, { status: 500 });
    }
}
