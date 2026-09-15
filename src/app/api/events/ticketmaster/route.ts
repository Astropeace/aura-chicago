import { NextResponse } from 'next/server';
import { EventData } from '@/data/mockEvents';

export async function GET() {
  const TM_KEY = process.env.TM_CONSUMER_KEY;
  
  if (!TM_KEY) {
    return NextResponse.json({ error: 'Ticketmaster API key missing' }, { status: 500 });
  }

  try {
    // Fetch upcoming events in Chicago, pull 100 for better coverage
    const res = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?city=Chicago&apikey=${TM_KEY}&size=100&sort=date,asc`);
    
    if (!res.ok) {
      throw new Error(`Ticketmaster API returned ${res.status}`);
    }

    const data = await res.json();
    const tmEvents = data._embedded?.events || [];

    // Map to our EventData interface
    const formattedEvents: EventData[] = tmEvents
      .filter((e: any) => e._embedded?.venues?.[0]?.location) // Only events with coords
      .map((e: any) => {
        const venue = e._embedded.venues[0];
        
        // Extract a clean ISO date or construct one
        const rawDate = e.dates.start.dateTime || `${e.dates.start.localDate}T${e.dates.start.localTime || '00:00:00'}Z`;

        return {
          id: e.id,
          title: e.name,
          description: `Live at ${venue.name}. ${e.classifications?.[0]?.genre?.name || 'Live Event'}.`,
          latitude: parseFloat(venue.location.latitude),
          longitude: parseFloat(venue.location.longitude),
          date: `${e.dates.start.localDate} @ ${e.dates.start.localTime || 'TBA'}`,
          isoDate: rawDate,
          imageUrl: e.images?.find((img: any) => img.ratio === '16_9')?.url || e.images?.[0]?.url || '',
          source: 'Ticketmaster'
        };
      });

    return NextResponse.json({ events: formattedEvents });

  } catch (error: any) {
    console.error('TM Fetch Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
