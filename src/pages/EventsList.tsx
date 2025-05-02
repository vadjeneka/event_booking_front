import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '../services/api';
import { Event } from '../types';


const EventsList: React.FC = () => {
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: () => eventService.getAllEvents(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">Failed to load events</div>
      </div>
    );
  }

  const now = new Date();
  
  const upcomingEvents = events?.filter(event => {
    const startTime = new Date(event.start_time);
    return startTime >= now;
  }) || [];

  const pastEvents = events?.filter(event => {
    const startTime = new Date(event.start_time);
    return startTime < now;
  }) || [];

  const renderEventCard = (event: Event) => {
    const isEventExpired = new Date(event.end_time) < now;
    const isSoldOut = event.seats_available === 0;

    return (
      <div
        key={event.id}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {event.title}
            </h2>
            {isEventExpired && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Expiré
              </span>
            )}
            {isSoldOut && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Sold Out
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-4">{event.description}</p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Date: {new Date(event.start_time).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Heure: {new Date(event.start_time).toLocaleTimeString()} - {new Date(event.end_time).toLocaleTimeString()}
            </p>
            <p className="text-sm text-gray-500">
              Lieu: {event.location}
            </p>
            <p className="text-sm text-gray-500">
              Places disponibles: {event.seats_available}
            </p>
          </div>
          <div className="mt-4">
            <Link
              to={`/events/${event.id}`}
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Voir les détails
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="events">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Événements à venir</h1>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map(renderEventCard)}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Aucun événement à venir</p>
        )}

        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 mt-3">Événements passés</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map(renderEventCard)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;