import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Event } from '../types';
import { showSuccessToast, showErrorToast, showWarningToast } from '../utils/toast';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState(1);
  const [error, setError] = useState('');

  const { data: event, isLoading } = useQuery<Event>({
    queryKey: ['event', id],
    queryFn: () => eventService.getEventById(id!),
    enabled: !!id,
  });

  const handleReservation = async () => {
    if (!isAuthenticated) {
      showWarningToast('Vous devez être connecté pour réserver un billet');
      navigate('/login');
      return;
    }

    try {
      if (!id) return;
      await eventService.createReservation(id, { tickets });
      showSuccessToast('Réservation créée avec succès!');
      navigate('/my-reservations');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Échec de la création de la réservation';
      showErrorToast(errorMessage);
      setError(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">Événement non trouvé</div>
      </div>
    );
  }

  const isEventExpired = new Date(event.end_time) < new Date();
  const isSoldOut = event.seats_available === 0;
  const canMakeReservation = !isEventExpired && !isSoldOut && isAuthenticated;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {event.title}
              </h1>
              {isEventExpired && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Expiré
                </span>
              )}
              {isSoldOut && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Sold Out
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-6">{event.description}</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-gray-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-700">
                  {new Date(event.start_time).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-gray-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-gray-700">{event.location}</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-gray-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-700">
                  Available Seats: {event.seats_available}
                </span>
              </div>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-gray-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-700">Prix: 50€</span>
              </div>
            </div>
            {!isEventExpired && !isSoldOut && (
              <div className="mt-6">
                <label htmlFor="tickets" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de billets
                </label>
                <input
                  type="number"
                  id="tickets"
                  min="1"
                  max={event.seats_available}
                  value={tickets}
                  onChange={(e) => setTickets(Math.min(Number(e.target.value), event.seats_available))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            <div className="mt-6">
              {!isAuthenticated ? (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Connexion pour réserver
                </button>
              ) : isEventExpired ? (
                <button
                  disabled
                  className="w-full bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed"
                >
                  Événement expiré
                </button>
              ) : isSoldOut ? (
                <button
                  disabled
                  className="w-full bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed"
                >
                  Sold Out
                </button>
              ) : (
                <button
                  onClick={handleReservation}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Réserver
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 