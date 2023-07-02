import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './GlobalToast.scss';
import { useDarkMode } from '~/stores';

function GlobalToast() {
    const darkModeState = useDarkMode((state) => state.enabledState);
    return (
        <ToastContainer
            position="top-center"
            autoClose={5000}
            transition={Flip}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={darkModeState ? 'light' : 'dark'}
        />
    );
}

export default GlobalToast;
