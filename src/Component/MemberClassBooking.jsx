import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";

import { bookClass, cancelBooking, fetchClasses } from "@/redux/classSlice";
import MemberSidePanel from "./MemberSidePanel";
import { ClassBookingCalendar } from "@/components/component/ClassBooking/ClassBookingCalendar";
import { Loader2 } from "lucide-react";

// member class booking
export function MemberClassBooking() {
  const dispatch = useDispatch();
  const { classes, status } = useSelector((state) => state.class);
  const calendarRef = useRef(null);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleBook = (classId) => {
    dispatch(bookClass(classId))
      .unwrap()
      .then(() => {
        alert("Class booked successfully! Check your email for confirmation.");
        refreshCalendar();
      })
      .catch((err) =>
        alert(`Error booking class: ${err.message || "Unknown error"}`)
      );
  };

  const handleCancel = (classId) => {
    dispatch(cancelBooking(classId))
      .unwrap()
      .then(() => {
        alert(
          "Booking cancelled successfully! Check your email for confirmation."
        );
        refreshCalendar();
      })
      .catch((err) =>
        alert(`Error cancelling booking: ${err.message || "Unknown error"}`)
      );
  };

  const refreshCalendar = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.refetchEvents();
      calendarApi.render();
    }
  };

  const events = classes.map((cls) => ({
    id: cls._id,
    title: `${cls.name} (${cls.spotsLeft} spots left)`,
    start: cls.dateTime,
    end: new Date(new Date(cls.dateTime).getTime() + cls.duration * 60000),
    extendedProps: {
      trainer: cls.trainerId?.name || "Unknown",
      location: cls.location,
      isBooked: cls.isBooked,
      spotsLeft: cls.spotsLeft,
    },
    backgroundColor: cls.isBooked
      ? "#4B5563"
      : cls.spotsLeft <= 0
      ? "#6B7280"
      : "#14B8A6",
  }));

  const handleEventClick = useCallback((info) => {
    const { id, extendedProps } = info.event;
    if (extendedProps.spotsLeft > 0 && !extendedProps.isBooked) {
      if (window.confirm(`Book ${info.event.title}?`)) {
        handleBook(id);
      }
    } else if (extendedProps.isBooked) {
      if (window.confirm(`Cancel booking for ${info.event.title}?`)) {
        handleCancel(id);
      }
    }
  }, []);

  const renderEventContent = (eventInfo) => {
    const { event } = eventInfo;
    const { trainer, location, isBooked, spotsLeft } = event.extendedProps;

    return (
      <div className="w-full p-2 overflow-hidden rounded-md">
        <div className="mb-1 text-xs font-medium text-white truncate sm:text-sm">
          {event.title}
        </div>
        <div className="mb-1 text-xs truncate text-slate-300">
          Trainer: {trainer}
        </div>
        <div className="mb-2 text-xs truncate text-slate-300">
          Location: {location}
        </div>
        <Button
          size="sm"
          className={`w-full text-xs ${
            isBooked
              ? "bg-gray-600 hover:bg-gray-700"
              : spotsLeft <= 0
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700"
          }`}
          disabled={spotsLeft <= 0 && !isBooked}
        >
          {isBooked ? "Cancel" : spotsLeft <= 0 ? "Full" : "Book"}
        </Button>
      </div>
    );
  };

  const fetchClassesHandler = () => dispatch(fetchClasses());

  // return (
  //   <MemberSidePanel>
  //     {/* <Card className="p-4 bg-gray-900 border-gray-800 rounded-lg shadow-lg"> */}
  //     {status === "loading" && (
  //       <div className="flex items-center justify-center p-4 text-gray-400">
  //         <Loader2 className="w-5 h-5 mr-2 animate-spin" />
  //         <span>Loading classes...</span>
  //       </div>
  //     )}

  //     <main className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
  //       <div className="max-w-7xl mx-auto">
  //         <h1 className="text-2xl md:text-3xl font-bold mb-6">
  //           Class Booking System
  //         </h1>
  //         <ClassBookingCalendar
  //           classes={classes}
  //           refreshClasses={fetchClassesHandler}
  //         />
  //       </div>
  //     </main>
  //   </MemberSidePanel>
  // );

  return (
    <MemberSidePanel>
      {/* <Card className="p-4 bg-gray-900 border-gray-800 rounded-lg shadow-lg"> */}
      {status === "loading" && (
        <div className="flex items-center justify-center p-4 text-gray-400">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          <span>Loading classes...</span>
        </div>
      )}

      <div className=" items-start justify-start min-h-screen p-6 bg-white mt-[-70px]">
        <header className="w-full px-4 mx-auto mb-6 max-w-7xl md:px-4">
          <h1 className="text-3xl font-semibold text-black dark:text-white">
            Welcome to Class Booking
          </h1>
          <p className="mt-1 text-black dark:text-gray-400">
            Manage your gym classes effortlessly and stay on track with your
            schedule.
          </p>
        </header>

        <main className="min-h-screen p-4 text-white bg-gray-900 md:p-8 rounded-3xl">
          <div className="mx-auto max-w-7xl">
            <ClassBookingCalendar classes={classes} />
          </div>
        </main>
      </div>
    </MemberSidePanel>
  );
}

export default MemberClassBooking;
