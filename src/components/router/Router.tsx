import { lazy, Suspense } from 'react';
import { Outlet, RouteObject, useRoutes, BrowserRouter, useNavigate } from 'react-router-dom';
import RequireAuth from '~/components/auth/RequireAuth'; // Import RequireAuth for protected routes
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications
const Loading = () => <p className="p-4 w-full h-full text-center">Loading...</p>;

// Lazy load screens
const HomepageScreen = lazy(() => import('~/components/screens/Homepage')); // Unified Homepage
const AdminDashboardScreen = lazy(() => import('~/components/screens/drive-thru/admin/AdminDashboard')); // Admin Dashboard
const ManageBookScreen = lazy(() => import('~/components/screens/drive-thru/admin/manage-books/ManageBook'));
const AddBookScreen = lazy(() => import('~/components/screens/drive-thru/admin/manage-books/AddBook')); // AddBook page
const EditBookScreen = lazy(() => import('~/components/screens/drive-thru/admin/manage-books/EditBook')); // EditBook page
const ManageUserScreen = lazy(() => import('~/components/screens/drive-thru/admin/manage-users/ManageUser')); // Manage User page
const AddUserScreen = lazy(() => import('~/components/screens/drive-thru/admin/manage-users/AddUser')); // Add User page
const EditUserScreen = lazy(() => import('~/components/screens/drive-thru/admin/manage-users/EditUser')); // Edit User page
const Page404Screen = lazy(() => import('~/components/screens/404')); // 404 page
const ManageLendingScreen = lazy(() => import('~/components/screens/drive-thru/admin/manage-lendings/ManageLending')); // Manage Lending page
const EditLendingScreen = lazy(() => import('~/components/screens/drive-thru/admin/manage-lendings/EditLending')); // Edit Lending page
const LoginScreen = lazy(() => import('~/components/screens/login/Login')); // Login page
const ViewProfileScreen = lazy(() => import('~/components/screens/drive-thru/view-profile/ViewProfile')); // View Profile page
const ViewBook = lazy(() => import('~/components/screens/drive-thru/user/view-books/ViewBook')); // Lazy load ViewBook
const ViewLending = lazy(() => import('~/components/screens/drive-thru/user/view-lendings/ViewLending')); // Lazy load ViewLending
import AboutUsScreen from '~/components/screens/AboutUs'; // Import the About Us screen
const BookDetail = lazy(() => import('~/components/screens/drive-thru/user/view-books/BookDetailScreen')); // Lazy load BookDetailScreen
const ManageNewsScreen = lazy(() => import('~/components/screens/news/ManageNews')); // Admin Manage News page
const AddNewsScreen = lazy(() => import('~/components/screens/news/AddNews')); // Add News page
const ViewNewsScreen = lazy(() => import('~/components/screens/news/ViewNews'));
const ViewInformationScreen = lazy(() => import('~/components/screens/Information')); // Information page
const ManageCategoryScreen = lazy(() => import('~/components/screens/drive-thru/admin/manage-categories/ManageCategory'));
const ManageAuthorScreen = lazy(() => import('~/components/screens/drive-thru/admin/manage-authors/ManageAuthor')); // ✅ Lazy load ManageAuthor
const SignUpScreen = lazy(() => import('~/components/screens/login/SignUp')); // Lazy load SignUpScreen
const InformationScreen = lazy(() => import('~/components/screens/Information'));

import React, { useState, useRef, useEffect } from "react";
import avatarImg from "~/components/image/avatar.jpg"; // Import your avatar image
import { useAuth } from "~/lib/useAuth"; // <-- Make sure you have a useAuth hook
import bellIcon from "~/components/image/bell.svg"; // Add a bell icon SVG to your image folder
import { collection, query, where, getFirestore, onSnapshot, writeBatch, getDocs } from "firebase/firestore";

