import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ManualUser } from '../types/ManualUser';

interface ManualUserStore {
  users: ManualUser[];
  addUser: (user: ManualUser) => void;
  deleteUser: (userId: number) => void;
  updateUser: (updatedUser: ManualUser) => void;
  clearAll: () => void;
  setUsers: (users: ManualUser[]) => void;
}

export const useManualUserStore = create<ManualUserStore>()(
  persist(
    (set) => ({
      users: [],
      addUser: (user: ManualUser) => set((state: ManualUserStore) => ({ 
        users: [{ ...user, id: user.id || Date.now() }, ...state.users] 
      })),
      deleteUser: (userId: number) => set((state: ManualUserStore) => ({ 
        users: state.users.filter((user: ManualUser) => user.id !== userId) 
      })),
      updateUser: (updatedUser: ManualUser) => set((state: ManualUserStore) => ({
        users: state.users.map((user: ManualUser) => 
          user.id === updatedUser.id ? updatedUser : user
        )
      })),
      clearAll: () => set(() => ({ users: [] })),
      setUsers: (users: ManualUser[]) => set(() => ({ users }))
    }),
    { name: 'manual-users' }
  )
);