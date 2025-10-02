
import { create } from 'zustand';


export const useCertInfoStore = create((set) => ({
    certInfo : null,
    setCertInfo : (info) => set(() => ({certInfo : info} ))
}))