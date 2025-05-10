import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Table } from "../ui/table";
import {
  createSlot,
  deleteSlot,
  fetchAvailableSlots,
  updateSlotByAdmin,
} from "@/redux/slotSlice";
import { motion } from "framer-motion";
import AdminSidePanel from "@/Component/AdminSidePanel";
import { getUserDetails, getUserDetailsById } from "@/redux/userSlice";

const AdminSlotManagement = () => {
  const dispatch = useDispatch();
  const { slots, loading } = useSelector((state) => state.slot);

  const [slotData, setSlotData] = useState({
    startTime: "",
    endTime: "",
    maxCapacity: "",
  });

  const [editSlot, setEditSlot] = useState(null); // State to store selected slot for editing

  useEffect(() => {
    dispatch(fetchAvailableSlots());
  }, [dispatch]);

  const handleInputChange = (e) => {
    setSlotData({ ...slotData, [e.target.name]: e.target.value });
  };

  const handleCreateSlot = () => {
    if (slotData.startTime && slotData.endTime && slotData.maxCapacity) {
      dispatch(createSlot(slotData));
      setSlotData({ startTime: "", endTime: "", maxCapacity: "" });
    }
  };

  const handleDeleteSlot = (slotId) => {
    dispatch(deleteSlot(slotId));
  };

  const handleEditClick = (slot) => {
    setEditSlot({ ...slot }); // Open modal with selected slot details
  };

  const handleEditChange = (e) => {
    setEditSlot({ ...editSlot, [e.target.name]: e.target.value });
  };

  const handleUpdateSlot = () => {
    if (editSlot) {
      console.log("edit slot", editSlot);
      dispatch(updateSlotByAdmin(editSlot)).then(() => {
        setEditSlot(null); // Close modal after updating
        dispatch(fetchAvailableSlots()); // Refresh slots
      });
    }
  };

  const [users, setUsers] = useState({}); // Store user details

  const fetchUserDetails = async (userId) => {
    if (!users[userId]) {
      // Prevent duplicate API calls
    //   const data = await getUserDetailsById(userId);

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/userinfo/${userId}`); // Backend API
    const data = await response.json();
      setUsers((prev) => ({ ...prev, [userId]: data })); // Save user details
    }
  };
  useEffect(() => {
    slots.forEach((slot) => {
      slot.bookedMembers.forEach((userId) => fetchUserDetails(userId));
      slot.waitlist.forEach((userId) => fetchUserDetails(userId));
    });
  }, [slots]);

  return (
    <AdminSidePanel>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-xl font-bold mb-4">Admin Slot Management</h2>

        {/* Create Slot Form */}
        <div className="flex gap-4 mb-6">
          <Input
            type="text"
            name="startTime"
            placeholder="Start Time (08:00 AM)"
            value={slotData.startTime}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            name="endTime"
            placeholder="End Time (10:00 AM)"
            value={slotData.endTime}
            onChange={handleInputChange}
          />
          <Input
            type="number"
            name="maxCapacity"
            placeholder="Max Capacity"
            value={slotData.maxCapacity}
            onChange={handleInputChange}
          />
          <Button onClick={handleCreateSlot} disabled={loading}>
            {loading ? "Adding..." : "Create Slot"}
          </Button>
        </div>

        {/* Slot List */}
        <Table>
          <thead>
            <tr>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Max Capacity</th>
              <th>Booked Members</th>
              <th>Waitlist</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id}>
                <td>{slot.startTime}</td>
                <td>{slot.endTime}</td>
                <td>{slot.maxCapacity}</td>
                <td>
                  {slot.bookedMembers.length > 0 ? (
                    <details>
                      <summary>{slot.bookedMembers.length} Members</summary>
                      <ul>
                        {slot.bookedMembers.map((userId) => (
                          <li key={userId}>
                            {users[userId]?.name || "Loading..."}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    "No Bookings"
                  )}
                </td>{" "}
                <td>
                  {slot.waitlist.length > 0 ? (
                    <details>
                      <summary>{slot.waitlist.length} Waiting</summary>
                      <ul>
                        {slot.waitlist.map((userId) => (
                          <li key={userId}>
                            {users[userId]?.name || "Loading..."}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    "No Waitlist"
                  )}
                </td>{" "}
                <td>
                  <Button
                    className="mr-2"
                    onClick={() => handleEditClick(slot)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteSlot(slot.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Edit Slot Modal */}
        {editSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-6 rounded-lg shadow-lg w-96"
            >
              <h3 className="text-xl font-semibold mb-4">Edit Slot</h3>
              <Input
                type="text"
                name="startTime"
                placeholder="Start Time"
                value={editSlot.startTime}
                onChange={handleEditChange}
                className="mb-3"
              />
              <Input
                type="text"
                name="endTime"
                placeholder="End Time"
                value={editSlot.endTime}
                onChange={handleEditChange}
                className="mb-3"
              />
              <Input
                type="number"
                name="maxCapacity"
                placeholder="Max Capacity"
                value={editSlot.maxCapacity}
                onChange={handleEditChange}
                className="mb-3"
              />
              <div className="flex justify-end">
                <Button className="mr-2" onClick={handleUpdateSlot}>
                  Update
                </Button>
                <Button variant="ghost" onClick={() => setEditSlot(null)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AdminSidePanel>
  );
};

export default AdminSlotManagement;
