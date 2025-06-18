import { Head } from "~/components/shared/Head";
import book404Gif from '../image/book-404.gif';

function Page404() {
  return (
    <>
      <Head title={'The page is not found'} />
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundColor: "#0f172a",
          backgroundImage: `
            radial-gradient(ellipse at 20% 30%, #64748b33 0%, transparent 60%),
            radial-gradient(ellipse at 80% 80%, #a21caf22 0%, transparent 70%),
            radial-gradient(ellipse at 60% 20%, #3b82f655 0%, transparent 60%),
            radial-gradient(ellipse at 50% 90%, #0ea5e955 0%, transparent 70%)
          `
        }}
      >
        {/* Decorative SVGs */}
        <svg
          className="absolute opacity-20 w-[500px] h-[500px] -left-40 -top-40 pointer-events-none"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="250" cy="250" r="250" fill="url(#paint0_radial)" />
          <defs>
            <radialGradient
              id="paint0_radial"
              cx="0"
              cy="0"
              r="1"
              gradientTransform="translate(250 250) scale(250)"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#a21caf" />
              <stop offset="1" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <svg
          className="absolute opacity-10 w-[350px] h-[350px] -right-24 -bottom-24 pointer-events-none"
          viewBox="0 0 350 350"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="175" cy="175" r="175" fill="url(#paint1_radial)" />
          <defs>
            <radialGradient
              id="paint1_radial"
              cx="0"
              cy="0"
              r="1"
              gradientTransform="translate(175 175) scale(175)"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#3b82f6" />
              <stop offset="1" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <div className="relative z-10 bg-gray-900/90 rounded-2xl shadow-2xl border border-gray-800 p-16 max-w-2xl mx-auto text-center">
          <div className="flex flex-col items-center">
            {/* Book GIF or SVG */}
            <div className="mb-10 flex flex-col items-center">
              <img
                src={book404Gif}
                alt="Animated Book"
                className="w-56 h-56 object-contain"
              />
            </div>
            <h1 className="text-6xl font-extrabold text-purple-400 mb-4 drop-shadow">404</h1>
            <h2 className="text-3xl font-bold text-purple-200 mb-6">Page Not Found</h2>
            <p className="text-xl text-gray-300 mb-10">
              Oops! The page you are looking for doesn’t exist.<br />
              Maybe you got lost in the library stacks.
            </p>
            <a
              href="/homepage"
              className="inline-block px-8 py-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold shadow transition"
            >
              Go to Homepage
            </a>
          </div>
        </div>
        {/* Animation for books */}
        <style>
          {`
            .animate-books {
              animation: books-bounce 2.5s infinite;
            }
            @keyframes books-bounce {
              0%, 100% { transform: translateY(0);}
              50% { transform: translateY(-8px);}
            }
          `}
        </style>
      </div>
    </>
  );
}

export default Page404;