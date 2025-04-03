import { lazy, Suspense } from 'react';
import { Outlet, RouteObject, useRoutes, BrowserRouter } from 'react-router-dom';
import RequireAuth from '~/components/auth/RequireAuth'; // Import RequireAuth for protected routes

const Loading = () => <p className="p-4 w-full h-full text-center">Loading...</p>;

const HomepageScreen = lazy(() => import('~/components/screens/Homepage'));
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

function Layout({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
       {showHeader && (
        <nav className="p-4 flex items-center justify-between bg-gray-800 shadow">
          <p className="text-3xl text-blue-500">Tailwind <span className="text-purple-500">Library</span></p>
        </nav>
      )}
      <div className="container mx-auto px-4 py-6">
        <Outlet />
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
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <RequireAuth>
              <HomepageScreen />
            </RequireAuth>
          ), // Homepage (protected)
        },
        {
          path: 'login',
          element: <LoginScreen />, // Login page (public)
        },
        {
          path: 'manage-user',
          element: (
            <RequireAuth>
              <ManageUserScreen />
            </RequireAuth>
          ), // Manage Users (protected)
        },
        {
          path: 'manage-user/add',
          element: (
            <RequireAuth>
              <AddUserScreen />
            </RequireAuth>
          ), // Add User (protected)
        },
        {
          path: 'manage-user/edit/:id',
          element: (
            <RequireAuth>
              <EditUserScreen />
            </RequireAuth>
          ), // Edit User (protected)
        },
        {
          path: 'manage-book',
          element: (
            <RequireAuth>
              <ManageBookScreen />
            </RequireAuth>
          ), // Manage Books (protected)
        },
        {
          path: 'manage-book/add',
          element: (
            <RequireAuth>
              <AddBookScreen />
            </RequireAuth>
          ), // Add Book (protected)
        },
        {
          path: 'manage-book/edit/:id',
          element: (
            <RequireAuth>
              <EditBookScreen />
            </RequireAuth>
          ), // Edit Book (protected)
        },
        {
          path: 'manage-lending',
          element: (
            <RequireAuth>
              <ManageLendingScreen />
            </RequireAuth>
          ), // Manage Lending (protected)
        },
        {
          path: 'manage-lending/add',
          element: (
            <RequireAuth>
              <AddLendingScreen />
            </RequireAuth>
          ), // Add Lending (protected)
        },
        {
          path: 'manage-lending/edit/:id',
          element: (
            <RequireAuth>
              <EditLendingScreen />
            </RequireAuth>
          ), // Edit Lending (protected)
        },
        {
          path: '*',
          element: <Page404Screen />, // 404 page for unmatched routes
        },
      ],
    },
  ];

  const element = useRoutes(routes);
  return <Suspense fallback={<Loading />}>{element}</Suspense>;
};
