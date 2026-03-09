import { NextResponse } from 'next/server';
import { getVodInfo, mapVodInfoToMovie } from '@/lib/xtream-api';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const info = await getVodInfo(id);
        const mapped = mapVodInfoToMovie(info);
        // Inject the correct ID from the URL
        mapped.id = `movie-${id}`;
        return NextResponse.json(mapped);
    } catch (error) {
        console.error('Error fetching movie info:', error);
        return NextResponse.json({ error: 'Failed to fetch movie info' }, { status: 500 });
    }
}