function Layout({ showHeader = true, children }: { showHeader?: boolean; children: React.ReactNode }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, role } = useAuth?.() || { user: null, role: null };
  const avatarUrl = avatarImg;

  // Fetch notifications for user role "user"
  useEffect(() => {
    if (role === "user" && user?.uid) {
      const db = getFirestore();
      const notificationsCollection = collection(db, "notifications");

      // Query unread notifications
      const unreadQuery = query(notificationsCollection, where("userId", "==", user.uid), where("read", "==", false));
      const unsubscribeUnread = onSnapshot(unreadQuery, (snapshot) => {
        setUnreadCount(snapshot.docs.length); // Count unread notifications
      });

      // Query all notifications
      const allQuery = query(notificationsCollection, where("userId", "==", user.uid));
      const unsubscribeAll = onSnapshot(allQuery, (snapshot) => {
        const notificationsList: string[] = snapshot.docs.map((doc) => doc.data().message);
        setNotifications(notificationsList);
      });

      return () => {
        unsubscribeUnread();
        unsubscribeAll();
      };
    }
  }, [role, user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
        setBellOpen(false);
      }
    }
    if (dropdownOpen || bellOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen, bellOpen]);

  // Handle bell click: open notification list and mark all as read
  const handleBellClick = async () => {
    setBellOpen((open) => !open);

    if (user?.uid) {
      const db = getFirestore();
      const notificationsCollection = collection(db, "notifications");

      // Query unread notifications
      const unreadQuery = query(notificationsCollection, where("userId", "==", user.uid), where("read", "==", false));
      const snapshot = await getDocs(unreadQuery);

      // Mark all unread notifications as read
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { read: true }); // Update the read field to true
      });
      await batch.commit();

      setUnreadCount(0); // Reset unread count
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {showHeader && (
        <nav className="p-4 flex items-center justify-between bg-gray-800 shadow">
          {/* Clickable Header */}
          <button
            onClick={() => navigate("/homepage")}
            className="text-3xl text-blue-500 hover:text-blue-400 transition"
          >
            Tailwind <span className="text-purple-500">Library</span>
          </button>

          {/* Bell Icon and Avatar Dropdown */}
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            {/* Bell icon for users only */}
            {role === "user" && (
              <div className="relative flex items-end">
                <button
                  onClick={handleBellClick}
                  className="focus:outline-none"
                  aria-label="Notifications"
                  style={{ marginBottom: '1px' }}
                >
                  <img src={bellIcon} alt="Notifications" className="w-7 h-7" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {bellOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 text-white rounded shadow-lg z-50 border border-gray-700">
                    <div className="p-2 max-h-60 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="text-gray-400 text-sm p-2">No notifications</div>
                      ) : (
                        notifications.slice(0, 5).map((msg, idx) => (
                          <button
                            key={idx}
                            className="block w-full text-left px-2 py-2 hover:bg-gray-700 text-sm"
                            onClick={() => {
                              setBellOpen(false);
                              navigate("/notifications");
                            }}
                          >
                            {msg.length > 60 ? msg.slice(0, 60) + "..." : msg}
                          </button>
                        ))
                      )}
                    </div>
                    <button
                      className="block w-full text-center py-2 border-t border-gray-700 hover:bg-gray-700 text-xs"
                      onClick={() => {
                        setBellOpen(false);
                        navigate("/notifications");
                      }}
                    >
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* Avatar Dropdown */}
            <button
              onClick={() => setDropdownOpen((open) => !open)}
              className="focus:outline-none"
            >
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
              />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-gray-800 text-white rounded shadow-lg z-50 border border-gray-700">
                {/* Only show Notifications button for users with role "user" */}
                {role === "user" && (
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/notifications");
                    }}
                  >
                    Notifications
                  </button>
                )}
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/view-profile");
                  }}
                >
                  View Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  onClick={() => {
                    setDropdownOpen(false);
                    if (typeof window !== "undefined") {
                      window.location.href = "/";
                    }
                  }}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </nav>
      )}
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
}

export const Router = () => {
  return (
    <BrowserRouter>
      <InnerRouter />
    </BrowserRouter>
  );
};

const NotificationsScreen = lazy(() => import('~/components/screens/Notifications')); // Lazy load NotificationsScreen

const InnerRouter = () => {
  const routes: RouteObject[] = [
    {
      path: '/', // Default route
      element: <LoginScreen />, // Login page
    },
    {
      path: '/homepage', // Unified Homepage route
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <HomepageScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/admin-manage-news', // Admin Manage News route
      element: (
        <Layout showHeader={true}>
          <RequireAuth> {/* No role restriction */}
            <ManageNewsScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/admin-add-news', // Add News route
      element: (
        <Layout showHeader={true}>
          <RequireAuth> {/* No role restriction */}
            <AddNewsScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/admin-dashboard',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <AdminDashboardScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    
    {
      path: '/book-list',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <ViewBook />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/book-detail/:id',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <BookDetail />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/lending-list',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <ViewLending />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/manage-user',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <ManageUserScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/manage-user/add',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <AddUserScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/manage-user/edit/:id',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <EditUserScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/manage-book',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <ManageBookScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/manage-book/add',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <AddBookScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/manage-book/edit/:id',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <EditBookScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/manage-lending',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <ManageLendingScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/manage-lending/edit/:id',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <EditLendingScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/view-profile',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <ViewProfileScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/about-us', // Add the About Us path
      element: (
        <Layout showHeader={true}>
          <AboutUsScreen />
        </Layout>
      ),
    },
    {
      path: '/news',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <ViewNewsScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/information',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <ViewInformationScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/manage-category',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <ManageCategoryScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/manage-author',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <ManageAuthorScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/signup', // Add the SignUp path
      element: (
        <Layout showHeader={true}>
          <SignUpScreen />
        </Layout>
      ),
    },

    {
      path: '/information', // <-- Add this route
      element: (
        <Layout showHeader={true}>
          <InformationScreen />
        </Layout>
      ),
    },
    {
      path: '/edit-profile',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            {/* Lazy load or import your EditProfileScreen here */}
            {React.createElement(lazy(() => import('~/components/screens/drive-thru/view-profile/EditProfile')))}
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/notifications', // Notifications route
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <NotificationsScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '*',
      element: <Page404Screen />, // 404 page for unmatched routes
    },
  ];

  const element = useRoutes(routes);
  return <Suspense fallback={<Loading />}>{element}</Suspense>;
};