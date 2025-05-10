import { getAllPlans, getAllTrainers } from "@/redux/adminSlice";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

 
const TrainersSection = () => {
  const { user } = useSelector((state) => state.user);
  const { plans, trainers } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [expandedTrainer, setExpandedTrainer] = useState(null);
  const trainersPerPage = 3;
  const slideInterval = 3000; // 3 seconds

  useEffect(() => {
    dispatch(getAllPlans());
    dispatch(getAllTrainers());
  }, [dispatch]);

  // Handle automatic slide change
  useEffect(() => {
    if (isHovered) return; // Stop sliding when hovered
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + trainersPerPage >= trainers.length
          ? 0
          : prevIndex + trainersPerPage
      );
    }, slideInterval);

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [isHovered, currentIndex]);

  // Handle next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + trainersPerPage >= trainers.length
        ? 0
        : prevIndex + trainersPerPage
    );
  };

  // Handle previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - trainersPerPage < 0
        ? trainers.length - trainersPerPage
        : prevIndex - trainersPerPage
    );
  };

  // Handle expanding description
  const toggleExpand = (index) => {
    setExpandedTrainer((prevIndex) => (prevIndex === index ? null : index));
  };
 
  return (
    <section className="py-16 sm:py-24 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Meet Our Trainers
          </h2>
          <p className="mt-4 text-muted-foreground">
            Our team of experienced trainers is here to help you reach your
            fitness goals.
          </p>
        </div>
        <div
          className="relative mt-10 overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${
                (currentIndex * 100) / trainersPerPage
              }%)`,
            }}
          >
            {Array.isArray(trainers) && trainers.length > 0 ? (
              trainers.map((trainer, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full  sm:w-1/3 px-2"
                >
                  <div className="border-blue-600 b justify-center m-auto flex  flex-col items-center border  rounded-lg p-4 shadow-lg">
                    {/* <img
                    src={trainer.image}
                    alt={`Trainer ${index + 1}`}
                    width={300}
                    height={300}
                    className="w-full h-56 object-cover rounded-lg"
                    style={{ aspectRatio: "300/300", objectFit: "cover" }}
                  /> */}
                    <h3 className="mt-4 text-2xl font-bold ">{trainer.name}</h3>
                    <p className="mt-2 text-muted-foreground mb-2">
                      {trainer.email}{" "}
                    </p>

                    <img
                      src={`${trainer.photoUrl}`}
                      alt="user"
                      className="w-32 h-32 object-cover rounded-full"
                    />
                    <p className="mt-2 text-muted-foreground">
                      {trainer.expertise} Trainer{" "}
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      {trainer.experience} Experience
                    </p>

                    {/* <p className="mt-4 text-muted-foreground">

                    {expandedTrainer === index
                      ? trainer.description
                      : trainer.description.length > 100
                      ? trainer.description.slice(0, 100) + "..."
                      : trainer.description}
                    {trainer.description.length > 100 && (
                      <button
                        onClick={() => toggleExpand(index)}
                        className="ml-2 text-blue-600 underline"
                      >
                        {expandedTrainer === index ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </p> */}
                  </div>
                </div>
              ))
            ) : (
              <div>No Trainers</div>
            )}
          </div>
          <button
            onClick={prevSlide}
            className="prev-button absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
          >
            &#10094;
          </button>
          <button
            onClick={nextSlide}
            className="next-button absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
          >
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrainersSection;
