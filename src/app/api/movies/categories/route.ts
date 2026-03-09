import { NextResponse } from 'next/server';
import { getVodCategories } from '@/lib/xtream-api';

export async function GET() {
    try {
        const categories = await getVodCategories();
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching movie categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
