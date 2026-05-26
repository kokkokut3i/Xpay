import { User } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';

// Багцын төрлийг тодорхойлох
export interface AppPackage {
  id: string;
  name: string;
  price: number;
  desc: string;
}

// Багцын тогтмол мэдээлэл
export const availablePackages: AppPackage[] = [
    { id: 'standard', name: 'Стандарт багц', price: 25000, desc: 'Үндсэн хэрэглээнд' },
    { id: 'unlimited', name: 'Хязгааргүй дата', price: 35000, desc: 'Дата хэрэглээ өндөр хүмүүст' },
    { id: 'premium', name: 'Премиум багц', price: 55000, desc: 'Бүх үйлчилгээг багтаасан' },
];

export const useUserProfile = (user: User | null) => {
  // Profile states
  const [userName, setUserName] = useState('');
  const [mainBalance, setMainBalance] = useState(0);
  const [isBillPaid, setIsBillPaid] = useState(false);
  const [lastPaymentDate, setLastPaymentDate] = useState<string | null>(null);
  const [mainData, setMainData] = useState(0);
  const [unitBalance, setUnitBalance] = useState(0);
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [serviceType, setServiceType] = useState('postpaid');
  const [activePackage, setActivePackage] = useState<AppPackage>(availablePackages[0]);
  const [nextPackage, setNextPackage] = useState<AppPackage | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const fetchUserProfile = useCallback(async (uid: string) => {
    setLoadingProfile(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, balance, data_gb, unit_balance, is_bill_paid, last_payment_date, saved_cards, active_package, next_package, service_type')
        .eq('id', uid)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setUserName(data.full_name || '');
        setMainBalance(Number(data.balance) || 0);
        setMainData(Number(data.data_gb) || 0);
        setUnitBalance(Number(data.unit_balance) || 0);
        setSavedCards(data.saved_cards || []);
        setServiceType(data.service_type || 'postpaid');
        
        const currentPkg = availablePackages.find(p => p.id === data.active_package) || availablePackages[0];
        const upcomingPkg = availablePackages.find(p => p.id === data.next_package);
        setActivePackage(currentPkg);
        setNextPackage(upcomingPkg || null);

        // Төлбөрийн төлөвийг сар шалгаж шинэчлэх (энэ логик нь хэвээр үлдэнэ)
        const lastPaid = data.last_payment_date ? new Date(data.last_payment_date) : null;
        const now = new Date();
        if (lastPaid && lastPaid.getMonth() === now.getMonth() && lastPaid.getFullYear() === now.getFullYear()) {
          setIsBillPaid(true);
          setLastPaymentDate(data.last_payment_date);
        } else {
          setIsBillPaid(false);
          setLastPaymentDate(null);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  // Хэрэглэгч өөрчлөгдөхөд профайлыг татах
  useEffect(() => {
    if (user) {
      fetchUserProfile(user.id);
    }
  }, [user, fetchUserProfile]);

  // Real-time update
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`profile-changes-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
        (payload: any) => {
          if (payload.new) {
            fetchUserProfile(user.id); // Өөрчлөлт орсон үед бүх датаг дахин татах нь илүү найдвартай
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchUserProfile]);

  return {
    userName, setUserName,
    mainBalance, setMainBalance,
    isBillPaid, setIsBillPaid,
    lastPaymentDate, setLastPaymentDate,
    mainData, setMainData,
    unitBalance, setUnitBalance,
    savedCards, setSavedCards,
    serviceType, setServiceType,
    activePackage, setActivePackage,
    nextPackage, setNextPackage,
    loadingProfile,
    fetchUserProfile,
  };
};