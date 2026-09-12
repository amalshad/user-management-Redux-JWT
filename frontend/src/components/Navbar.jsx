import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, loginSuccess } from "../features/authSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import Avatar from "./Avatar";
import Logo from "./Logo";

function Navbar() {
  const dispatch = useDispatch();
  const { user, token, admin, adminToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutUser = () => {
    dispatch(logout("user"));
    navigate("/login");
  };

  const handleLogoutAdmin = () => {
    dispatch(logout("admin"));
    navigate("/login");
  };

  useEffect(() => {
    const syncUserSession = async () => {
      if (token) {
        try {
          const res = await API.get("/users/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          dispatch(loginSuccess({ user: res.data, token }));
        } catch (error) {
          if (error.response?.status === 401) {
            dispatch(logout("user"));
            toast.error("Your session has expired or your account has been deleted.");
            navigate("/login");
          }
        }
      }
    };

    const syncAdminSession = async () => {
      if (adminToken) {
        try {
          const res = await API.get("/users/profile", {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          });
          dispatch(loginSuccess({ user: res.data, token: adminToken }));
        } catch (error) {
          if (error.response?.status === 401) {
            dispatch(logout("admin"));
            toast.error("Admin session has expired.");
            navigate("/login");
          }
        }
      }
    };

    syncUserSession();
    syncAdminSession();
  }, [location.pathname, token, adminToken, dispatch, navigate]);

  const showAdminNav = location.pathname.startsWith("/admin") && admin;
  const showUserNav = !showAdminNav && user;
  const showFallbackAdminNav = !showAdminNav && !user && admin;

  // The navbar swaps its entire palette depending on context: the light
  // Lime Sprout / Fresh Canopy theme everywhere in the app, and the dark
  // Silver / Luminous Moss theme while inside the admin dashboard.
  const isAdminTheme = showAdminNav;

  return (
    <nav
      className={
        isAdminTheme
          ? "bg-silver border-b border-luminous-moss/20 px-6 py-4 shadow-sm fixed top-0 w-full z-50"
          : "bg-lime-sprout border-b border-fresh-canopy/15 px-6 py-4 shadow-sm fixed top-0 w-full z-50"
      }
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        <Link
          to="/"
          className={
            isAdminTheme
              ? "text-xl font-bold text-white tracking-tight flex items-center gap-2.5"
              : "text-xl font-bold text-fresh-canopy tracking-tight flex items-center gap-2.5"
          }
        >
          <Logo dark={isAdminTheme} />
          User Management
        </Link>

        <div
          className={
            isAdminTheme
              ? "flex items-center gap-6 text-sm font-medium text-gray-300"
              : "flex items-center gap-6 text-sm font-medium text-fresh-canopy"
          }
        >
          {!user && !admin && (
            <>
              <Link to="/login" className="hover:opacity-70 transition-opacity">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-fresh-canopy text-white px-4 py-2 rounded-full hover:brightness-110 transition-all shadow-sm font-semibold"
              >
                Register
              </Link>
            </>
          )}

          {(user || admin) && (
            <div className="flex items-center gap-5">
              <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Avatar user={user || admin} sizeClass="w-9 h-9" dark={isAdminTheme} />
                <span className={isAdminTheme ? "font-semibold text-white" : "font-semibold text-fresh-canopy"}>
                   {(user || admin).name.split(" ")[0]}
                  {admin && (
                    <span
                      className={
                        isAdminTheme
                          ? "ml-2 text-[10px] font-bold uppercase tracking-wider bg-luminous-moss/15 text-luminous-moss border border-luminous-moss/30 px-2 py-0.5 rounded-full relative -top-0.5"
                          : "ml-2 text-[10px] font-bold uppercase tracking-wider bg-fresh-canopy/10 text-fresh-canopy border border-fresh-canopy/20 px-2 py-0.5 rounded-full relative -top-0.5"
                      }
                    >
                      Admin
                    </span>
                  )}
                </span>
              </Link>

              {admin && (
                <>
                  <div className={isAdminTheme ? "h-5 w-px bg-white/15" : "h-5 w-px bg-fresh-canopy/20"}></div>
                  <Link to="/admin" className="hover:opacity-70 transition-opacity font-semibold">
                    Dashboard
                  </Link>
                </>
              )}

              <div className={isAdminTheme ? "h-5 w-px bg-white/15" : "h-5 w-px bg-fresh-canopy/20"}></div>

              <button
                onClick={admin ? handleLogoutAdmin : handleLogoutUser}
                className="hover:opacity-70 transition-opacity"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
