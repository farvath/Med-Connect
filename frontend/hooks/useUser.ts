import { useUserStore } from "../store/userStore";

export const useUser = () => {
  const name = useUserStore((state: any) => state.name);
  const specialty = useUserStore((state: any) => state.specialty);
  const icon = useUserStore((state: any) => state.icon);
  const setUser = useUserStore((state: any) => state.setUser);
  const clearUser = useUserStore((state: any) => state.clearUser);
  return { name, specialty, icon, setUser, clearUser };
};
