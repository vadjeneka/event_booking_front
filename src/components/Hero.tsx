import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gray-900">
      {/* Image de fond */}
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover opacity-50"
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Event background"
        />
      </div>
      
      {/* Contenu */}
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Découvrez des événements exceptionnels
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            Réservez vos places pour les meilleurs événements de votre ville. 
            Des concerts, des conférences, des expositions et bien plus encore.
          </p>
          <div className="mt-10">
            <a
              href="/events"
              className="inline-block bg-indigo-600 py-3 px-8 border border-transparent rounded-md text-base font-medium text-white hover:bg-indigo-700"
            >
              Voir les événements
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;