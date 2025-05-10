// import {
//   getallPlansofTrainer,
//   getTrainerInfo,
//   updateTrainerInfo,
// } from "@/redux/trainerSlice";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import TrainerSidePanel from "./TrainerSidePanel";
// import { Button } from "@/components/ui/button";
// import { getUserDetails, uploadUserPhoto } from "@/redux/userSlice";
// import { toast, ToastContainer } from "react-toastify";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Label } from "@radix-ui/react-dropdown-menu";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";

// const TrainerProfile = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.user);
//   const { plans, trainerInfo } = useSelector((state) => state.trainer);

//   const navigate = useNavigate();
//   useEffect(() => {
//     if (user) {
//       dispatch(getTrainerInfo());
//       dispatch(getallPlansofTrainer());
//     }
//   }, [dispatch, user, navigate]);

//   const [newName, setNewName] = useState("");
//   const [newEmail, setNewEmail] = useState("");
//   const [expertise, setExpertise] = useState("");
//   const [experience, setExperience] = useState("");

//   const [isEditMode, setIsEditMode] = useState(false);
//   const [isDirty, setIsDirty] = useState(false); // State to track changes
//   const [photo, setPhoto] = useState(null);
//   const [imageUrl, setImageUrl] = useState(user?.photoUrl || "");

//   useEffect(() => {
//     if (trainerInfo) {
//       setNewName(trainerInfo.name || "");
//       setNewEmail(trainerInfo.email || "");
//       setExpertise(trainerInfo.expertise || "");
//       setExperience(trainerInfo.experience || "");
//     }
//   }, [trainerInfo]);

//   useEffect(() => {
//     if (user?.photoUrl) {
//       setImageUrl(user.photoUrl); // Update image URL when user photo changes
//     }
//   }, [user?.photoUrl]);

//   const handleFieldChange = () => {
//     setIsDirty(true); // Mark form as dirty when any field changes
//   };

//   const handleEditButton = () => {
//     setIsEditMode(!isEditMode);
//   };

//   const handleCancelButton = () => {
//     setIsDirty(false);
//     setIsEditMode(false);
//   };

//   const handleFileChange = (e) => {
//     setPhoto(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (photo && user) {
//       try {
//         await dispatch(uploadUserPhoto({ userId: user._id, photo }));
//         // Fetch the updated user details to get the new photo URL
//         await dispatch(getUserDetails());
//         toast.success("Photo uploaded successfully");
//       } catch (err) {
//         toast.error("Failed to upload photo");
//       }
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     handleUpload();

//     if (!isDirty) {
//       setIsEditMode(false);
//       return;
//     } // Do nothing if no changes
//     setIsEditMode(false);
//     try {
//       const trainerData = {
//         name: newName,
//         email: newEmail,
//         expertise,
//         experience,
//       };

//       await dispatch(updateTrainerInfo(trainerData));

//       // Upload photo if exists
//       //  if (photo) {
//       //   await handleUpload();
//       // }
//       toast.success("Admin Info Successfully updated");
//     } catch (error) {
//       toast.error("Something went wrong during the update");
//     }
//   };

//   if (!trainerInfo) {
//     return <Button>Trainer No data...</Button>;
//   }

 
//   return (
//     <div className="flex flex-col w-full gap-6 p-6 sm:gap-8 sm:p-10 mt-[-90px]" >

//       <div className="w-full max-w-4xl ml-12 space-y-6">

//       <header className="w-full">
//       <h1 className="text-3xl font-semibold text-black dark:text-white">
//           Trainer Profile
//           </h1>
//           <p className="mt-1 text-black dark:text-gray-400">
//           Detailed information about the gym trainer.
//           </p>
//         </header>
//     <Card className="p-6 border border-gray-700 shadow-2xl bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl">

//           <CardContent>
//             <div className="flex flex-col items-center gap-8 md:flex-row">
//               <div className="relative">
//                 <img
//                   src={imageUrl || "https://via.placeholder.com/150"}
//                   alt="Trainer"
//                   className="object-cover w-32 h-32 border-4 border-purple-500 rounded-full shadow-md"
//                 />
//                 {isEditMode && (
//                   <Input
//                     type="file"
//                     onChange={handleFileChange}
//                     className="mt-2"
//                   />
//                 )}
//               </div>

//               <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
//                 <div>
//                   <Label htmlFor="name" className="text-gray-300">
//                     Name
//                   </Label>
//                   <Input
//                     id="name"
//                     type="text"
//                     value={newName}
//                     onChange={(e) => setNewName(e.target.value)}
//                     disabled={!isEditMode}
//                     className="mt-2 text-white bg-gray-800 border-gray-600 focus:ring-purple-500"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="email" className="text-gray-300">
//                     Email
//                   </Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={newEmail}
//                     onChange={(e) => setNewEmail(e.target.value)}
//                     disabled={!isEditMode}
//                     className="mt-2 text-white bg-gray-800 border-gray-600 focus:ring-purple-500"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="expertise" className="text-gray-300">
//                     Expertise
//                   </Label>
//                   <Input
//                     id="expertise"
//                     type="text"
//                     value={expertise}
//                     onChange={(e) => setExpertise(e.target.value)}
//                     disabled={!isEditMode}
//                     className="mt-2 text-white bg-gray-800 border-gray-600 focus:ring-purple-500"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="experience" className="text-gray-300">
//                     Experience
//                   </Label>
//                   <Input
//                     id="experience"
//                     value={experience}
//                     onChange={(e) => setExperience(e.target.value)}
//                     disabled={!isEditMode}
//                     className="mt-2 text-white bg-gray-800 border-gray-600 focus:ring-purple-500"
//                   />
//                 </div>
//               </div>
//             </div>
//           </CardContent>

