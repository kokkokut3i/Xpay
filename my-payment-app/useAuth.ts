import { Session, User } from '@supabase/supabase-js';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export type AuthMode = 'login' | 'register';

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Нэвтрэх/Бүртгүүлэх формтой холбоотой state-үүд
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authPhone, setAuthPhone] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [canUseBiometric, setCanUseBiometric] = useState(false);

  useEffect(() => {
    // Анх апп ачааллахад сесс байгаа эсэхийг шалгах
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      // Хадгалагдсан биометрик мэдээлэл байгаа эсэхийг шалгах
      const savedPhone = await SecureStore.getItemAsync('user_phone');
      const savedPass = await SecureStore.getItemAsync('user_pass');
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      setCanUseBiometric(!!(savedPhone && savedPass && hasHardware));

      // Хамгийн сүүлд нэвтэрсэн дугаарыг ачааллах
      const lastLoginPhone = await SecureStore.getItemAsync('last_login_phone');
      if (lastLoginPhone) {
        setAuthPhone(lastLoginPhone);
      }
    };

    fetchSession();

    // Нэвтрэлтийн төлөв өөрчлөгдөх бүрд (login, logout) автоматаар state-г шинэчлэх
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleBiometricLogin = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) return;

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        setAuthError('Биометрик мэдээлэл бүртгэгдээгүй байна.');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Нэвтрэх',
        fallbackLabel: 'Нууц үг ашиглах',
      });

      if (result.success) {
        setIsProcessing(true);
        const phone = await SecureStore.getItemAsync('user_phone');
        const pass = await SecureStore.getItemAsync('user_pass');

        if (phone && pass) {
          const { error } = await supabase.auth.signInWithPassword({
            email: `${phone}@xpay.mn`,
            password: pass,
          });
          await SecureStore.setItemAsync('last_login_phone', phone); // Дугаарыг хадгалах
          if (error) throw error;
        } else {
          setAuthError('Хадгалагдсан мэдээлэл олдсонгүй.');
        }
      }
    } catch (error: any) {
      console.error('Biometric Auth Error:', error);
      setAuthError('Биометрик нэвтрэлт амжилтгүй: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAuth = async (
    // Add a callback to ask the user if they want to save biometrics
    // This will be triggered from the UI component (index.tsx)
    promptToSaveBiometrics: (onConfirm: () => void) => void
  ) => {
    if (!authPhone || !authPass || (authMode === 'register' && !authName)) {
      setAuthError('Мэдээллээ бүрэн оруулна уу.');
      return;
    }
    if (authPass.length < 6) {
      setAuthError('Нууц үг 6-аас доошгүй тэмдэгттэй байх ёстой.');
      return;
    }
    if (authPhone.length !== 8) {
      setAuthError('Утасны дугаар 8 оронтой байх ёстой.');
      return;
    }

    setIsProcessing(true);
    setAuthError(null);

    const email = `${authPhone}@xpay.mn`;

    try {
      let response;
      if (authMode === 'login') {
        response = await supabase.auth.signInWithPassword({ email, password: authPass });
      } else {
        response = await supabase.auth.signUp({
          email,
          password: authPass,
          options: { data: { full_name: authName, phone: authPhone } }
        });
      }

      const { error, data } = response;
      if (error) throw error;

      // Ask to save biometric info instead of saving automatically
      if (data.user) {
        // Нэвтрэлт амжилттай болбол дугаарыг хадгалах
        await SecureStore.setItemAsync('last_login_phone', authPhone);

        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (hasHardware && isEnrolled) {
          // Call the prompt function passed from the UI
          promptToSaveBiometrics(async () => {
            await SecureStore.setItemAsync('user_phone', authPhone);
            await SecureStore.setItemAsync('user_pass', authPass);
            setCanUseBiometric(true); // Update state immediately
          });
        }
      }

    } catch (error: any) {
      if (error.message.includes('Invalid login credentials')) {
        // Supabase usually returns this for both wrong password and non-existent user for security reasons.
        setAuthError('Утасны дугаар эсвэл нууц үг буруу байна.');
      } else if (error.message.includes('User not found')) { // This is a hypothetical error, Supabase usually returns 'Invalid login credentials' for security. We add a check before login.
        setAuthError('Бүртгэлгүй хэрэглэгч байна.');
      } else if (error.message.includes('User already registered')) {
        setAuthError('Энэ дугаар бүртгэлтэй байна.');
      } else {
        setAuthError(error.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const clearBiometricCredentials = async () => {
    // Clear saved credentials
    await SecureStore.deleteItemAsync('user_phone');
    await SecureStore.deleteItemAsync('user_pass');
    setCanUseBiometric(false);
  };

  return {
    // Auth төлөв
    user,
    session,
    isAuthenticated: !!session,
    isLoading,
    isProcessing,
    authError,
    // Формын state-үүд
    authMode,
    authPhone,
    authName,
    authPass,
    // Формын функцүүд
    setAuthMode,
    setAuthPhone,
    setAuthName,
    setAuthPass,
    // Үндсэн функцүүд
    handleAuth,
    handleLogout,
    handleBiometricLogin,
    clearBiometricCredentials,
    canUseBiometric,
    setCanUseBiometric,
  };
};