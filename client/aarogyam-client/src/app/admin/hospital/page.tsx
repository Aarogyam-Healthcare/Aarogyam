"use client";
import { useEffect, useState } from "react";
import {
  ClipboardList,
  Link,
  Mail,
  MapPin,
  Phone,
  PlusCircle,
  Trash2,
} from "lucide-react"; // Import Lucide Icons
import api from "@/lib/api";
import CreatableReactSelect from "react-select/creatable";

interface Hospital {
  id: number;
  name: string;
  address: string;
  website: string;
  services: string;
  phone: string;
  email: string;
}

const HospitalsPage = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(
    null
  );
  const [newHospital, setNewHospital] = useState<Hospital>({
    id: 0,
    name: "",
    address: "",
    website: "",
    services: "",
    phone: "",
    email: "",
  });
  const [warningMessage, setWarningMessage] = useState<string>("");

  useEffect(() => {
    // Simulate fetching hospital data
    const fetchHospitals = async () => {
      const data: Hospital[] = [
        {
          id: 1,
          name: "City Hospital",
          address: "Downtown",
          website: "https://cityhospital.com",
          services: "Emergency, Surgery, General Medicine",
          phone: "123-456-7890",
          email: "abc@gmail.com",
        },
        {
          id: 2,
          name: "Greenwood Clinic",
          address: "Suburb",
          website: "https://greenwoodclinic.com",
          services: "Primary Care, Pediatrics, Dermatology",
          phone: "234-567-8901",
          email: "abc@gmail.com",
        },
        {
          id: 3,
          name: "Northside Health Center",
          address: "Northside",
          website: "https://northsidehealth.com",
          services: "Orthopedics, Cardiology, Neurology",
          phone: "345-678-9012",
          email: "abc@gmail.com",
        },
      ];

      const response = await api.get("hospital");
      console.log(response);
      setHospitals(response.data.data);
      console.log(typeof hospitals);
    };

    fetchHospitals();
  }, []);

  const handleDelete = () => {
    if (selectedHospitalId !== null) {
      setHospitals((prevHospitals) =>
        prevHospitals.filter((hospital) => hospital.id !== selectedHospitalId)
      );
    }
    setShowDeleteModal(false); // Close modal after deletion
  };

  const openDeleteModal = (hospitalId: number) => {
    setSelectedHospitalId(hospitalId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewHospital({
      id: 0,
      name: "",
      address: "",
      website: "",
      services: "",
      phone: "",
      email: "",
    });
    setWarningMessage("");
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddHospital = () => {
    if (
      !newHospital.name ||
      !newHospital.address ||
      !newHospital.website ||
      !newHospital.services ||
      !newHospital.phone ||
      !newHospital.email
    ) {
      setWarningMessage(
        "Please fill in all fields before adding the hospital."
      );
    } else if (!validateEmail(newHospital.email)) {
      setWarningMessage("Please enter a valid email address.");
    } else {
      console.log(newHospital);

      const addHospital = async () => {
        try {
          const { id, ...hospital } = newHospital;
          const response = await api.post("hospital", hospital);
          console.log(response);
          setHospitals((prevHospitals) => [...prevHospitals]);
        } catch (error) {}
      };
      setHospitals((prevHospitals) => [
        ...prevHospitals,
        { ...newHospital, id: prevHospitals.length + 1 },
      ]);
      addHospital();
      closeAddModal();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Hospital List</h1>

      {/* Add Hospital Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition-colors duration-300"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Hospital
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {hospitals.map((hospital) => (
          <div
            key={hospital.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:border hover:border-blue-500"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-2">{hospital.name}</h2>
              <button
                onClick={() => openDeleteModal(hospital.id)}
                className="text-red-600 hover:text-red-800 focus:outline-none transition-colors duration-300"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" />
              <p>{hospital.address}</p>
            </div>

            <div className="flex items-center text-gray-600 mb-2">
              <Link className="w-5 h-5 mr-2 text-blue-500" />
              <a
                href={hospital.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {hospital.website}
              </a>
            </div>

            <div className="flex items-center text-gray-600 mb-2">
              <ClipboardList className="w-5 h-5 mr-2 text-blue-500" />
              <p>{hospital.services.join(",")}</p>
            </div>

            <div className="flex items-center text-gray-600 mb-2">
              <Phone className="w-5 h-5 mr-2 text-blue-500" />
              <p>{hospital.phone}</p>
            </div>

            <div className="flex items-center text-gray-600">
              <Mail className="w-5 h-5 mr-2 text-blue-500" />
              <p>{hospital.email}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this hospital?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Hospital Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Hospital</h2>
            {warningMessage && (
              <div className="text-red-600 mb-4">{warningMessage}</div>
            )}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Hospital Name"
                value={newHospital.name}
                onChange={(e) =>
                  setNewHospital((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              <input
                type="text"
                placeholder="Location"
                value={newHospital.address}
                onChange={(e) =>
                  setNewHospital((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              <input
                type="text"
                placeholder="Website URL"
                value={newHospital.website}
                onChange={(e) =>
                  setNewHospital((prev) => ({
                    ...prev,
                    website: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              {/* <input
                type="text"
                placeholder="Services"
                value={newHospital.services}
                onChange={(e) =>
                  setNewHospital((prev) => ({
                    ...prev,
                    services: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              /> */}
              <CreatableReactSelect
                isMulti
                placeholder="Select or create specialities"
                className="react-select-container"
                classNamePrefix="react-select"
                onChange={(selectedOptions) =>
                  // @ts-ignore
                  setNewHospital((prev) => ({
                    ...prev,
                    services: selectedOptions
                      ? // @ts-ignore
                        selectedOptions.map((option) => option.value)
                      : [],
                  }))
                }
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused
                      ? "hsl(var(--ring))"
                      : "hsl(var(--input))",
                    boxShadow: state.isFocused
                      ? "0 0 0 1px hsl(var(--ring))"
                      : "none",
                    "&:hover": {
                      borderColor: "hsl(var(--input))",
                    },
                  }),
                  option: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: state.isFocused
                      ? "hsl(var(--accent))"
                      : "transparent",
                    color: state.isFocused
                      ? "hsl(var(--accent-foreground))"
                      : "inherit",
                  }),
                  multiValue: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: "hsl(var(--secondary))",
                  }),
                  multiValueLabel: (baseStyles) => ({
                    ...baseStyles,
                    color: "hsl(var(--secondary-foreground))",
                  }),
                  multiValueRemove: (baseStyles) => ({
                    ...baseStyles,
                    color: "hsl(var(--secondary-foreground))",
                    "&:hover": {
                      backgroundColor: "hsl(var(--destructive))",
                      color: "hsl(var(--destructive-foreground))",
                    },
                  }),
                }}
              />
              <input
                type="text"
                placeholder="Phone"
                value={newHospital.phone}
                onChange={(e) =>
                  setNewHospital((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              <input
                type="text"
                placeholder="Email"
                value={newHospital.email}
                onChange={(e) =>
                  setNewHospital((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeAddModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHospital}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-300"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalsPage;
