import React, { Component } from "react";

type Complaint = {
  id: number;
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved";
};

interface State {
  complaints: Complaint[];
  showModal: boolean;
  newComplaintTitle: string;
  newComplaintDescription: string;
  newComplaintStatus: "Open" | "In Progress" | "Resolved";
}

class ComplaintTracker extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      complaints: [
        {
          id: 1,
          title: "Missed water delivery",
          description:
            "The scheduled water delivery didn’t arrive at the designated time.",
          status: "Open",
        },
        {
          id: 2,
          title: "Wrong delivery location",
          description: "Water was delivered to the wrong address.",
          status: "In Progress",
        },
        {
          id: 3,
          title: "Contaminated water received",
          description:
            "The water delivered appeared dirty and unfit for consumption.",
          status: "Resolved",
        },
      ],
      showModal: false,
      newComplaintTitle: "",
      newComplaintDescription: "",
      newComplaintStatus: "Open",
    };
  }

  // Handle opening modal
  openModal = () => {
    this.setState({ showModal: true });
  };

  // Handle closing modal
  closeModal = () => {
    this.setState({ showModal: false });
  };

  // Handle adding new complaint
  handleAddComplaint = () => {
    const { newComplaintTitle, newComplaintDescription, newComplaintStatus } =
      this.state;
    const newComplaint: Complaint = {
      id: Math.floor(Math.random() * 1000), // Generating a random id for now
      title: newComplaintTitle,
      description: newComplaintDescription,
      status: newComplaintStatus,
    };

    this.setState((prevState) => ({
      complaints: [...prevState.complaints, newComplaint],
      showModal: false, // Close modal after adding complaint
      newComplaintTitle: "",
      newComplaintDescription: "",
      newComplaintStatus: "Open",
    }));
  };

  render() {
    const {
      complaints,
      showModal,
      newComplaintTitle,
      newComplaintDescription,
      newComplaintStatus,
    } = this.state;

    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-screen-xl mx-auto">
          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-gray-700 mb-8">
            Water Delivery Complaint Tracker
          </h1>

          {/* Complaint Table (For larger screens) */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="flex justify-between items-center bg-blue-600 p-4 text-white">
              <h2 className="text-xl font-semibold">Complaints</h2>
              <button
                onClick={this.openModal}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
              >
                Add New Complaint
              </button>
            </div>

            {/* Desktop/tablet view - Complaint Table */}
            <div className="hidden sm:block">
              <table className="min-w-full table-auto mt-4">
                <thead className="bg-gray-200 text-left">
                  <tr>
                    <th className="px-4 py-2 text-sm font-semibold">
                      Complaint Title
                    </th>
                    <th className="px-4 py-2 text-sm font-semibold">
                      Description
                    </th>
                    <th className="px-4 py-2 text-sm font-semibold">Status</th>
                    <th className="px-4 py-2 text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr
                      key={complaint.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-2">{complaint.title}</td>
                      <td className="px-4 py-2">{complaint.description}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-white ${
                            complaint.status === "Open"
                              ? "bg-red-500"
                              : complaint.status === "In Progress"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        >
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view - Stacked Complaints */}
            <div className="block sm:hidden">
              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="bg-white p-4 mb-4 border rounded-lg shadow-md"
                >
                  <h3 className="text-lg font-semibold">{complaint.title}</h3>
                  <p className="text-sm text-gray-600">
                    {complaint.description}
                  </p>
                  <span
                    className={`px-3 py-1 mt-2 inline-block rounded-full text-white ${
                      complaint.status === "Open"
                        ? "bg-red-500"
                        : complaint.status === "In Progress"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {complaint.status}
                  </span>
                  <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Complaint Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg sm:w-11/12 md:w-1/2">
                <h2 className="text-2xl font-bold mb-4">Add New Complaint</h2>

                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-semibold mb-2"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newComplaintTitle}
                    onChange={(e) =>
                      this.setState({ newComplaintTitle: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newComplaintDescription}
                    onChange={(e) =>
                      this.setState({ newComplaintDescription: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="status"
                    className="block text-sm font-semibold mb-2"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={newComplaintStatus}
                    onChange={(e) =>
                      this.setState({
                        newComplaintStatus: e.target.value as
                          | "Open"
                          | "In Progress"
                          | "Resolved",
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={this.closeModal}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={this.handleAddComplaint}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                  >
                    Add Complaint
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ComplaintTracker;
