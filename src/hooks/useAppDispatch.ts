import { TypedUseSelectorHook, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";

// Ces hooks vont être utilisés dans toute l'application pour éviter de devoir les redéfinir à chaque fois
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
