
import React, { useEffect, useState } from "react";
import MemberSidePanel from "./MemberSidePanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, updateUser, uploadUserPhoto } from "@/redux/userSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Label } from "@/components/ui/label";
import ScanQr from "./ScanQr";
import MyComponent from "./MyComponent"; // Import the MyComponent file
import AttendanceCalendar from "./AttendanceCalendar";

const MemberProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [photo, setPhoto] = useState(null);
  const [imageUrl, setImageUrl] = useState(user?.photoUrl || ""); // State to track image URL

  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
  });

 
  useEffect(() => {
    if (user?.photoUrl) {
      setImageUrl(user.photoUrl); // Update image URL when user photo changes
    }
  }, [user?.photoUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (photo && user) {
      try {
        await dispatch(uploadUserPhoto({ userId: user._id, photo }));
        await dispatch(getUserDetails());
        toast.success("Photo uploaded successfully");
      } catch (err) {
        toast.error("Failed to upload photo");
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsEditing(false);
    console.log("Profile saved", profile);
    await dispatch(updateUser(profile));
  };
  
//   return (
    

// <div className="flex items-start justify-start min-h-screen p-6 bg-white mt-[-70px]">
//   <div className="w-full max-w-4xl ml-12 space-y-6">
//     <header className="w-full">
//       <h1 className="text-3xl font-semibold text-black dark:text-white">
//         Member Profile
//       </h1>
//       <p className="mt-1 text-black dark:text-gray-400">
//         Detailed information about the gym member.
//       </p>
//     </header>

//     <Card className="p-6 border border-gray-700 shadow-2xl bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl">


//       <CardContent>
//         <div className="flex flex-col items-center gap-8 sm:flex-row">
//           <div className="relative flex flex-col items-center">
//             {isEditing ? (
//               <div className="flex flex-col items-center gap-3 ">
//                 <Input type="file" onChange={handleFileChange} className="cursor-pointer " />
//                 <Button
//                   onClick={handleUpload}
//                   disabled={status === 'loading'}
//                   className="text-white transition-colors bg-gray-700 hover:bg-gray-600"
//                 >
//                   {status === 'loading' ? 'Uploading...' : 'Upload Photo'}
//                 </Button>
//               </div>
//             ) : (
//               <div className="w-24 h-24 overflow-hidden border-4 border-purple-500 rounded-full shadow-md sm:w-32 sm:h-32">
//                 {imageUrl ? (
//                   <img src={imageUrl} alt="user" className="object-cover w-full h-full" />
//                 ) : (
//                   <p className="text-xs text-center text-gray-300 sm:text-sm">No photo uploaded</p>
//                 )}
//               </div>
//             )}
//           </div>

//           <div className="grid flex-1 w-full grid-cols-1 gap-6 sm:grid-cols-2">
//             <div>
//               <Label htmlFor="name" className="text-gray-300">
//                 Name
//               </Label>
//               <Input
//                 type="text"
//                 name="name"
//                 value={profile.name}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 className="w-full p-3 mt-2 text-white bg-gray-800 border-gray-600 rounded-lg focus:ring-purple-500"
//               />
//             </div>

//             <div>
//               <Label htmlFor="email" className="text-gray-300">
//                 Email
//               </Label>
//               <Input
//                 type="email"
//                 name="email"
//                 value={profile.email}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 className="w-full p-3 mt-2 text-white bg-gray-800 border-gray-600 rounded-lg focus:ring-purple-500"
//               />
//             </div>
//           </div>
//         </div>
//       </CardContent>

//       <CardFooter className="flex flex-col justify-center gap-4 sm:flex-row sm:justify-end">
//         {isEditing ? (
//           <>
//             <Button onClick={handleSave} className="px-6 py-2 text-white transition-transform rounded-lg shadow-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:scale-105">
//               Save
//             </Button>
//             <Button onClick={() => setIsEditing(!isEditing)} className="px-6 py-2 text-white transition-colors bg-gray-700 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700">
//               Cancel
//             </Button>
//           </>
//         ) : (
//           <Button onClick={toggleEdit} className="px-6 py-2 text-white transition-transform rounded-lg shadow-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:scale-105">
//             Edit
//           </Button>
//         )}
//       </CardFooter>
//     </Card>
//   </div>
// </div>

//   );
// };
return (
  <div className="flex flex-col w-full gap-6 p-6 sm:gap-8 sm:p-10 mt-[-70px]">
    <header className="w-full ml-12 sm:mb-8">
      <h1 className={`text-4xl font-bold transition duration-300 ${"text-gray-900 dark:text-white"}`}>
        Member Profile
      </h1>
      <p className="mt-1 text-gray-600 dark:text-gray-400">
        Detailed information about the gym member.
      </p>
    </header>

    <main className="grid flex-1 gap-6 p-6 sm:gap-10 sm:px-12 sm:py-6 md:gap-12 lg:grid-cols-2 xl:grid-cols-3 mt-[-50px]">
      <div className="grid gap-8 lg:col-span-2 xl:col-span-3">
        <Card className={`transition duration-300 ${isEditing ? "border-purple-500 shadow-2xl" : ""}`}>
          <CardContent>
            <div className="flex flex-col items-center gap-8 md:flex-row">
              {/* Image Upload Section */}
              <div className="relative flex flex-col items-center">
                {isEditing ? (
                  <div className="flex flex-col items-center gap-3">
                    <Input type="file" onChange={handleFileChange} className="cursor-pointer" />
                 
                  </div>
                ) : (
                  <div className="w-24 h-24 overflow-hidden transition-transform border-4 border-purple-500 rounded-full shadow-md hover:scale-105 sm:w-32 sm:h-32">
                    {imageUrl ? (
                      <img src={imageUrl} alt="user" className="object-cover w-full h-full" />
                    ) : (
                      <p className="text-xs text-center text-gray-300 sm:text-sm">No photo uploaded</p>
                    )}
                  </div>
                )}
              </div>

              {/* Input Fields */}
              <div className="grid flex-1 w-full grid-cols-1 gap-6 md:grid-cols-2">
                {[
                  ["name", profile.name, "text", "Member Name"],
                  ["email", profile.email, "email", "Email Address"]
                ].map(([id, value, type, placeholder]) => (
                  <div key={id}>
                    <Label htmlFor={id} className="text-gray-300 capitalize">
                      {placeholder}
                    </Label>
                    <Input
                      id={id}
                      type={type}
                      name={id}
                      value={value}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full p-3 mt-2 text-white border rounded-lg transition duration-300 ${
                        isEditing
                          ? "border-purple-500 bg-gray-900 shadow-lg focus:ring-purple-500 focus:border-purple-400"
                          : "border-gray-600 bg-gray-800"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          {/* Action Buttons */}
          <CardFooter className="flex flex-col justify-center gap-4 sm:flex-row sm:justify-end">
            {isEditing ? (
              <div className="flex gap-4">
                <Button
                  onClick={handleSave}
                  className="px-6 py-2 text-white transition-all duration-300 transform bg-green-600 shadow-lg hover:scale-110 hover:bg-green-700 focus:ring-2 focus:ring-green-400"
                >
                  ✅ Save Changes
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:scale-110 hover:bg-red-700 focus:ring-2 focus:ring-red-400"
                >
                  ❌ Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={toggleEdit}
                className="px-6 py-2 text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:scale-110 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
              >
                ✏️ Edit
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </main>
  </div>
);
}

export default MemberProfile;
