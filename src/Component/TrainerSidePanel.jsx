import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/userSlice";

const TrainerSidePanel = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation(); // Get the current location
  const [activeLink, setActiveLink] = useState(location.pathname); // Initialize with the current pathname

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

  const handleLinkClick = (link) => {
    setActiveLink(link); // Update the active link
  };

 


//   return (
//     <div className="flex w-full min-h-screen bg-background dark:text-foreground">
//       <aside className="fixed inset-y-2 left-0 z-10 flex flex-col w-64 border-r border-blue-700 bg-gradient-to-b from-[#0D1117] to-[#1A1F2C] sm:flex rounded-tr-2xl rounded-br-2xl shadow-2xl">
//         <div className="flex h-[60px] items-center px-6">
//           <Link
//             to="#"
//             className="flex items-center gap-2 font-semibold text-white"
//             prefetch={false}
//           >
//             <DumbbellIcon className="w-6 h-6" />
//             <span>Gym Trainer</span>
//           </Link>
//         </div>
//         <div className="flex-1">
//           <nav className="grid items-start px-4 text-sm font-medium">
//             <Link
//               to="/"
//               className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 ${
//                 activeLink === "/"
//                   ? "text-white bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg"
//                   : "text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 hover:shadow-lg"
//               }`}
//               onClick={() => handleLinkClick("/")}
//               prefetch={false}
//             >
//               <HomeIcon className="w-4 h-4" />
//               Home
//             </Link>
//             <Link
//               to="/trainer-dashboard"
//               className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 ${
//                 activeLink === "/trainer-dashboard"
//                   ? "text-white bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg"
//                   : "text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 hover:shadow-lg"
//               }`}
//               onClick={() => handleLinkClick("/trainer-dashboard")}
//               prefetch={false}
//             >
//               <UserIcon className="w-4 h-4" />
//               Trainer Profile
//             </Link>
//             <Link
//               to="/trainer-dashboard/my-plans"
//               className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 ${
//                 activeLink === "/trainer-dashboard/my-plans"
//                   ? "text-white bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg"
//                   : "text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 hover:shadow-lg"
//               }`}
//               onClick={() => handleLinkClick("/trainer-dashboard/my-plans")}
//               prefetch={false}
//             >
//               <ClipboardIcon className="w-4 h-4" />
//               My Plans
//             </Link>
//             <Link
//               to="/trainer-dashboard/class-schedule"
//               className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 ${
//                 activeLink === "/trainer-dashboard/class-schedule"
//                   ? "text-white bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg"
//                   : "text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 hover:shadow-lg"
//               }`}
//               onClick={() => handleLinkClick("/trainer-dashboard/class-schedule")} // Use handleLinkClick here
//               prefetch={false}
//             >
//               <UserIcon className="w-4 h-4" />
//               Class Scheduled
//             </Link>
//           </nav>
//         </div>
//       </aside>
  
//       <div className="flex flex-col w-full sm:gap-4 sm:py-4 sm:pl-64">
//         <header className="flex items-center gap-4 px-6 bg-#F7F3FA border-b shadow-sm h-14 md:px-6">
//           <Link href="#" className="lg:hidden">
//             <DumbbellIcon className="w-6 h-6" />
//             <span className="sr-only">Home</span>
//           </Link>
//           <div className="flex-1 w-full"></div>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="border rounded-full w-15 h-15 hover:bg-gray-100"
//               >
//                 <img
//                   src={`${user.photoUrl}`}
//                   width="32"
//                   height="32"
//                   className="w-10 h-10 rounded-full"
//                   alt="Avatar"
//                   style={{ aspectRatio: "32/32", objectFit: "cover" }}
//                 />
//                 <span className="sr-only">Toggle user menu</span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="shadow-lg">
//               <Link to={profileRoute()}>
//                 <DropdownMenuLabel>My Account</DropdownMenuLabel>
//               </Link>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>Support</DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={() => dispatch(logout())}>
//                 Logout
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </header>
//         <main className="grid items-start flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 bg-gray-50">
//           <div className="grid gap-4 lg:col-span-2 xl:col-span-3">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default TrainerSidePanel;


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
          <span>Gym Trainer</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="grid gap-1 px-4 text-sm font-medium">
        {[
          { to: "/", icon: HomeIcon, label: "Home" },
          { to: "/trainer-dashboard", icon: UserIcon, label: "Trainer Profile" },
          { to: "/trainer-dashboard/my-plans", icon: ClipboardIcon, label: "My Plans" },
          { to: "/trainer-dashboard/class-schedule", icon: UserIcon, label: "Class Schedule" },
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
      <div className="flex items-center gap-4 px-4 py-6 mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="border rounded-full w-14 h-14 "
              >
                <img
                  src={user?.photoUrl}
                  width="50"
                  height="50"
                  className="object-cover w-12 h-12 rounded-full"
                  alt="Avatar"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="shadow-lg">
              <Link to="/profile">
                <DropdownMenuItem>My Account</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => dispatch(logout())}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-lg font-medium text-white">{user?.name}</span>
        </div>
    </aside>

    {/* Main Content */}
    <div className="flex flex-col w-full sm:gap-4 sm:py-4 sm:pl-64">
      <header className="flex items-center gap-4 px-6 bg-background h-14 md:px-6">
        <Link to="#" className="lg:hidden">
          <DumbbellIcon className="w-6 h-6" />
          <span className="sr-only">Home</span>
        </Link>
        <div className="flex-1 w-full"></div>
      </header>

      <main className="grid items-start flex-1 gap-6 p-6 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 bg-gray-50">
        <div className="grid gap-4 lg:col-span-2 xl:col-span-3">{children}</div>
      </main>
    </div>
  </div>
);
};

export default TrainerSidePanel;


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


