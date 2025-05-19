import React, { useState } from 'react';
import LocationMap from './LocationMap'; // Import the LocationMap component

interface Request {
  id: number;
  customerName: string;
  location: string;
  fare: string;
}

const requests: Request[] = [
  { id: 1, customerName: 'John Doe', location: 'Downtown', fare: '$50' },
  { id: 2, customerName: 'Jane Smith', location: 'Uptown', fare: '$60' },
  // Add more requests as needed
];

const ListOrders: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const handleViewLocation = (request: Request) => {
    setSelectedRequest(request);
  };

  const closeModal = () => {
    setSelectedRequest(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 overflow-hidden">
      <div className="max-w-full mx-auto bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-blue-600">
            PaaniHub Driver Dashboard
          </h1>
        </header>
        
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
            Incoming Requests
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto bg-white">
              <thead>
                <tr>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 border-b text-blue-600 text-xs sm:text-sm">ID</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 border-b text-blue-600 text-xs sm:text-sm">Customer Name</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 border-b text-blue-600 text-xs sm:text-sm">Location</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 border-b text-blue-600 text-xs sm:text-sm">Fare</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 border-b text-blue-600 text-xs sm:text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr 
                    key={request.id} 
                    className="text-center hover:bg-gray-50 transition-transform transform duration-300 ease-in-out"
                  >
                    <td className="px-2 py-2 sm:px-4 sm:py-3 border-b text-gray-700 text-xs sm:text-sm">{request.id}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 border-b text-gray-700 text-xs sm:text-sm">{request.customerName}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 border-b text-gray-700 text-xs sm:text-sm">{request.location}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 border-b text-gray-700 text-xs sm:text-sm">{request.fare}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 border-b">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button className="bg-yellow-400 text-gray-800 px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-300 text-xs sm:text-sm transform hover:scale-105">
                          + Bid
                        </button>
                        <button className="bg-green-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-green-400 transition-colors duration-300 text-xs sm:text-sm transform hover:scale-105">
                          Accept
                        </button>
                        <button className="bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-red-400 transition-colors duration-300 text-xs sm:text-sm transform hover:scale-105">
                          Reject
                        </button>
                        <button 
                          className="bg-blue-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-blue-400 transition-colors duration-300 text-xs sm:text-sm transform hover:scale-105"
                          onClick={() => handleViewLocation(request)}
                        >
                          View Location
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Modal for Viewing Location */}
      {selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedRequest.customerName}'s Location
            </h3>
            <LocationMap location={selectedRequest.location} />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 transition-colors duration-300 mt-4"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOrders;
