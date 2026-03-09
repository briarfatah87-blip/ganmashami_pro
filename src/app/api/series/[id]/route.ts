import { NextResponse } from 'next/server';
import { getSeriesInfo, mapSeriesInfoToApp } from '@/lib/xtream-api';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const info = await getSeriesInfo(id);
        const mapped = mapSeriesInfoToApp(info, id);
        return NextResponse.json(mapped);
    } catch (error) {
        console.error('Error fetching series info:', error);
        return NextResponse.json({ error: 'Failed to fetch series info' }, { status: 500 });
    }
}
