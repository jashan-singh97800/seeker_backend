import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { setCredentials } from '../features/auth/authSlice';

const GoogleCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));
                dispatch(setCredentials({ user, access_token: token }));

                // Redirect based on role
                if (user.role === 'employer') {
                    navigate('/employer');
                } else {
                    navigate('/');
                }
            } catch (err) {
                console.error('Failed to parse user data:', err);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-dashboard">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-gray-700">Authenticating...</h2>
            </div>
        </div>
    );
};

export default GoogleCallback;
