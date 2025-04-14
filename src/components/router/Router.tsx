import { lazy, Suspense } from 'react';
import { Outlet, RouteObject, useRoutes, BrowserRouter, useNavigate } from 'react-router-dom';
import RequireAuth from '~/components/auth/RequireAuth'; // Import RequireAuth for protected routes
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications
const Loading = () => <p className="p-4 w-full h-full text-center">Loading...</p>;

// Lazy load screens
const HomepageScreen = lazy(() => import('~/components/screens/homepage/Homepage')); // Unified Homepage
const AdminDashboardScreen = lazy(() => import('~/components/screens/homepage/AdminDashboard')); // Admin Dashboard
const UserDashboardScreen = lazy(() => import('~/components/screens/homepage/UserDashboard')); // User Dashboard
const ManageBookScreen = lazy(() => import('~/components/screens/manage-books/ManageBook'));
const AddBookScreen = lazy(() => import('~/components/screens/manage-books/AddBook')); // AddBook page
const EditBookScreen = lazy(() => import('~/components/screens/manage-books/EditBook')); // EditBook page
const ManageUserScreen = lazy(() => import('~/components/screens/manage-users/ManageUser')); // Manage User page
const AddUserScreen = lazy(() => import('~/components/screens/manage-users/AddUser')); // Add User page
const EditUserScreen = lazy(() => import('~/components/screens/manage-users/EditUser')); // Edit User page
const Page404Screen = lazy(() => import('~/components/screens/404')); // 404 page
const ManageLendingScreen = lazy(() => import('~/components/screens/manage-lendings/ManageLending')); // Manage Lending page
const AddLendingScreen = lazy(() => import('~/components/screens/manage-lendings/AddLending')); // Add Lending page
const EditLendingScreen = lazy(() => import('~/components/screens/manage-lendings/EditLending')); // Edit Lending page
const LoginScreen = lazy(() => import('~/components/screens/login/Login')); // Login page
const ViewProfileScreen = lazy(() => import('~/components/screens/view-profile/ViewProfile')); // View Profile page
const ViewBook = lazy(() => import('~/components/screens/view-books/ViewBook')); // Lazy load ViewBook
const ViewLending = lazy(() => import('~/components/screens/view-lendings/ViewLending')); // Lazy load ViewLending
import AboutUsScreen from '~/components/screens/homepage/AboutUs'; // Import the About Us screen

function Layout({ showHeader = true, children }: { showHeader?: boolean; children: React.ReactNode }) {
  const navigate = useNavigate(); // Import useNavigate for navigation

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {showHeader && (
        <nav className="p-4 flex items-center justify-between bg-gray-800 shadow">
          {/* Clickable Header */}
          <button
            onClick={() => navigate("/homepage")} // Navigate to the homepage
            className="text-3xl text-blue-500 hover:text-blue-400 transition"
          >
            Tailwind <span className="text-purple-500">Library</span>
          </button>

          {/* Profile Button */}
          <button
            onClick={() => navigate("/view-profile")} // Navigate to the profile page
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Profile
          </button>
        </nav>
      )}
      <div className="container mx-auto px-4 py-6">
        {children} {/* Render the children */}
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
      path: '/user-dashboard',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <UserDashboardScreen />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/user-dashboard/book-list',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <ViewBook />
          </RequireAuth>
        </Layout>
      ),
    },
    {
      path: '/user-dashboard/lending-list',
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
      path: '/manage-lending/add',
      element: (
        <Layout showHeader={true}>
          <RequireAuth>
            <AddLendingScreen />
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
      path: '*',
      element: <Page404Screen />, // 404 page for unmatched routes
    },
  ];

  const element = useRoutes(routes);
  return <Suspense fallback={<Loading />}>{element}</Suspense>;
};
