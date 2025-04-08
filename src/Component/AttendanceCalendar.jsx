import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserDetails } from "@/redux/userSlice";
import { ChevronLeft, ChevronRight } from "lucide-react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const AttendanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      dispatch(getUserDetails());
    }
  }, [dispatch, user]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getUserDetails());
    }, 9000); // har 10s me fresh datadd

  

    return () => clearInterval(interval); // memory leak na ho
  }, [dispatch]);

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = () =>
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );

  const handleNextMonth = () =>
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );

  const isAttendanceDate = (day) => {
    if (!user?.attendance) return false;
    const dateString = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return user.attendance.some((a) => a.date === dateString);
  };

  const totalAttendances = useMemo(
    () =>
      user?.attendance?.filter((a) => {
        const attendanceDate = new Date(a.date);
        return (
          attendanceDate.getMonth() === currentDate.getMonth() &&
          attendanceDate.getFullYear() === currentDate.getFullYear()
        );
      }).length || 0,
    [user?.attendance, currentDate]
  );

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const blanks = Array.from({ length: firstDayOfMonth });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-md p-3 mx-auto border border-blue-600 shadow-lg sm:max-w-2xl md:max-w-4xl sm:p-6 md:p-8 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 transition rounded-full hover:bg-blue-800"
        >
          <ChevronLeft className="w-5 h-5 text-white sm:w-6 sm:h-6" />
        </button>
        <h2 className="text-lg font-bold text-white sm:text-xl">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 transition rounded-full hover:bg-blue-800"
        >
          <ChevronRight className="w-5 h-5 text-white sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Days of the Week */}
      <div className="grid grid-cols-7 gap-1 text-xs font-semibold text-center text-blue-400 sm:text-sm sm:gap-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="p-1 bg-gray-700 rounded-md shadow-md sm:p-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1 mt-2 text-center sm:gap-2">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="p-2 sm:p-3"></div>
        ))}
        {days.map((day) => {
          const isToday =
            day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear();
          const attended = isAttendanceDate(day);

          return (
            <div
              key={day}
              className={`flex items-center justify-center 
                min-w-[30px] min-h-[30px] sm:min-w-[45px] sm:min-h-[45px] md:min-w-[55px] md:min-h-[55px] 
                text-sm sm:text-lg font-semibold rounded-md shadow-md cursor-pointer transition
                ${
                  attended
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105"
                    : "bg-gray-800 text-gray-300"
                } 
                ${
                  isToday
                    ? attended
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white scale-110"
                      : "bg-gradient-to-r from-blue-600 to-blue-800 text-white scale-110 shadow-lg"
                    : "hover:bg-gray-700 hover:text-white"
                }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Total Attendance */}
      <div className="mt-4 text-center sm:mt-5">
        <p className="p-2 text-sm font-bold text-white bg-blue-600 rounded-lg shadow-md sm:p-3 sm:text-lg hover:bg-blue-700 hover:scale-105">
          Total Attendances:{" "}
          <span className="text-green-300">{totalAttendances}</span>
        </p>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
