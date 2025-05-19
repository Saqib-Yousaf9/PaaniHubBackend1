import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

type User = {
  id: number;
  name: string;
  email: string;
  city: string;
  address: string;
};

type Driver = {
  id: number;
  name: string;
  email: string;
  city: string;
  address: string;
  vehicleNumber: string;
};

const Index: React.FC = () => {
  const [usersData, setUsersData] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@example.com", city: "New York", address: "1234 Main St" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", city: "Los Angeles", address: "5678 Sunset Blvd" },
  ]);

  const [driversData, setDriversData] = useState<Driver[]>([
    { id: 1, name: "Mike Johnson", email: "mike@example.com", city: "San Francisco", address: "3456 Pine St", vehicleNumber: "ABC1234" },
    { id: 2, name: "Nina Williams", email: "nina@example.com", city: "Seattle", address: "4567 Elm St", vehicleNumber: "DEF5678" },
  ]);

  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRow, setSelectedRow] = useState<User | Driver | null>(null);
  const [isDriver, setIsDriver] = useState<boolean>(false);
  const [editDetails, setEditDetails] = useState<User | Driver | null>(null);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);

  const paginate = (data: User[] | Driver[]) => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = data.slice(start, end);

    return (
      <tbody>
        {pageData.length === 0 ? (
          <tr>
            <td colSpan={isDriver ? 6 : 5} className="text-center py-4">No data available</td>
          </tr>
        ) : (
          pageData.map(item => (
            <tr key={item.id}>
              {Object.keys(item).map((key, index) => {
                if (index < 4 || (isDriver && key === 'vehicleNumber')) {
                  return <td key={key} className="p-2">{item[key as keyof typeof item]}</td>;
                }
                return null;
              })}
              <td className="p-2">
                <button className="bg-blue-500 text-white py-1 px-2 rounded mr-2" onClick={() => showModal(item)}>Edit</button>
                <button className="bg-red-500 text-white py-1 px-2 rounded mr-2" onClick={() => handleDelete(item)}>Delete</button>
                <button className="bg-teal-500 text-white py-1 px-2 rounded" onClick={() => handleView(item)}>View</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    );
  };

  const showModal = (details: User | Driver) => {
    setSelectedRow(details);
    setIsDriver('vehicleNumber' in details);
    setEditDetails(details);
    setIsViewMode(false);
  };

  const handleView = (details: User | Driver) => {
    setSelectedRow(details);
    setIsDriver('vehicleNumber' in details);
    setEditDetails(details);
    setIsViewMode(true);
  };

  const handleDelete = (item: User | Driver) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      if (isDriver) {
        setDriversData(prev => prev.filter(driver => driver.id !== item.id));
      } else {
        setUsersData(prev => prev.filter(user => user.id !== item.id));
      }
      setSelectedRow(null);
      alert('Deleted successfully');
    }
  };

  return (
    <div className="container mx-auto px-4 mt-4">
      <h1 className="text-center mb-4 text-3xl text-teal-600">PaaniHub Admin Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">App Users</h2>
        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">City</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          {paginate(usersData)}
        </table>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Drivers</h2>
        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">City</th>
              <th className="border px-4 py-2">Vehicle Number</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          {paginate(driversData)}
        </table>
      </section>

      {selectedRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 max-w-lg">
            <h3 className="text-xl font-semibold mb-4 text-teal-600">
              {isViewMode ? (isDriver ? 'View Driver' : 'View User') : (isDriver ? 'Edit Driver' : 'Edit User')}
            </h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block text-gray-700">Name:</label>
                <input className="border border-gray-300 p-2 w-full rounded" type="text" defaultValue={(editDetails as User | Driver)?.name} readOnly={isViewMode} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email:</label>
                <input className="border border-gray-300 p-2 w-full rounded" type="email" defaultValue={(editDetails as User | Driver)?.email} readOnly={isViewMode} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">City:</label>
                <input className="border border-gray-300 p-2 w-full rounded" type="text" defaultValue={(editDetails as User | Driver)?.city} readOnly={isViewMode} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Address:</label>
                <input className="border border-gray-300 p-2 w-full rounded" type="text" defaultValue={(editDetails as User | Driver)?.address} readOnly={isViewMode} />
              </div>
              {isDriver && (
                <div className="mb-4">
                  <label className="block text-gray-700">Vehicle Number:</label>
                  <input className="border border-gray-300 p-2 w-full rounded" type="text" defaultValue={(editDetails as Driver)?.vehicleNumber} readOnly={isViewMode} />
                </div>
              )}
              <div className="flex justify-end">
                {!isViewMode && (
                  <button type="submit" className="bg-teal-600 text-white py-2 px-4 rounded mr-2">Save</button>
                )}
                <button type="button" className="bg-gray-400 text-white py-2 px-4 rounded" onClick={() => setSelectedRow(null)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
