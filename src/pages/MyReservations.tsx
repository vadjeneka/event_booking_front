import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { reservationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Reservation } from '../types';

const MyReservations: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { data: reservations, isLoading, error } = useQuery<Reservation[]>({
    queryKey: ['reservations'],
    queryFn: () => reservationService.getUserReservations(),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Connectez-vous pour voir vos réservations
          </h2>
          <Link
            to="/login"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Connexion
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">Échec du chargement des réservations</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes réservations</h1>
        {!reservations || reservations.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-600">Aucune réservation trouvée</h2>
            <Link
              to="/events"
              className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Parcourir les événements
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {reservation.event.title}
                  </h2>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      Date: {new Date(reservation.event.start_time).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Lieu: {reservation.event.location}
                    </p>
                    <p className="text-sm text-gray-500">
                      Billets: {reservation.tickets}
                    </p>
                    <p className="text-sm text-gray-500">
                      Réservé le: {new Date(reservation.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link
                      to={`/events/${reservation.event.id}`}
                      className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Voir l'événement
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservations;