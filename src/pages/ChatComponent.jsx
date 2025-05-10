import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getUserDetails } from "../redux/userSlice";
import { motion } from "framer-motion";

import { MessageCircle } from "lucide-react";
// import notificationSound from "./notification-20-270145.mp3";
const socket = io.connect(`${import.meta.env.VITE_BASE_URL_TEMP}`);

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [media, setMedia] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const username = user?.name || "Guest";
  const photoUrl = user?.photoUrl || "";

  // Function to format date and time
  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${date.getHours()}:${String(date.getMinutes()).padStart(
        2,
        "0"
      )}`;
    }

    return `${date.toLocaleDateString()} ${date.getHours()}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  // Fetch old messages
  useEffect(() => {
    const fetchOldChats = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL_TEMP}/chat`);
        const formattedMessages = response.data.map((msg) => ({
          id: msg._id,
          text: msg.message,
          media: msg.media,
          username: msg.sender,
          photoUrl: msg.photoUrl,
          createdAt: new Date(msg.createdAt).toISOString(),
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching old chats:", error);
      }
    };

    fetchOldChats();

    if (!user) {
      dispatch(getUserDetails());
    }

    const handleChat = (payload) => {
      const formattedPayload = {
        ...payload,
        id: payload.createdAt,
        createdAt: new Date(payload.createdAt).toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, formattedPayload]);
    };

    socket.on("chat", handleChat);

    return () => socket.off("chat", handleChat);
  }, [dispatch, user]);

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() || media) {
      const messageData = {
        id: Date.now(),
        text: newMessage,
        media: media,
        username,
        photoUrl,
        createdAt: new Date().toISOString(),
      };

      // Emit the message to the server
      socket.emit("chat", messageData);

      // Clear the input fields
      setNewMessage("");
      setMedia(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (image, video, etc.)
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (validTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result;
          setMedia(base64); // Set base64 string as media
        };
        reader.readAsDataURL(file);
      } else {
        alert("Invalid file type. Please upload an image.");
      }
    }
  };

  const handleSendMediaClick = () => {
    fileInputRef.current.click();
  };

  const handleImageClick = (image) => {
    setImageUrl(image);
    setIsImageModalOpen(true);
  };

  const closeModal = () => {
    setIsImageModalOpen(false);
  };

  const handleDeleteMessage = (index) => {
    const updatedMessages = messages.filter((_, i) => i !== index);
    setMessages(updatedMessages);
  };

  const downloadImage = () => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = imageUrl.split("/").pop(); // Sets the filename to the image's original name from the URL
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Check if the user is a "member" and has no "planName"
  // if (user?.role === "member" && !user?.planName ) {
  //   return null; // Return null to prevent rendering the component for such users
  // }
  if (!user || (user.role === "member" && !user.planName)) {
    return null; // Prevent rendering if user data is unavailable or if the user is a 'member' without a plan.
  }

  //   return (
  //     <div>
  //       {!isChatOpen && (
  //         <button
  //           onClick={handleChatToggle}
  //           className="fixed bottom-8 right-8 bg-gradient-to-r from-[#00d4ff] via-[#00d4ff] to-[#020024] text-white rounded-full p-6 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-125 hover:rotate-12 hover:border-4 border-[#fff] z-50"
  //         >
  //           <MessageCircle size={40} />
  //         </button>
  //       )}

  //       {isChatOpen && (
  //         <div className="fixed z-50 flex flex-col text-white bg-gray-800 rounded-lg shadow-lg bottom-8 right-8 w-80 h-96">
  //           <div className="p-4 flex justify-between items-center rounded-t-lg bg-[#0e080f]">
  //             <h2 className="text-lg">Group Chat</h2>
  //             <button onClick={handleChatToggle}>✖</button>
  //           </div>

  //           <div className="flex-1 p-2 overflow-y-auto bg-blue-600">
  //             {messages.map((msg, index) => (
  //               <div
  //                 key={index}
  //                 className={`relative group p-3 mb-4 rounded-lg shadow-lg ${
  //                   msg.username === username
  //                     ? "bg-blue-500 text-white self-end text-right"
  //                     : "bg-gray-700 text-gray-300 self-start text-left"
  //                 }`}
  //               >
  //                 <div
  //                   className={`flex items-center ${
  //                     msg.username === username ? "justify-end" : "justify-start"
  //                   }`}
  //                 >
  //                   {msg.username !== username && msg.photoUrl && (
  //                     <img
  //                       src={msg.photoUrl}
  //                       alt="Profile"
  //                       className="w-6 h-6 mr-1 rounded-full"
  //                     />
  //                   )}
  //                   <strong className="text-xs font-bold">{msg.username}</strong>
  //                   {msg.username === username && msg.photoUrl && (
  //                     <img
  //                       src={msg.photoUrl}
  //                       alt="Profile"
  //                       className="w-6 h-6 ml-1 rounded-full"
  //                     />
  //                   )}
  //                 </div>
  //                 <p className="mt-2 text-lg break-words">{msg.text}</p>
  //                 {msg.media && (
  //                   <div className="mt-3 cursor-pointer">
  //                     <img
  //                       src={msg.media}
  //                       alt="media"
  //                       className="max-w-full border border-gray-300 rounded-lg shadow-md"
  //                       onClick={() => handleImageClick(msg.media)}
  //                     />
  //                   </div>
  //                 )}
  //                 <span
  //                   className={`absolute bottom-1 text-xs text-[#c0c6d0] ${
  //                     msg.username === username ? "left-2" : "right-2"
  //                   }`}
  //                 >
  //                   {formatDate(msg.createdAt)}
  //                 </span>
  //               </div>
  //             ))}
  //             <div ref={messagesEndRef}></div>
  //           </div>

  //           <form
  //             className="p-4 flex justify-between items-center rounded-b-lg bg-[#0e080f]"
  //             onSubmit={handleSendMessage}
  //           >
  //             <input
  //               type="text"
  //               value={newMessage}
  //               onChange={(e) => setNewMessage(e.target.value)}
  //               placeholder="Type a message..."
  //               className="flex-1 text-black text-blue-500 rounded-l"
  //             />
  //             <button
  //               type="button"
  //               onClick={handleSendMediaClick}
  //               className="px-2"
  //             >
  //               📎
  //             </button>
  //             <button type="submit" className="p-1 px-4 bg-blue-700 rounded-full">
  //               Send
  //             </button>
  //           </form>

  //           <input
  //             type="file"
  //             ref={fileInputRef}
  //             onChange={handleFileChange}
  //             style={{ display: "none" }}
  //           />
  //         </div>
  //       )}

  //       {isImageModalOpen && (
  //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
  //           <div className="relative p-4 bg-white rounded-lg shadow-lg">
  //             <img
  //               src={imageUrl}
  //               alt="Full-size"
  //               className="max-w-[90vw] max-h-[90vh] object-contain"
  //             />
  //             <div className="absolute top-2 right-2">
  //               <button
  //                 onClick={closeModal}
  //                 className="p-2 text-white bg-red-600 rounded-full"
  //               >
  //                 ✖
  //               </button>
  //             </div>
  //             <button
  //               onClick={downloadImage}
  //               className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-md"
  //             >
  //               Download
  //             </button>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  // export default ChatComponent;

  //     return (
  //       <div>
  //         {/* Chat Toggle Button */}
  //         {!isChatOpen && (
  //           <button
  //             onClick={handleChatToggle}
  //             className="fixed bottom-8 right-8 bg-gradient-to-r from-[#00d4ff] via-[#00d4ff] to-[#020024] text-white rounded-full p-6 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-12 hover:shadow-2xl z-50"
  //           >
  //             <MessageCircle size={40} />
  //           </button>
  //         )}

  //         {/* Chat Window */}
  //         {isChatOpen && (
  //           <div className="fixed z-50 flex flex-col text-white bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-2xl bottom-8 right-8 w-96 h-[500px] overflow-hidden">
  //             {/* Chat Header */}
  //             <div className="p-4 flex justify-between items-center rounded-t-lg bg-gradient-to-r from-[#00d4ff] to-[#020024]">
  //               <h2 className="text-lg font-semibold">Group Chat</h2>
  //               <button
  //                 onClick={handleChatToggle}
  //                 className="p-1 text-white transition-colors hover:text-gray-300"
  //               >
  //                 ✖
  //               </button>
  //             </div>

  //             {/* Chat Messages */}
  //             <div className="flex-1 p-4 overflow-y-auto bg-gray-700">
  //               {messages.map((msg, index) => (
  //                 <div
  //                   key={index}
  //                   className={`relative group p-3 mb-4 rounded-lg shadow-md flex flex-col self-start items-start
  //       ${
  //         msg.username === username
  //           ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
  //           : "bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300"
  //       }`}
  //                 >
  //                   {/* Sender Info */}
  //                   <div className="flex items-center">
  //                     {msg.photoUrl && (
  //                       <img
  //                         src={msg.photoUrl}
  //                         alt="Profile"
  //                         className="w-6 h-6 mr-2 rounded-full"
  //                       />
  //                     )}
  //                     <strong className="text-xs font-bold">{msg.username}</strong>
  //                   </div>

  //                   {/* Message Text */}
  //                   <p className="mt-2 text-sm break-words">{msg.text}</p>

  //                   {/* Media (Image) */}
  //                   {msg.media && (
  //                     <div className="mt-3 cursor-pointer">
  //                       <img
  //                         src={msg.media}
  //                         alt="media"
  //                         className="max-w-full border border-gray-300 rounded-lg shadow-md"
  //                         onClick={() => handleImageClick(msg.media)}
  //                       />
  //                     </div>
  //                   )}

  //                   {/* Timestamp and Delete Button Container */}
  //                   <div className="flex items-center justify-between w-full mt-2">
  //                     {/* Timestamp */}
  //                     <span className="text-xs text-gray-400">
  //                       {formatDate(msg.createdAt)}
  //                     </span>

  //                     {/* Delete Button (Only for User's Own Messages) */}
  //                     {msg.username === username && (
  //                       <button
  //                         onClick={() => handleDeleteMessage(index)}
  //                         className="p-1 text-xs text-red-500 transition-colors hover:text-red-600"
  //                       >
  //                         🗑️
  //                       </button>
  //                     )}
  //                   </div>
  //                 </div>
  //               ))}
  //               <div ref={messagesEndRef}></div>
  //             </div>

  //             {/* Chat Input Form */}
  //             <form
  //               className="p-4 flex justify-between items-center rounded-b-lg bg-gradient-to-r from-[#00d4ff] to-[#020024]"
  //               onSubmit={handleSendMessage}
  //             >
  //               <input
  //                 type="text"
  //                 value={newMessage}
  //                 onChange={(e) => setNewMessage(e.target.value)}
  //                 placeholder="Type a message..."
  //                 className="flex-1 p-2 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               />
  //               <button
  //                 type="button"
  //                 onClick={handleSendMediaClick}
  //                 className="p-2 ml-2 text-white transition-colors hover:text-gray-300"
  //               >
  //                 📎
  //               </button>
  //               <button
  //                 type="submit"
  //                 className="p-2 px-4 ml-2 text-white transition-all rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700"
  //               >
  //                 Send
  //               </button>
  //             </form>

  //             {/* Hidden File Input */}
  //             <input
  //               type="file"
  //               ref={fileInputRef}
  //               onChange={handleFileChange}
  //               style={{ display: "none" }}
  //             />
  //           </div>
  //         )}

  //         {/* Image Modal */}
  //         {isImageModalOpen && (
  //           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
  //             <div className="relative p-6 bg-white rounded-lg shadow-2xl">
  //               <img
  //                 src={imageUrl}
  //                 alt="Full-size"
  //                 className="max-w-[90vw] max-h-[90vh] object-contain"
  //               />
  //               <div className="absolute top-4 right-4">
  //                 <button
  //                   onClick={closeModal}
  //                   className="p-2 text-white transition-colors bg-red-600 rounded-full hover:bg-red-700"
  //                 >
  //                   ✖
  //                 </button>
  //               </div>
  //               <button
  //                 onClick={downloadImage}
  //                 className="px-4 py-2 mt-4 text-white transition-all rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700"
  //               >
  //                 Download
  //               </button>
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     );

  // };

  // export default ChatComponent;

  // return (

  // <div className="fixed z-50 bottom-8 right-8">
  //   {/* Chat Button */}
  //   {!isChatOpen && (
  //     <button
  //       onClick={handleChatToggle}
  //       className="fixed p-5 text-white transition-all duration-300 bg-green-500 rounded-full shadow-lg bottom-8 right-8 hover:scale-110"
  //     >
  //       <MessageCircle size={30} />
  //     </button>
  //   )}

  //   {/* Chat Window */}
  //   {isChatOpen && (
  //     <div className="fixed bottom-8 right-8 w-80 h-[450px] flex flex-col bg-white border border-gray-300 rounded-xl shadow-xl overflow-hidden">

  //       {/* Chat Header */}
  //       <div className="flex items-center justify-between p-3 text-white bg-green-600">
  //         <h2 className="text-lg font-semibold">Group Chat</h2>
  //         <button onClick={handleChatToggle} className="text-xl">✖</button>
  //       </div>

  //       {/* Messages Section */}
  //       <div className="flex-1 overflow-y-auto p-3 bg-[#e5ddd5]">
  //         {messages.map((msg, index) => (
  //           <div
  //             key={index}
  //             className={`flex items-start mb-3 ${
  //               msg.username === username ? "justify-end" : "justify-start"
  //             }`}
  //           >
  //             {msg.username !== username && msg.photoUrl && (
  //               <img
  //                 src={msg.photoUrl}
  //                 alt="Profile"
  //                 className="w-6 h-6 mr-2 rounded-full"
  //               />
  //             )}
  //             <div
  //               className={`relative p-2 text-sm max-w-[75%] rounded-lg shadow ${
  //                 msg.username === username
  //                   ? "bg-green-500 text-white rounded-br-none"
  //                   : "bg-white text-black rounded-bl-none"
  //               }`}
  //             >
  //               <p className="font-medium">{msg.text}</p>
  //               <span className="block text-[10px] text-gray-200 text-right mt-1">
  //                 {formatDate(msg.createdAt)}
  //               </span>
  //             </div>
  //           </div>
  //         ))}
  //         <div ref={messagesEndRef}></div>
  //       </div>

  //       {/* Chat Input */}
  //       <form
  //         className="flex items-center p-2 bg-white border-t"
  //         onSubmit={handleSendMessage}
  //       >
  //         <button type="button" onClick={handleSendMediaClick} className="px-2 text-xl">📎</button>
  //         <input
  //           type="text"
  //           value={newMessage}
  //           onChange={(e) => setNewMessage(e.target.value)}
  //           placeholder="Type a message..."
  //           className="flex-1 p-2 text-black bg-gray-100 border border-gray-300 rounded-lg focus:outline-none"
  //         />
  //         <button type="submit" className="p-2 ml-2 text-white bg-green-500 rounded-full">
  //           ➤
  //         </button>
  //       </form>

  //       <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
  //     </div>
  //   )}

  //   {/* Image Preview Modal */}
  //   {isImageModalOpen && (
  //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
  //       <div className="relative p-4 bg-white rounded-lg shadow-lg">
  //         <img src={imageUrl} alt="Full-size" className="max-w-[90vw] max-h-[90vh] object-contain" />
  //         <div className="absolute top-2 right-2">
  //           <button onClick={closeModal} className="p-2 text-white bg-red-600 rounded-full">✖</button>
  //         </div>
  //         <button onClick={downloadImage} className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-md">Download</button>
  //       </div>
  //     </div>
  //   )}
  // </div>
  // );
  // };

  // export default ChatComponent;
  // ---------------------------------------------------------------------------------------------------

  return (
    <div className="fixed z-50 bottom-8 right-8">
      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button
          onClick={handleChatToggle}
          className="fixed p-5 text-white transition-all duration-300 bg-green-500 rounded-full shadow-lg bottom-8 right-8 hover:scale-110"
        >
          <MessageCircle size={40} />
        </button>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-8 right-8 w-80 h-[450px] flex flex-col bg-white border border-gray-300 rounded-xl shadow-xl overflow-hidden ">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 text-white bg-[#1D282E] ">
            <h2 className="text-lg font-semibold">Group Chat</h2>
            <button onClick={handleChatToggle} className="text-xl">
              ✖
            </button>
          </div>

          {/* Messages Section */}
          <div
            className="flex-1 p-3 overflow-y-auto "
            style={{
              backgroundImage: `url('https://i.pinimg.com/1200x/69/ae/91/69ae9183e8ff59f834ce2a1fc88d7e77.jpg')`,
              backgroundSize: "cover", // Ensures the image covers the full area
              backgroundPosition: "center", // Centers the image
              backgroundRepeat: "no-repeat", // Prevents repetition
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start mb-3 ${
                  msg.username === username ? "justify-end" : "justify-start"
                }`}
              >
                {msg.username !== username && msg.photoUrl && (
                  <img
                    src={msg.photoUrl}
                    alt="Profile"
                    className="w-10 h-10 mr-2 rounded-full"
                  />
                )}
                <div
                  className={`mt-8 relative p-2 text-sm max-w-[75%] rounded-lg shadow ${
                    msg.username === username
                      ? "bg-[#005343] text-white rounded-br-none"
                      : "bg-[#1D282E] text-white rounded-bl-none"
                  }`}
                >
                  {/* Text Message */}
                  <p className="font-medium">{msg.text}</p>

                  {/* Image Preview in Message */}
                  {msg.media && (
                    <div className="mt-2 cursor-pointer">
                      <img
                        src={msg.media}
                        alt="media"
                        className="max-w-[150px] max-h-[150px] border border-gray-300 rounded-lg shadow-md"
                        onClick={() => handleImageClick(msg.media)}
                      />
                    </div>
                  )}

                  {/* Message Timestamp */}
                  <span className="block text-[10px] text-gray-300 text-right mt-1">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Chat Input */}
          <form
            className="flex items-center p-2 bg-[#1D282E] border-t "
            onSubmit={handleSendMessage}
          >
            {/* File Upload Button */}
            <button
              type="button"
              onClick={handleSendMediaClick}
              className="px-2 text-xl"
            >
              📎
            </button>

            {/* Message Input Field */}
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-1 text-white bg-[#26333B] border  rounded-lg focus:outline-none"
            />

            {/* Send Button */}
            <button
              type="submit"
              className="p-1 px-5 ml-2 text-white rounded-full"
            >
              ➤
            </button>
          </form>

          {/* Hidden File Input for Image Upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      )}

      {/* Image Preview Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative p-4 bg-white rounded-lg shadow-lg">
            <img
              src={imageUrl}
              alt="Full-size"
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
            <div className="absolute top-2 right-2">
              <button
                onClick={closeModal}
                className="p-2 text-white bg-red-600 rounded-full"
              >
                ✖
              </button>
            </div>
            <button
              onClick={downloadImage}
              className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-md"
            >
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
