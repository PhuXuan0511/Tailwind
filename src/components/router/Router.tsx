import { lazy, Suspense } from 'react';
import { Outlet, RouteObject, useRoutes, BrowserRouter } from 'react-router-dom';

const Loading = () => <p className="p-4 w-full h-full text-center">Loading...</p>;

const HomepageScreen = lazy(() => import('~/components/screens/Homepage')); // Renamed from Index to Homepage
const ManageBookScreen = lazy(() => import('~/components/screens/manage-books/ManageBook')); // Acts as ViewBooks
const AddBookScreen = lazy(() => import('~/components/screens/manage-books/AddBook')); // AddBook page
const EditBookScreen = lazy(() => import('~/components/screens/manage-books/EditBook')); // EditBook page
const Page404Screen = lazy(() => import('~/components/screens/404')); // 404 page

function Layout({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {showHeader && (
        <nav className="p-4 flex items-center justify-between bg-gray-800 shadow">
          <span className="text-white font-bold text-lg">Library Management</span>
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
          element: <HomepageScreen />, // Updated to use Homepage
        },
        {
          path: 'manage-book',
          element: <ManageBookScreen />, // Acts as the ViewBooks list
        },
        {
          path: 'manage-book/add',
          element: <AddBookScreen />, // Route for adding a new book
        },
        {
          path: 'manage-book/edit/:id',
          element: <EditBookScreen />, // Route for editing a book
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