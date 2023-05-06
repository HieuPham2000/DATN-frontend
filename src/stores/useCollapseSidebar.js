import { create } from 'zustand';

const useCollapseSidebar = create((set) => ({
    collapsed: false,
    setCollapsed: (value) => set({ collapsed: value })
}));

export default useCollapseSidebar;
