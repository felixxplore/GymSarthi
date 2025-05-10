import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/userSlice";
import { NotebookPen } from "lucide-react";

const MemberSidePanel = ({ children }) => {
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const location = useLocation(); // Get the current location
  const [activeLink, setActiveLink] = useState(location.pathname); // Initialize with the current pathname

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setIsSidebarOpen(false); // Close sidebar on mobile after clicking a link
  };

  const profileRoute = () => {
    switch (user.role) {
      case "admin":
        return "/admin-dashboard";
      case "trainer":
        return "/trainer-dashboard";
      case "member":
        return "/member-dashboard";
      // Default route if role is not recognized
    }
  };

  useEffect(() => {
    // Update the active link when the location changes
    setActiveLink(location.pathname);
  }, [location.pathname]); // Dependency array includes pathname

 
  // return (
  //   <div className="flex w-full min-h-screen bg-background dark:text-foreground">
  //     {/* Hamburger Menu Button (Mobile Only) */}
  //     <button
  //       className="fixed z-20 p-2 text-white bg-blue-600 rounded-lg top-4 left-4 sm:hidden"
  //       onClick={() => setIsSidebarOpen(!isSidebarOpen)}
  //     >
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         className="w-6 h-6"
  //         fill="none"
  //         viewBox="0 0 24 24"
  //         stroke="currentColor"
  //       >
  //         <path
  //           strokeLinecap="round"
  //           strokeLinejoin="round"
  //           strokeWidth={2}
  //           d="M4 6h16M4 12h16m-7 6h7"
  //         />
  //       </svg>
  //     </button>

  //     {/* Sidebar */}
  //     <aside
  //       className={`fixed inset-y-2 left-0 z-10 flex flex-col w-64 border-r border-blue-700 bg-gradient-to-b from-[#0D1117] to-[#1A1F2C] sm:flex rounded-tr-2xl rounded-br-2xl shadow-2xl transition-transform duration-300 ease-in-out ${
  //         isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
  //       }`}
  //     >
  //       <div className="flex h-[60px] items-center px-6">
  //         <Link
  //           to="#"
  //           className="flex items-center gap-2 font-semibold text-white"
  //           prefetch={false}
  //         >
  //           <DumbbellIcon className="w-6 h-6" />
  //           <span>Gym Member</span>
  //         </Link>
  //       </div>
  //       <div className="flex-1">
  //         <nav className="grid items-start px-4 text-sm font-medium">
  //           <Link
  //             to="/"
  //             className="flex items-center gap-2 px-4 py-2 transition-all rounded-lg text-muted-foreground dark:text-muted-foreground hover:text-foreground"
  //             prefetch={false}
  //           >
  //             <HomeIcon className="relative flex justify-start w-4 h-4 right-1" />
  //             Home
  //           </Link>
  //           <Link
  //             to="/member-dashboard"
  //             className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
  //               activeLink === "/member-dashboard"
  //                 ? "relative flex items-center transition-transform duration-300 ease-in-out transform text-white bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:scale-105 hover:shadow-2xl"
  //                 : "text-muted-foreground hover:text-foreground"
  //             }`}
  //             onClick={() => handleLinkClick("/member-dashboard")}
  //             prefetch={false}
  //           >
  //             <UserIcon className="w-4 h-4" />
  //             Member Profile
  //           </Link>
  //           <Link
  //             to="/member-dashboard/trainer-profile"
  //             className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
  //               activeLink === "/member-dashboard/trainer-profile"
  //                 ? "relative flex items-center transition-transform duration-300 ease-in-out transform text-white bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:scale-105 hover:shadow-2xl"
  //                 : "text-muted-foreground hover:text-foreground"
  //             }`}
  //             onClick={() => handleLinkClick("/member-dashboard/trainer-profile")}
  //             prefetch={false}
  //           >
  //             <UserIcon className="w-4 h-4" />
  //             Trainer Profile
  //           </Link>
  //           <Link
  //             to="/member-dashboard/plan-details"
  //             className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
  //               activeLink === "/member-dashboard/plan-details"
  //                 ? "relative flex items-center transition-transform duration-300 ease-in-out transform text-white bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:scale-105 hover:shadow-2xl"
  //                 : "text-muted-foreground hover:text-foreground"
  //             }`}
  //             onClick={() => handleLinkClick("/member-dashboard/plan-details")}
  //             prefetch={false}
  //           >
  //             <NotebookPen size={15} />
  //             Plan Purchased
  //           </Link>
  //           <Link
  //             to="/member-dashboard/daily-tasks"
  //             className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
  //               activeLink === "/member-dashboard/daily-tasks"
  //                 ? "relative flex items-center transition-transform duration-300 ease-in-out transform text-white bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:scale-105 hover:shadow-2xl"
  //                 : "text-muted-foreground hover:text-foreground"
  //             }`}
  //             onClick={() => handleLinkClick("/member-dashboard/daily-tasks")}
  //             prefetch={false}
  //           >
  //             <ClipboardIcon className="w-4 h-4" />
  //             Daily Tasks
  //           </Link>
  //           <Link
  //             to="/member-dashboard/payment-history"
  //             className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
  //               activeLink === "/member-dashboard/payment-history"
  //                 ? "relative flex items-center transition-transform duration-300 ease-in-out transform text-white bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:scale-105 hover:shadow-2xl"
  //                 : "text-muted-foreground hover:text-foreground"
  //             }`}
  //             onClick={() => handleLinkClick("/member-dashboard/payment-history")}
  //             prefetch={false}
  //           >
  //             <CreditCardIcon className="w-4 h-4" />
  //             Payment History
  //           </Link>

  //           <Link
  //               to="/member-dashboard/class-book"
  //               className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
  //                 activeLink === "/member-dashboard/class-book"
  //                   ? "relative flex items-center transition-transform duration-300 ease-in-out transform text-white bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:scale-105 hover:shadow-2xl"
  //                   : "text-muted-foreground hover:text-foreground"
  //               }`}
  //               onClick={() =>
  //                 handleLinkClick("/member-dashboard/class-book")
  //               } // Use handleLinkClick here
  //               prefetch={false}
  //             >
  //               <CreditCardIcon className="w-4 h-4" />
  //             Class Booking
  //             </Link>

  //             <Link
  //               to="/member-dashboard/payment-status"
  //               className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
  //                 activeLink === "/member-dashboard/payment-status"
  //                   ? "relative flex items-center transition-transform duration-300 ease-in-out transform text-white bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:scale-105 hover:shadow-2xl"
  //                   : "text-muted-foreground hover:text-foreground"
  //               }`}
  //               onClick={() =>
  //                 handleLinkClick("/member-dashboard/payment-status")
  //               } // Use handleLinkClick here
  //               prefetch={false}
  //             >
  //               <CreditCardIcon className="w-4 h-4" />
  //               Pending Payments
  //             </Link>
  //           <Link
  //             to="/member-dashboard/attendance-calendar"
  //             className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
  //               activeLink === "/member-dashboard/attendance-calendar"
  //                 ? "relative flex items-center transition-transform duration-300 ease-in-out transform text-white bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:scale-105 hover:shadow-2xl"
  //                 : "text-muted-foreground hover:text-foreground"
  //             }`}
  //             onClick={() => handleLinkClick("/member-dashboard/attendance-calendar")}
  //             prefetch={false}
  //           >
  //             <CalendarIcon className="w-4 h-4" />
  //             Attendance Calendar
  //           </Link>
  //         </nav>
  //       </div>
  //     </aside>

  //     {/* Main Content */}
  //     <div className="flex flex-col w-full sm:gap-4 sm:py-4 sm:pl-64">
  //       <header className="flex items-center gap-4 px-6 border-b shadow-sm bg-background h-14 md:px-6">
  //         <div className="flex-1 w-full"></div>
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button
  //               variant="ghost"
  //               size="icon"
  //               className="border rounded-full w-15 h-15"
  //             >
  //               <img
  //                 src={`${user.photoUrl}`}
  //                 width="32"
  //                 height="32"
  //                 className="w-10 h-10 rounded-full"
  //                 alt="Avatar"
  //                 style={{ aspectRatio: "32/32", objectFit: "cover" }}
  //               />
  //               <span className="sr-only">Toggle user menu</span>
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent align="end">
  //             <Link to={profileRoute()}>
  //               <DropdownMenuLabel>My Account</DropdownMenuLabel>
  //             </Link>
  //             <DropdownMenuSeparator />
  //             <DropdownMenuItem>Support</DropdownMenuItem>
  //             <DropdownMenuSeparator />
  //             <DropdownMenuItem onClick={() => dispatch(logout())}>
  //               Logout
  //             </DropdownMenuItem>
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       </header>
  //       <main className="grid items-start flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
  //         <div className="grid gap-4 lg:col-span-2 xl:col-span-3">
  //           {children}
  //         </div>
  //       </main>
  //     </div>
  //   </div>
  // );
  // };

  // export default MemberSidePanel;

  return (
    <div className="flex w-full min-h-screen bg-background dark:text-foreground">
      {/* Sidebar */}
      <aside className="fixed inset-y-0.5 left-0 z-10 flex flex-col w-64 bg-gradient-to-b from-[#0D1117] to-[#1A1F2C] sm:flex rounded-tr-2xl rounded-br-2xl shadow-2xl">
        {/* Logo */}
        <div className="flex h-[60px] items-center px-6">
          <Link
            to="#"
            className="flex items-center gap-2 m-2 font-semibold text-white"
            prefetch={false}
          >
            <DumbbellIcon className="w-6 h-6" />
            <span>Gym Member</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="grid gap-1 px-4 text-sm font-medium">
          {/* {[
            { to: "/", icon: HomeIcon, label: "Home" },
            {
              to: "/member-dashboard",
              icon: UserIcon,
              label: "Member Profile",
            },
            {
              to: "/member-dashboard/trainer-profile",
              icon: UserIcon,
              label: "Trainer Profile",
            },
            {
              to: "/member-dashboard/plan-details",
              icon: NotebookPen,
              label: "Plan Purchased",
            },
            {
              to: "/member-dashboard/daily-tasks",
              icon: ClipboardIcon,
              label: "Daily Tasks",
            },
            {
              to: "/member-dashboard/payment-history",
              icon: CreditCardIcon,
              label: "Payment History",
            },
            {
              to: "/member-dashboard/class-book",
              icon: CreditCardIcon,
              label: "Class Booking",
            },
            {
              to: "/member-dashboard/payment-status",
              icon: CreditCardIcon,
              label: "Pending Payments",
            },
            {
              to: "/member-dashboard/attendance-calendar",
              icon: CalendarIcon,
              label: "Attendance Calendar",
            }, */}
            {[
            { to: "/", icon: HomeIcon, label: "Home" },
            {
              to: "/member-dashboard",
              icon: MemberIcon,
              label: "Member Profile",
            },
            {
              to: "/member-dashboard/trainer-profile",
              icon: TrainerIcon,
              label: "Trainer Profile",
            },
            {
              to: "/member-dashboard/plan-details",
              icon: PlanIcon,
              label: "Plan Purchased",
            },
            {
              to: "/member-dashboard/daily-tasks",
              icon: TasksIcon,
              label: "Daily Tasks",
            },
            {
              to: "/member-dashboard/payment-history",
              icon: PaymentHistoryIcon,
              label: "Payment History",
            },
            {
              to: "/member-dashboard/class-book",
              icon: ClassBookingIcon,
              label: "Class Booking",
            },
            {
              to: "/member-dashboard/payment-status",
              icon: PendingPaymentsIcon,
              label: "Pending Payments",
            },
            {
              to: "/member-dashboard/attendance-calendar",
              icon: CalendarIcon,
              label: "Attendance Calendar",
            },
          ].map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                activeLink === to
                   ? "relative flex items-center transition-transform duration-300 ease-in-out transform text-white bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:scale-105 hover:shadow-2xl"
                : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => handleLinkClick(to)}
              prefetch={false}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="flex items-center justify-between w-full mt-auto px-7 py-7">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="border rounded-full w-15 h-15 hover:bg-gray-100"
              >
                <img
                  src={`${user.photoUrl}`}
                  width="50"
                  height="50"
                  className="object-cover rounded-full w-14 h-14"
                  alt="Avatar"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="shadow-lg">
              <Link to={profileRoute()}>My Account</Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => dispatch(logout())}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="pr-3 text-lg font-medium text-white mt-25">
            {user.name}
          </span>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col w-full sm:gap-4 sm:py-4 sm:pl-64">
        <header className="flex items-center gap-4 px-6 bg-background h-14 md:px-6">
          <Link href="#" className="lg:hidden">
            <DumbbellIcon className="w-6 h-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="flex-1 w-full"></div>
        </header>
        <main className="grid items-start flex-1 gap-6 p-6 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 bg-gray-50">
          <div className="grid gap-4 lg:col-span-2 xl:col-span-3">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MemberSidePanel;


function MemberIcon(props) {
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
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />
    </svg>
  );
}

function TrainerIcon(props) {
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
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21v-2a6 6 0 0 1 12 0v2" />
      <path d="M16 3a6 6 0 0 1 6 6v2" />
    </svg>
  );
}
function PlanIcon(props) {
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
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M8 2v4M16 2v4M3 10h18" />
    </svg>
  );
}

function TasksIcon(props) {
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
      <path d="M5 12l2 2 4-4" />
      <path d="M3 6h18M3 18h18" />
    </svg>
  );
}

function PaymentHistoryIcon(props) {
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
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M7 15h.01M11 15h2" />
    </svg>
  );
}

function ClassBookingIcon(props) {
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
      <path d="M3 6h18M3 12h18M3 18h18" />
      <path d="M9 6v12" />
      <path d="M15 6v12" />
    </svg>
  );
}

function PendingPaymentsIcon(props) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4l3 3" />
    </svg>
  );
}
function WorkoutIcon(props) {
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
      <path d="M14.4 14.4L9.6 9.6" />
      <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
      <path d="M21.5 21.5l-1.4-1.4" />
      <path d="M3.9 3.9L2.5 2.5" />
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


function HomeIcon(props) {
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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function CalendarIcon(props) {
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
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
