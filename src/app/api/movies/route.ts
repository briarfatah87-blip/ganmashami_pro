import { NextResponse } from 'next/server';
import { getVodStreams, getVodCategories, mapVodToMovie } from '@/lib/xtream-api';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('category_id') || undefined;
        const limit = parseInt(searchParams.get('limit') || '0');

        const [streams, categories] = await Promise.all([
            getVodStreams(categoryId),
            getVodCategories(),
        ]);

        // Build category name lookup
        const categoryMap = new Map(categories.map(c => [c.category_id, c.category_name]));

        // Xtream "added" is a unix timestamp string; sort newest first for homepage/slider freshness.
        const sortedStreams = [...streams].sort((a, b) => {
            const aAdded = Number(a.added) || 0;
            const bAdded = Number(b.added) || 0;
            return bAdded - aAdded;
        });

        let movies = sortedStreams.map(s => mapVodToMovie(s, categoryMap.get(s.category_id)));

        if (limit > 0) {
            movies = movies.slice(0, limit);
        }

        return NextResponse.json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
    }
}
