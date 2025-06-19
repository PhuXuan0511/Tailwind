import React, { lazy, Suspense, useState, useRef, useEffect } from 'react';
import { Outlet, RouteObject, useRoutes, BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import RequireAuth from '~/components/auth/RequireAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import avatarImg from "~/components/image/avatar.jpg";
import { useAuth } from "~/lib/useAuth";
import bellIcon from "~/components/image/bell.svg";
import { collection, query, where, getFirestore, onSnapshot, writeBatch, getDocs } from "firebase/firestore";

const Loading = () => <p className="p-4 w-full h-full text-center">Loading...</p>;

// Lazy load screens
const HomepageScreen = lazy(() => import('~/components/screens/Homepage'));
const AdminDashboardScreen = lazy(() => import('~/components/screens/drive-thru/admin/AdminDashboard'));
const ManageBookScreen = lazy(() => import('~/components/screens/drive-thru/admin/manage-books/ManageBook'));
const AddBookScreen = lazy(() => import('~/components/screens/drive-thru/admin/manage-books/AddBook'));
const EditBookScreen = lazy(() => import('~/components/screens/drive-thru/admin/manage-books/EditBook'));
const ManageUserScreen = lazy(() => import('~/components/screens/drive-thru/admin/manage-users/ManageUser'));
const AddUserScreen = lazy(() => import('~/components/screens/drive-thru/admin/manage-users/AddUser'));
const EditUserScreen = lazy(() => import('~/components/screens/drive-thru/admin/manage-users/EditUser'));
const Page404Screen = lazy(() => import('~/components/screens/404'));
const ManageLendingScreen = lazy(() => import('~/components/screens/drive-thru/admin/manage-lendings/ManageLending'));
const EditLendingScreen = lazy(() => import('~/components/screens/drive-thru/admin/manage-lendings/EditLending'));
const LoginScreen = lazy(() => import('~/components/screens/login/Login'));
const ViewProfileScreen = lazy(() => import('~/components/screens/drive-thru/view-profile/ViewProfile'));
const ViewBook = lazy(() => import('~/components/screens/drive-thru/user/view-books/ViewBook'));
const ViewLending = lazy(() => import('~/components/screens/drive-thru/user/view-lendings/ViewLending'));
import AboutUsScreen from '~/components/screens/AboutUs';
const BookDetail = lazy(() => import('~/components/screens/drive-thru/user/view-books/BookDetailScreen'));
const ManageNewsScreen = lazy(() => import('~/components/screens/news/ManageNews'));
const AddNewsScreen = lazy(() => import('~/components/screens/news/AddNews'));
const ViewNewsScreen = lazy(() => import('~/components/screens/news/ViewNews'));
const ViewInformationScreen = lazy(() => import('~/components/screens/Information'));
const ManageCategoryScreen = lazy(() => import('~/components/screens/drive-thru/admin/manage-categories/ManageCategory'));
const ManageAuthorScreen = lazy(() => import('~/components/screens/drive-thru/admin/manage-authors/ManageAuthor'));
const SignUpScreen = lazy(() => import('~/components/screens/login/SignUp'));
const InformationScreen = lazy(() => import('~/components/screens/Information'));
const NotificationsScreen = lazy(() => import('~/components/screens/drive-thru/user/view-notifications/Notifications'));

// Helper function to calculate time elapsed
function getTimeElapsed(timestamp: string): string {
  const now = new Date();
  const notificationTime = new Date(timestamp);
  const diffMs = now.getTime() - notificationTime.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays} days ${diffHours} hours ago`;
  }
  if (diffHours > 0) {
    return `${diffHours} hours ${diffMinutes} mins ago`;
  }
  return `${diffMinutes} mins ago`;
}

function Layout({ showHeader = true, children }: { showHeader?: boolean; children: React.ReactNode }) {
  const { role, user } = useAuth?.() || { role: null, user: null };
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<{ message: string; timestamp: string }[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        const notificationsList = snapshot.docs.map((doc) => ({
          message: doc.data().message,
          timestamp: doc.data().timestamp,
        }));
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

  // Only show user nav if role is "user" and on specific routes
  const showUserNav =
    role === "user" &&
    ["/homepage", "/book-list", "/lending-list"].some((path) =>
      location.pathname.startsWith(path)
    ) ||
    (role === "user" && location.pathname.startsWith("/book-detail/"));

  return (
  <div className="min-h-screen bg-gray-900 text-white">
    {showHeader && (
      <nav className="p-4 flex items-center justify-between bg-gray-800 shadow">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => navigate("/homepage")}
            className="text-3xl text-blue-500 hover:text-blue-400 transition"
          >
            Tailwind <span className="text-purple-500">Library</span>
          </button>
          {showUserNav && (
            <>
              <button
                type="button"
                onClick={() => navigate("/book-list")}
                className={`relative text-base font-semibold tracking-wide text-blue-300 hover:text-blue-400 transition pb-1
                  after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-400 after:scale-x-0 after:transition-transform after:origin-left hover:after:scale-x-100 ${
                    location.pathname.startsWith("/book-list")
                      ? "after:scale-x-100 after:bg-blue-500 text-blue-400"
                      : ""
                  }`}
              >
                Book List
              </button>
              <button
                type="button"
                onClick={() => navigate("/lending-list")}
                className={`relative text-base font-semibold tracking-wide text-blue-300 hover:text-blue-400 transition pb-1
                  after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-400 after:scale-x-0 after:transition-transform after:origin-left hover:after:scale-x-100 ${
                    location.pathname.startsWith("/lending-list")
                      ? "after:scale-x-100 after:bg-blue-500 text-blue-400"
                      : ""
                  }`}
              >
                My Lendings
              </button>
            </>
          )}
        </div>

        {/* Bell & Avatar */}
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {role === "user" && (
            <div className="relative flex items-end">
              <button
                type="button"
                onClick={handleBellClick}
                className="focus:outline-none"
                aria-label="Notifications"
                style={{ marginBottom: "1px" }}
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
                      notifications.slice(0, 5).map((notification, idx) => (
                        <button
                          type="button"
                          key={idx}
                          className="block w-full text-left px-2 py-2 hover:bg-gray-700 text-sm"
                          onClick={() => {
                            setBellOpen(false);
                            navigate("/notifications");
                          }}
                        >
                          <span>{notification.message}</span>
                          <span className="block text-gray-500 text-xs">
                            {getTimeElapsed(notification.timestamp)}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                  <button
                    type="button"
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
            type="button"
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
              {role === "user" && (
                <button
                  type="button"
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
                type="button"
                className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/view-profile");
                }}
              >
                View Profile
              </button>
              <button
                type="button"
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
    <div className="container mx-auto px-4 py-6">{children}</div>
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

const InnerRouter = () => {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <LoginScreen />,
    },
    {
      path: '/homepage',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <HomepageScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/admin-manage-news',
      element: (
        <Layout showHeader={true}>
          <RequireAuth requiredRole="admin">
            <ManageNewsScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/admin-add-news',
      element: (
        <Layout showHeader={true}>
          <RequireAuth requiredRole="admin">
            <AddNewsScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/admin-dashboard',
      element: (
        <Layout showHeader={true}>
          <RequireAuth requiredRole="admin">
            <AdminDashboardScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/book-list',
      element: (
        <Layout showHeader={true}>
          <RequireAuth requiredRole='user'>
            <ViewBook />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/book-detail/:id',
      element: (
        <Layout showHeader={true}>
          <RequireAuth requiredRole='user'>
            <BookDetail />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/lending-list',
      element: (
        <Layout showHeader={true}>
          <RequireAuth requiredRole='user'>
            <ViewLending />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/manage-user',
      element: (
        <Layout showHeader={true}>
          <RequireAuth requiredRole="admin">
            <ManageUserScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/manage-user/add',
      element: (
        <Layout showHeader={true}>
          <RequireAuth requiredRole="admin">
            <AddUserScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/manage-user/edit/:id',
      element: (
        <Layout showHeader={true}>
          <RequireAuth requiredRole="admin">
            <EditUserScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/manage-book',
      element: (
        <Layout showHeader={true}>
          <RequireAuth requiredRole="admin">
            <ManageBookScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/manage-book/add',
      element: (
        <Layout showHeader={true}>
          <RequireAuth requiredRole="admin">
            <AddBookScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/manage-book/edit/:id',
      element: (
        <Layout showHeader={true}>
          <RequireAuth requiredRole="admin">
            <EditBookScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/manage-lending',
      element: (
        <Layout showHeader={true}>
          <RequireAuth requiredRole="admin">
            <ManageLendingScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/manage-lending/edit/:id',
      element: (
        <Layout showHeader={true}>
          <RequireAuth requiredRole="admin">
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
      path: '/about-us',
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
          <RequireAuth requiredRole="admin">
            <ManageCategoryScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/manage-author',
      element: (
        <Layout showHeader={true}>
          <RequireAuth requiredRole="admin">
            <ManageAuthorScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/signup',
      element: (
        <Layout showHeader={false}>
          <SignUpScreen />
        </Layout>
      ),
    },
    {
      path: '/edit-profile',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            {React.createElement(lazy(() => import('~/components/screens/drive-thru/view-profile/EditProfile')))}
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/notifications',
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
      element: <Page404Screen />,
    },
  ];

  const element = useRoutes(routes);
  return <Suspense fallback={<Loading />}>{element}</Suspense>;
};