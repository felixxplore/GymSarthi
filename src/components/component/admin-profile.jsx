import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { getAdminInfo, updateAdminInfo } from "@/redux/adminSlice";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserDetails, uploadUserPhoto } from "@/redux/userSlice";

export const AdminProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, error } = useSelector((state) => state.user);
  const { adminInfo } = useSelector((state) => state.admin);

  useEffect(() => {
    if (user) {
      dispatch(getAdminInfo());
    } else {
      navigate("/signin");
    }
  }, [dispatch, user, navigate]);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [contact, setContact] = useState("");
  const [gymAddress, setGymAddress] = useState("");
  const [ownerInformation, setOwnerInformation] = useState("");
  const [achievements, setAchievements] = useState("");
  const [experience, setExperience] = useState("");
  const [sponsors, setSponsors] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false); // State to track changes
  const [photo, setPhoto] = useState(null);
  const [imageUrl, setImageUrl] = useState(user?.photoUrl || ""); // State to track image URL

  useEffect(() => {
    if (adminInfo) {
      setNewName(adminInfo.name || "");
      setNewEmail(adminInfo.email || "");
      setContact(adminInfo.contact || "");
      setGymAddress(adminInfo.gymAddress || "");
      setOwnerInformation(adminInfo.ownerInformation || "");
      setAchievements(adminInfo.achievements || "");
      setExperience(adminInfo.experience || "");
      setSponsors(adminInfo.sponsors || "");
    }
  }, [adminInfo]);

  useEffect(() => {
    if (user?.photoUrl) {
      setImageUrl(user.photoUrl); // Update image URL when user photo changes
    }
  }, [user?.photoUrl]);

  const handleFieldChange = () => {
    setIsDirty(true); // Mark form as dirty when any field changes
  };

  const handleEditButton = () => {
    setIsEditMode(!isEditMode);
  };

  const handleCancelButton = () => {
    setIsDirty(false);
    setIsEditMode(false);
  };

  // photo upload :

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (photo && user) {
      try {
        await dispatch(uploadUserPhoto({ userId: user._id, photo }));
        // Fetch the updated user details to get the new photo URL
        await dispatch(getUserDetails());
        toast.success("Photo uploaded successfully");
        setIsEditMode(false);
      } catch (err) {
        toast.error("Failed to upload photo");
      }
    }

    if (!isDirty) return; // Do nothing if no changes

    setIsEditMode(false);
    try {
      const adminData = {
        name: newName,
        email: newEmail,
        contact,
        gymAddress,
        ownerInformation,
        achievements,
        experience,
        sponsors,
      };

      await dispatch(updateAdminInfo(adminData));

      // Upload photo if exists
      //  if (photo) {
      //   await handleUpload();
      // }
      toast.success("Admin Info Successfully updated");
    } catch (error) {
      toast.error("Something went wrong during the update");
    }
  };

 
  if (!adminInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full gap-6 p-6 sm:gap-8 sm:p-10 mt-[-90px]">
      <header className="w-full ml-12 sm:mb-1">
        <h1
          className={`text-4xl font-bold transition duration-300 ${"text-gray-900 dark:text-white"}`}
        >
          Admin Profile
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Detailed information about the gym admin.
        </p>
      </header>

      <main className="grid flex-1 gap-6 p-6 sm:gap-10 sm:px-12 sm:py-6 md:gap-12 lg:grid-cols-2 xl:grid-cols-3 mt-[-50px]">
        <div className="grid gap-8 lg:col-span-2 xl:col-span-3">
          <Card
            className={`transition duration-300 ${
              isEditMode ? "border-purple-500 shadow-2xl" : ""
            }`}
          >
            <CardContent>
              <div className="flex flex-col items-center gap-8 md:flex-row">
                <div className="relative">
                  {isEditMode ? (
                    <div>
                      <Input type="file" onChange={handleFileChange} />
                      {error && <p className="text-red-500">Error: {error}</p>}
                    </div>
                  ) : (
                    <div>
                      {imageUrl ? (
                        <img
                          src={`${imageUrl}`}
                          alt="user"
                          className="object-cover w-32 h-32 transition-transform border-4 border-purple-500 rounded-full shadow-lg hover:scale-105"
                        />
                      ) : (
                        <p className="text-gray-300">No photo uploaded</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid flex-1 gap-6 md:grid-cols-2">
                  {[
                    ["name", newName, setNewName],
                    ["email", newEmail, setNewEmail],
                    ["contact", contact, setContact],
                    ["address", gymAddress, setGymAddress],
                  ].map(([id, value, setter]) => (
                    <div key={id}>
                      <Label htmlFor={id} className="text-gray-300 capitalize">
                        {id.replace("_", " ")}
                      </Label>
                      <Input
                        id={id}
                        type={
                          id === "email"
                            ? "email"
                            : id === "contact"
                            ? "tel"
                            : "text"
                        }
                        value={value}
                        onChange={(e) => {
                          setter(e.target.value);
                          handleFieldChange();
                        }}
                        disabled={!isEditMode}
                        className={`w-full p-3 mt-2 text-white border rounded-lg transition duration-300 ${
                          isEditMode
                            ? "border-purple-500 bg-gray-900 shadow-lg focus:ring-purple-500 focus:border-purple-400"
                            : "border-gray-600 bg-gray-800"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {[
                  ["owner", ownerInformation, setOwnerInformation],
                  ["achievements", achievements, setAchievements],
                  ["experience", experience, setExperience],
                  ["sponsors", sponsors, setSponsors],
                ].map(([id, value, setter]) => (
                  <div key={id}>
                    <Label htmlFor={id} className="text-gray-300 capitalize">
                      {id.replace("_", " ")}
                    </Label>
                    <Textarea
                      id={id}
                      value={value}
                      onChange={(e) => {
                        setter(e.target.value);
                        handleFieldChange();
                      }}
                      disabled={!isEditMode}
                      className={`w-full p-3 mt-2 text-white border rounded-lg transition duration-300 ${
                        isEditMode
                          ? "border-purple-500 bg-gray-900 shadow-lg focus:ring-purple-500 focus:border-purple-400"
                          : "border-gray-600 bg-gray-800"
                      } min-h-[100px]`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter>
              {isEditMode ? (
                <div className="flex gap-4">
                  <Button
                    className="px-6 py-2 text-white transition-all duration-300 transform bg-green-600 shadow-lg hover:scale-110 hover:bg-green-700 focus:ring-2 focus:ring-green-400"
                    onClick={handleUpdate}
                  >
                    ✅ Save Changes
                  </Button>
                  <Button
                    className="px-6 py-2 text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:scale-110 hover:bg-red-700 focus:ring-2 focus:ring-red-400"
                    onClick={handleCancelButton}
                  >
                    ❌ Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  className="px-6 py-2 text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:scale-110 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
                  onClick={handleEditButton}
                >
                  ✏️ Edit
                </Button>
              )}
            </CardFooter>
            <ToastContainer />
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;

function BarChartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}

function ClipboardIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

function CreditCardIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function DumbbellIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.4 14.4 9.6 9.6" />
      <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
      <path d="m21.5 21.5-1.4-1.4" />
      <path d="M3.9 3.9 2.5 2.5" />
      <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
    </svg>
  );
}

function LayoutDashboardIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
