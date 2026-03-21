import { Route, Routes, useLocation } from 'react-router-dom';
import { routes } from './routes/Routes';
import Sidebar from './Layout/Sidebar';
import { Suspense, useState } from 'react';
import RouteGuard from './routes/RouteGuard';
import Loader from './components/Loader';

const App = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const privateRoutes = routes.filter((route) => route.isPrivate);

    const privateMenu = routes.filter(
        (route) => route.isPrivate && !route.hideInMenu
    );

    const isPrivateRoute = privateRoutes.some((route) =>
        location.pathname.startsWith(route.path.split("/:")[0])
    );

    return (
        <div className="flex h-screen">

            {/* Sidebar */}
            {isPrivateRoute && (
                <>
                    <Sidebar
                        routes={privateMenu}
                        onNavigate={() => setSidebarOpen(false)}
                    />

                    {sidebarOpen && (
                        <div
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 z-40 md:hidden"
                        />
                    )}
                </>
            )}

            {/* Main */}
            <main className="flex-1 h-screen overflow-hidden">
                <Suspense fallback={<Loader />}>
                    <Routes>
                        {routes.map((route) => {
                            const Component = route.component;

                            return (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={
                                        <RouteGuard
                                            isPrivate={route.isPrivate}
                                            role={route.role}
                                        >
                                            <Component />
                                        </RouteGuard>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </Suspense>
            </main>
        </div>
    );
};

export default App;