//           <CardFooter>
//               {isEditMode ? (
//                 <div className="flex gap-4">
//                   <Button
//                     className="px-6 py-2 text-white transition-all duration-300 transform bg-green-600 shadow-lg hover:scale-110 hover:bg-green-700 focus:ring-2 focus:ring-green-400"
//                     onClick={handleUpdate}
//                   >
//                     ✅ Save Changes
//                   </Button>
//                   <Button
//                     className="px-6 py-2 text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:scale-110 hover:bg-red-700 focus:ring-2 focus:ring-red-400"
//                     onClick={handleCancelButton}
//                   >
//                     ❌ Cancel
//                   </Button>
//                 </div>
//               ) : (
//                 <Button
//                   className="px-6 py-2 text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:scale-110 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
//                   onClick={handleEditButton}
//                 >
//                   ✏️ Edit
//                 </Button>
//               )}
//             </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default TrainerProfile;

import {
  getallPlansofTrainer,
  getTrainerInfo,
  updateTrainerInfo,
  updateTrainerProfileInfo,
} from "@/redux/trainerSlice";
import { getUserDetails, uploadUserPhoto } from "@/redux/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TrainerProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { trainerInfo } = useSelector((state) => state.trainer);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [expertise, setExpertise] = useState("");
  const [experience, setExperience] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [imageUrl, setImageUrl] = useState(user?.photoUrl || "");

  useEffect(() => {
    if (user) {
      dispatch(getTrainerInfo());
      dispatch(getallPlansofTrainer());
    }
  }, [dispatch, user, navigate]);

  useEffect(() => {
    if (trainerInfo) {
      setNewName(trainerInfo.name || "");
      setNewEmail(trainerInfo.email || "");
      setExpertise(trainerInfo.expertise || "");
      setExperience(trainerInfo.experience?.toString() || "");
    }
  }, [trainerInfo]);

  useEffect(() => {
    if (user?.photoUrl) setImageUrl(user.photoUrl);
  }, [user?.photoUrl]);

  const handleFieldChange = () => setIsDirty(true);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setPhoto(selectedFile);
      setIsDirty(true);
    }
  };

  const handleUpload = async () => {
    if (photo && user) {
      try {
        await dispatch(uploadUserPhoto({ userId: user._id, photo }));
        await dispatch(getUserDetails());
        toast.success("Photo uploaded successfully");
      } catch {
        toast.error("Failed to upload photo");
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await handleUpload();
    if (!isDirty) return setIsEditMode(false);

    try {
      const response = await dispatch(
        updateTrainerProfileInfo({
          name: newName,
          email: newEmail,
          expertise,
          experience,
        })
      );

      if (response) {
        dispatch(getTrainerInfo());
      }
      toast.success("Trainer info updated successfully");
      setIsEditMode(false);
      setIsDirty(false);
    } catch {
      toast.error("Something went wrong during the update");
    }
  };

  if (!trainerInfo) return <Button>Trainer No data...</Button>;

  const renderInputField = (id, label, value, setter, type = "text") => (
    <div>
      <Label htmlFor={id} className="text-gray-300">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={
          id === "experience" && isEditMode
            ? value
            : id === "experience"
            ? `${value} ${value === "1" ? "year" : "years"}`
            : value
        }
        onChange={(e) => {
          setter(e.target.value.replace(/[^0-9]/g, ""));
          handleFieldChange();
        }}
        disabled={!isEditMode}
        className="mt-2 text-white bg-gray-800 border-gray-600 focus:ring-purple-500"
      />
    </div>
  );

  return (
    <div className="flex flex-col w-full gap-6 p-6 sm:gap-8 sm:p-10 mt-[-90px]">
      <div className="w-full max-w-4xl ml-12 space-y-6">
        <header>
          <h1 className="text-3xl font-semibold text-black dark:text-white">
            Trainer Profile
          </h1>
          <p className="mt-1 text-black dark:text-gray-400">
            Detailed information about the gym trainer.
          </p>
        </header>

        <Card className="p-6 border border-gray-700 shadow-2xl bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl">
          <CardContent>
            <div className="flex flex-col items-center gap-8 md:flex-row">
              <div className="relative text-white">
                <img
                  src={imageUrl || "https://via.placeholder.com/150"}
                  alt="Trainer"
                  className="object-cover w-32 h-32 border-4 border-purple-500 rounded-full shadow-md"
                />
                {isEditMode && (
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
                {renderInputField("name", "Name", newName, setNewName)}
                {renderInputField(
                  "email",
                  "Email",
                  newEmail,
                  setNewEmail,
                  "email"
                )}
                {renderInputField(
                  "expertise",
                  "Expertise",
                  expertise,
                  setExpertise
                )}
                {renderInputField(
                  "experience",
                  "Experience",
                  experience,
                  setExperience
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter>
            {isEditMode ? (
              <div className="flex gap-4">
                <Button
                  className="px-6 py-2 text-white bg-green-600 hover:bg-green-700 transition-all duration-300 transform shadow-lg hover:scale-110 focus:ring-2 focus:ring-green-400"
                  onClick={handleUpdate}
                >
                  ✅ Save Changes
                </Button>
                <Button
                  className="px-6 py-2 text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-red-700 transition-all duration-300 transform shadow-lg hover:scale-110 focus:ring-2 focus:ring-red-400"
                  onClick={() => {
                    setIsEditMode(false);
                    setIsDirty(false);
                  }}
                >
                  ❌ Cancel
                </Button>
              </div>
            ) : (
              <Button
                className="px-6 py-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-blue-700 transition-all duration-300 transform shadow-lg hover:scale-110 focus:ring-2 focus:ring-blue-400"
                onClick={() => setIsEditMode(true)}
              >
                ✏️ Edit
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TrainerProfile;
