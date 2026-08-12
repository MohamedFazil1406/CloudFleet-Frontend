import { Link } from "react-router";

const NotFound = () => {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
            <div className="text-center max-w-md">

                <div className="text-8xl font-bold text-cyan-400">
                    404
                </div>

                <h1 className="text-2xl font-bold text-white mt-6">
                    Page not found
                </h1>

                <p className="text-slate-400 mt-3">
                    The page you're looking for doesn't exist or may have
                    been moved.
                </p>

                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 mt-8 px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition"
                >
                    ← Back to Dashboard
                </Link>

            </div>
        </div>
    );
};

export default NotFound;