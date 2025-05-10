import React, { useEffect } from "react";
import MemberSidePanel from "./MemberSidePanel";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserTrainerInfo } from "@/redux/userSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";

const MemberTrainerProfile = () => {
  const { trainers, user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    } else {
      dispatch(fetchUserTrainerInfo());
    }
  }, [dispatch, navigate, user]);

  if (trainers.length === 0) {
    <Button>No Trainers...</Button>;
  }

   
    return (
      <MemberSidePanel>
<div className="flex items-start justify-start min-h-screen p-6 bg-white mt-[-70px]">
<div className="w-full max-w-4xl ml-12 space-y-6">
     
            <header className="w-full">
      <h1 className="text-3xl font-semibold text-black dark:text-white">
      Trainer Profile
      </h1>
      <p className="mt-1 text-black dark:text-gray-400">
      Get in touch with your personal trainer.
      </p>
    </header>
  
            {trainers && trainers.length > 0 ? (
              <div className="space-y-4">
                {trainers.map((trainer) => (
                  <div
                    key={trainer.id}
                    className="p-4 transition-all bg-gray-900 border border-gray-700 rounded-lg shadow-md sm:p-6 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                      <img
                        src={trainer.photoUrl}
                        alt="Trainer Avatar"
                        className="object-cover w-16 h-16 border border-gray-700 rounded-full"
                      />
                      <div className="text-center sm:text-left">
                        <div className="text-lg font-bold text-gray-100">
                          {trainer.name.toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-400">
                          Certified Personal Trainer
                        </div>
                        <div className="text-sm text-gray-400">
                          Expertise: {trainer.expertise}
                        </div>
                        <div className="text-sm text-gray-400">
                          Experience: {trainer.experience} years
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400 bg-gray-900 border border-gray-700 rounded-lg">
              No Trainer Available
            </div>
            )}
          </div>
        </div>
      </MemberSidePanel>
    );
  };
  
  export default MemberTrainerProfile;
  
