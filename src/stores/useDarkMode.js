import { create } from 'zustand';
import { LocalStorageKey } from '~/utils/common/constant';

const getInitialDarkModeEnabledState = () => {
    if (typeof window === 'undefined') {
        return false;
    }
    const item = window.localStorage.getItem(LocalStorageKey.DarkModeEnabled);
    return item ? JSON.parse(item) : false;
};

const useDarkMode = create((set, get) => ({
    enabledState: getInitialDarkModeEnabledState(),
    setEnabledState: (value) => {
        const valueToStore = value instanceof Function ? value(get().enabledState) : value;
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(LocalStorageKey.DarkModeEnabled, JSON.stringify(valueToStore));
        }
        set({ enabledState: valueToStore });
    },
}));

export default useDarkMode;
