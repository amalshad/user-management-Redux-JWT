import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "../components/Avatar";

function Home() {
  const { user, admin } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex items-center justify-center bg-lime-sprout font-sans pt-16">
      <div className="bg-white/70 shadow-xl shadow-gray-200/50 rounded-2xl p-12 text-center max-w-lg w-full border border-gray-100">
        
        <h1 className="text-3xl font-extrabold text-fresh-canopy mb-2 tracking-tight">
          Welcome to User Management
        </h1>
        <p className="text-gray-600 mb-8 font-medium">
          Your modern user management dashboard.
        </p>

        {user ? (
          <div className="flex flex-col items-center space-y-6">
            <div className="p-1 bg-white rounded-full shadow-sm border border-gray-200">
              <Avatar user={user} sizeClass="w-28 h-28" textClass="text-4xl" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-fresh-canopy">
                {user.name}
              </h3>
              <p className="text-gray-600">{user.email}</p>
            </div>

            <div className="pt-4 flex gap-4 w-full justify-center">
              <Link
                to="/profile"
                className="bg-fresh-canopy text-white font-semibold px-6 py-2.5 rounded-full hover:brightness-110 transition-colors"
              >
                View Profile
              </Link>
            </div>

            {admin && (
              <div className="pt-4 border-t border-gray-200 w-full mt-6">
                <Link
                  to="/admin"
                  className="bg-white text-gray-900 border border-gray-300 font-semibold px-6 py-2.5 rounded-full hover:bg-lime-sprout transition-colors inline-block"
                >
                  Go to Admin Dashboard
                </Link>
              </div>
            )}
          </div>
        ) : admin ? (
          <div className="flex flex-col items-center space-y-6">
            <div className="w-24 h-24 bg-fresh-canopy text-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-fresh-canopy">
                Admin Panel Access
              </h3>
              <p className="text-gray-600 mt-1">Logged in as {admin.name}</p>
            </div>

            <div className="pt-4 w-full">
              <Link
                to="/admin"
                className="bg-fresh-canopy text-white font-semibold px-8 py-3 rounded-full hover:brightness-110 transition-all inline-block"
              >
                Enter Admin Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8 py-4">
            <div className="flex justify-center gap-4">
              <Link
                to="/login"
                className="bg-fresh-canopy text-white font-semibold px-8 py-3 rounded-full hover:brightness-110 transition-all flex-1"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-transparent border-2 border-gray-300 text-gray-900 font-semibold px-8 py-3 rounded-full hover:border-gray-400 hover:bg-lime-sprout transition-colors flex-1"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;