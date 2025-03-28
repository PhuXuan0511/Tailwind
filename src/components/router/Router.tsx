import { lazy, Suspense } from 'react';
import { Outlet, RouteObject, useRoutes, BrowserRouter } from 'react-router-dom';

const Loading = () => <p className="p-4 w-full h-full text-center">Loading...</p>;

const IndexScreen = lazy(() => import('~/components/screens/Index'));
const ManageBookScreen = lazy(() => import('~/components/screens/ManageBook'));
const UpdateBookScreen = lazy(() => import('../screens/UpdateBook'));
const AddBookScreen = lazy(() => import('~/components/screens/AddBook'));
const Page404Screen = lazy(() => import('~/components/screens/404'));
const ViewBooksScreen = lazy(() => import('~/components/screens/ViewBooks')); // Import ViewBooks

function Layout() {
  return (
    <div>
      <nav className="p-4 flex items-center justify-between">
        <span>Header</span>
      </nav>
      <Outlet />
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
          element: <IndexScreen />,
        },
        {
          path: 'manage-book',
          element: <ManageBookScreen />,
        },
        {
          path: 'manage-book/update',
          element: <UpdateBookScreen />,
        },
        {
          path: 'manage-book/update/add',
          element: <AddBookScreen />,
        },
        {
          path: 'manage-book/list', // Add route for ViewBooks
          element: <ViewBooksScreen />,
        },
        {
          path: '*',
          element: <Page404Screen />,
        },
      ],
    },
  ];
  const element = useRoutes(routes);
  return (
    <Suspense fallback={<Loading />}>{element}</Suspense>
  );
};