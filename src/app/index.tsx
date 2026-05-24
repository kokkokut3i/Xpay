import { Feather } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Төслийн үндсэн хавтсанд байгаа файлуудыг зөв замаар дуудах (../../ ашиглана)
import { styles } from '../../my-payment-app/styles';
import { translations } from '../../my-payment-app/translations';

// Компонентуудыг импортлох
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import AiChatModal from '../../my-payment-app/AiChatModal';
import AllServicesModal from '../../my-payment-app/AllServicesModal';
import AuthScreen from '../../my-payment-app/AuthScreen';
import BillingTab from '../../my-payment-app/BillingTab';
import CustomAlert from '../../my-payment-app/CustomAlert';
import DataActionModal from '../../my-payment-app/DataActionModal';
import HomeTab from '../../my-payment-app/HomeTab';
import OverviewTab from '../../my-payment-app/OverviewTab';
import SearchModal from '../../my-payment-app/SearchModal';
import SettingsTab from '../../my-payment-app/SettingsTab';
import { supabase } from '../../my-payment-app/supabase';
import TopUpActionModal from '../../my-payment-app/TopUpActionModal';
import UnitActionModal from '../../my-payment-app/UnitActionModal';

export default function Index() {
  const [appLanguage, setAppLanguage] = useState('MN');
  const T = (translations as any)[appLanguage] || (translations as any)['MN'];

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [currentTab, setCurrentTab] = useState('home');
  const [showAIChat, setShowAIChat] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [showAllServices, setShowAllServices] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notificationList, setNotificationList] = useState([
    { id: 1, title: 'Амжилттай', desc: '5,000₮-н цэнэглэлт амжилттай боллоо.', time: '10 минутын өмнө', icon: 'check-circle' as const, color: '#10B981' },
    { id: 2, title: 'Урамшуулал', desc: 'Найзаа уриад 1GB дата аваарай.', time: '2 цагийн өмнө', icon: 'gift' as const, color: '#F59E0B' },
    { id: 3, title: 'Анхааруулга', desc: 'Таны дата 500MB үлдсэн байна.', time: '1 өдрийн өмнө', icon: 'alert-triangle' as const, color: '#EF4444' },
  ]);

  // State-үүд (App.js-ээс хуулж авчирна)
  const [mainBalance, setMainBalance] = useState(0);
  const [isBillPaid, setIsBillPaid] = useState(false);
  const [lastPaymentDate, setLastPaymentDate] = useState<string | null>(null);
  const [mainData, setMainData] = useState(0);
  const [unitBalance, setUnitBalance] = useState(0);
  const [customAlert, setCustomAlert] = useState({ visible: false, message: '' });
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const [savedCards, setSavedCards] = useState<any[]>([]);

  // Төрлийг нь тодорхойлж өгөх (TypeScript)
  const [chatMessages, setChatMessages] = useState<any[]>([
    { id: 1, text: 'Сайн байна уу! 🤖 Танд юугаар туслах вэ?', sender: 'ai' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedDataPkg, setSelectedDataPkg] = useState<{ gb: number; price: number } | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [autoPayEnabled, setAutoPayEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const banks = [
    { id: 'khan', name: 'Хаан банк', color: '#10B981' },
    { id: 'golomt', name: 'Голомт банк', color: '#3B82F6' },
    { id: 'tdb', name: 'ХХБ', color: '#F59E0B' },
    { id: 'xac', name: 'Хас банк', color: '#EC4899' },
  ];

  const [toast, setToast] = useState({ visible: false, title: '', desc: '', icon: '' as any, color: '' });

  const addNotification = (title: string, desc: string, icon: any = 'info', color: string = '#3B82F6') => {
    const newNote = {
      id: Date.now(),
      title,
      desc,
      time: 'Дөнгөж сая',
      icon,
      color
    };
    setNotificationList(prev => [newNote, ...prev]);
    setToast({ visible: true, title, desc, icon, color });
  };

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const handleSelectPackage = (gb: number, price: number) => {
    setSelectedDataPkg({ gb, price });
    setShowPayment(true);
  };

  const handleSendMessage = () => {
    if (chatInput.trim() === '') return;
    const userMsg = { id: Date.now(), text: chatInput, sender: 'user' };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    
    // Mock AI response
    setTimeout(() => {
      const botMsg = { id: Date.now() + 1, text: "Би таны хүсэлтийг хүлээн авлаа. Танд туслахдаа баяртай байна!", sender: 'ai' };
      setChatMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  // Биометрик идэвхжүүлэх хүсэлт гаргах
  const askToEnableBiometrics = async (phone: string, pass: string) => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (hasHardware && isEnrolled) {
      Alert.alert(
        'Biometric идэвхжүүлэх',
        'Та дараагийн удаа хурууны хээ эсвэл нүүр танигчаар нэвтрэх үү?',
        [
          { text: 'Үгүй', style: 'cancel' },
          { 
            text: 'Асаах', 
            onPress: async () => {
              await SecureStore.setItemAsync('user_phone', phone);
              await SecureStore.setItemAsync('user_pass', pass);
              
              if (userId) {
                await supabase.from('profiles').update({ biometrics_enabled: true }).eq('id', userId);
                setBiometricsEnabled(true);
              }
            } 
          }
        ]
      );
    }
  };

  // Биометрикээр нэвтрэх
  const handleBiometricLogin = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Хэрэглэгчийг баталгаажуулах',
      fallbackLabel: 'Нууц үг ашиглах',
    });

    if (result.success) {
      const savedPhone = await SecureStore.getItemAsync('user_phone');
      const savedPass = await SecureStore.getItemAsync('user_pass');

      if (savedPhone && savedPass) {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
          email: `${savedPhone}@xpay.mn`,
          password: savedPass,
        });

        if (!error && data.user) {
          fetchUserProfile(data.user.id);
        } else {
          setCustomAlert({ visible: true, message: 'Биометрик нэвтрэлт амжилтгүй. Нууц үгээрээ нэвтрэнэ үү.' });
        }
        setIsLoading(false);
      }
    }
  };

  const handlePaymentConfirm = async (method: 'card' | 'unit') => {
    if (!selectedDataPkg || !userId) {
       setCustomAlert({ visible: true, message: 'Алдаа: Хэрэглэгчийн мэдээлэл олдсонгүй.' });
       return;
    }
    let newBalance = mainBalance;
    let newUnitBalance = unitBalance;

    if (method === 'unit') {
      if (unitBalance < selectedDataPkg.price) {
        setCustomAlert({ visible: true, message: 'Нэгж хүрэлцэхгүй байна.' });
        return;
      }
      newUnitBalance -= selectedDataPkg.price;
    } else {
      if (mainBalance < selectedDataPkg.price) {
        setCustomAlert({ visible: true, message: 'Дансны үлдэгдэл хүрэлцэхгүй байна.' });
        return;
      }
      newBalance -= selectedDataPkg.price;
    }

    console.log("Updating profile for:", userId, "New Bal:", newBalance);

    const { data, error } = await supabase
      .from('profiles')
      .update({ balance: newBalance, unit_balance: newUnitBalance, data_gb: mainData + selectedDataPkg.gb })
      .eq('id', userId);

    if (!error) {
      console.log("DB Update Success");
      setMainBalance(newBalance);
      setUnitBalance(newUnitBalance);
      setMainData(mainData + selectedDataPkg.gb);
      setShowPayment(false);
      setActiveAction(null);
      setCustomAlert({ visible: true, message: 'Амжилттай!' });
    } else {
      setCustomAlert({ visible: true, message: 'Гүйлгээний алдаа: ' + error.message });
    }
  };

  const handleBalanceTopUp = async (shouldSave = false) => {
    if (!userId || !topUpAmount) return;
    const amount = parseInt(topUpAmount);
    const newTotal = mainBalance + amount;

    let updateData: any = { balance: newTotal };

    // Карт хадгалах логик
    if (shouldSave && cardNumber.length >= 12) {
      const newCard = { 
        id: Date.now(), 
        number: cardNumber.slice(-4), 
        bank: selectedBank ? (selectedBank as any).name : 'Bank', 
        color: selectedBank ? (selectedBank as any).color : '#374151' 
      };
      const updatedCards = [...savedCards, newCard];
      updateData.saved_cards = updatedCards;
      setSavedCards(updatedCards);
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (!error) {
      setMainBalance(newTotal);
      setTopUpAmount('');
      setActiveAction(null);
      addNotification('Амжилттай', `${amount.toLocaleString()}₮-өөр дансаа цэнэглэлээ.`, 'check-circle', '#10B981');
      setCustomAlert({ visible: true, message: 'Данс цэнэглэгдлээ.' });
    } else {
      setCustomAlert({ visible: true, message: 'Цэнэглэлт амжилтгүй: ' + error.message });
    }
  };

  const handlePayBill = async (amount: number) => {
    if (!userId || mainBalance < amount) {
      setCustomAlert({ visible: true, message: 'Үлдэгдэл хүрэлцэхгүй байна.' });
      return;
    }
    const paymentDate = new Date().toISOString();
    const { error } = await supabase
      .from('profiles')
      .update({ 
        balance: mainBalance - amount,
        is_bill_paid: true,
        last_payment_date: paymentDate
      })
      .eq('id', userId);

    if (!error) {
      setMainBalance(mainBalance - amount);
      setIsBillPaid(true);
      setLastPaymentDate(paymentDate);
      setCustomAlert({ visible: true, message: 'Төлбөр төлөгдлөө.' });
    } else {
      setCustomAlert({ visible: true, message: 'Төлбөр төлөхөд алдаа гарлаа: ' + error.message });
    }
  };

  const handleUnitCardPurchase = async (price: number, cardName: string, optionName: string, unitsToAdd: number, dataToAdd: number) => {
    if (!userId) {
      setCustomAlert({ visible: true, message: 'Та системд нэвтрэх шаардлагатай.' });
      return;
    }

    if (mainBalance < price) {
      setCustomAlert({
        visible: true,
        message: `Уучлаарай, таны ДАНСНЫ үлдэгдэл хүрэлцэхгүй байна. (${price.toLocaleString()}₮ шаардлагатай)`
      });
      return;
    }
    
    const newBalance = mainBalance - price;
    const newUnitBalance = unitBalance + unitsToAdd;
    const newData = mainData + dataToAdd;

    const { error } = await supabase
      .from('profiles')
      .update({
        balance: newBalance,
        unit_balance: newUnitBalance,
        data_gb: newData
      })
      .eq('id', userId);

    if (error) {
      setCustomAlert({ visible: true, message: 'Гүйлгээ амжилтгүй боллоо: ' + error.message });
      return;
    }

    setMainBalance(newBalance);
    setUnitBalance(newUnitBalance);
    setMainData(newData);
    setActiveAction(null);
    setCustomAlert({
      visible: true,
      message: `Амжилттай! Та ${cardName}-н [${optionName}]-ийг авлаа.`
    });
  };

  // Хэрэглэгчийн мэдээллийг Supabase-ээс татах функц
  const fetchUserProfile = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone, balance, data_gb, unit_balance, is_bill_paid, last_payment_date, saved_cards')
        .eq('id', uid)
        .maybeSingle();

      if (data) {
        setUserName(data.full_name || '');
        setAuthPhone(data.phone || '');
        setMainBalance(Number(data.balance));
        setMainData(Number(data.data_gb));
        setUnitBalance(Number(data.unit_balance));
        setIsBillPaid(data.is_bill_paid || false);
        setLastPaymentDate(data.last_payment_date || null);
        setSavedCards(data.saved_cards || []);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    // Апп ачаалагдах үед нэвтэрсэн хэрэглэгчийн session байгаа эсэхийг шалгах
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
          setUserId(session.user.id);
          fetchUserProfile(session.user.id);
        }
      } catch (err) {
        console.error("Auth session check error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Нэвтрэх төлөв өөрчлөгдөхийг сонсох
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setIsAuthenticated(!!session);
      setUserId(session?.user.id || null);
      if (session) {
        setUserName(session.user.user_metadata?.full_name || '');
        setAuthPhone(session.user.user_metadata?.phone || session.user.email?.split('@')[0] || '');
        fetchUserProfile(session.user.id);
      } else {
        setUserName('');
        setAuthPhone('');
        setMainBalance(0);
        setMainData(0);
        setUnitBalance(0);
        setIsBillPaid(false);
        setLastPaymentDate(null);
        setSavedCards([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Real-time Update: Өгөгдлийн сан өөрчлөгдөхөд апп-ыг шууд шинэчлэх
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`profile-changes-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload: any) => {
          if (payload.new) {
            setUserName(payload.new.full_name || '');
            setMainBalance(Number(payload.new.balance));
            setMainData(Number(payload.new.data_gb));
            setUnitBalance(Number(payload.new.unit_balance));
            setIsBillPaid(payload.new.is_bill_paid);
            setLastPaymentDate(payload.new.last_payment_date);
            setSavedCards(payload.new.saved_cards || []);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleAuth = async () => {
    if (!authPhone || !authPass || (authMode === 'register' && !authName)) {
      setCustomAlert({ visible: true, message: 'Мэдээллээ бүрэн оруулна уу.' });
      return;
    }

    if (authPass.length < 6) {
      setCustomAlert({ visible: true, message: 'Нууц үг хамгийн багадаа 6 оронтой байх ёстой.' });
      return;
    }

    if (authPhone.length !== 8 && !authPhone.includes('@')) {
      setCustomAlert({ visible: true, message: 'Утасны дугаар 8 оронтой байх ёстой.' });
      return;
    }

    console.log("Supabase Project URL:", (supabase as any).supabaseUrl);
    setIsLoading(true);
    try {
      const email = `${authPhone}@xpay.mn`;
      
      if (authMode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: authPass });
        if (error) {
          if (error.message.includes('Email signups are disabled')) {
            setCustomAlert({ visible: true, message: 'Системийн тохиргоо: Имэйл бүртгэл хаалттай байна. Dashboard -> Authentication -> Providers хэсгээс Email-ийг асаана уу.' });
          } else {
            console.error("Login Error:", error.message);
          }
          throw error;
        }
        
        if (data.user) {
          setIsAuthenticated(true);
          setUserId(data.user.id);
          setUserName(authName || data.user.user_metadata?.full_name || '');
          setCurrentTab('home');
          fetchUserProfile(data.user.id);
          addNotification('Тавтай морил', 'Амжилттай нэвтэрлээ.', 'user', '#10B981');

          // Хэрэв биометрик асаагаагүй бол асуух
          if (!biometricsEnabled) {
            askToEnableBiometrics(authPhone, authPass);
          }
        }
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password: authPass,
          options: { data: { full_name: authName, phone: authPhone } }
        });
        if (error) {
          console.error("Signup Error Details:", error);
          throw error;
        }
        
        if (data.user) {
          console.log("Supabase Auth Success. New User ID:", data.user.id);
          if (!data.session) {
            setCustomAlert({ visible: true, message: 'Бүртгэл үүслээ. Гэвч имэйл баталгаажуулах шаардлагатай. Supabase Dashboard-оос "Confirm Email"-ийг унтраана уу.' });
          } else {
            setIsAuthenticated(true);
            setUserId(data.user.id);
            setUserName(authName || data.user.user_metadata?.full_name || '');
            setCurrentTab('home');
            fetchUserProfile(data.user.id);
            addNotification('Амжилттай', 'Тавтай морил!', 'user', '#10B981');
            
            // Шинээр бүртгүүлсэн үед асуух
            askToEnableBiometrics(authPhone, authPass);
          }
        }
      }
    } catch (error: any) {
      console.error("General Auth Error:", error);
      setCustomAlert({ visible: true, message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F0F14', justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: 0 }]} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {toast.visible && (
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => setToast({ ...toast, visible: false })}
          style={styles.toastContainer}
        >
          <View style={[styles.toastIconBg, { backgroundColor: toast.color + '20' }]}>
            <Feather name={toast.icon} size={20} color={toast.color} />
          </View>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.toastTitle}>{toast.title}</Text>
            <Text style={styles.toastDesc} numberOfLines={1}>{toast.desc}</Text>
          </View>
        </TouchableOpacity>
      )}

      <View style={{ flex: 1 }}>
        {!isAuthenticated ? (
          <AuthScreen 
            T={T} authName={authName} setAuthName={setAuthName}
            authPhone={authPhone} setAuthPhone={setAuthPhone} 
            authPass={authPass} setAuthPass={setAuthPass} 
            authMode={authMode} setAuthMode={setAuthMode} 
            handleAuth={handleAuth} 
          />
        ) : (
          <View style={{ flex: 1, paddingTop: Platform.OS === 'android' ? 10 : 10 }}>
            {currentTab === 'home' && (
              <HomeTab 
                T={T} userName={userName} userPhone={authPhone} mainBalance={mainBalance} mainData={mainData} unitBalance={unitBalance}
                setActiveAction={setActiveAction} setCurrentTab={setCurrentTab}
                setIsSearching={setIsSearching} setShowNotifications={setShowNotifications}
                setCustomAlert={setCustomAlert} handleSelectPackage={handleSelectPackage}
              />
            )}
            {currentTab === 'overview' && (
              <OverviewTab 
                T={T} 
                mainBalance={mainBalance}
                mainData={mainData}
                unitBalance={unitBalance}
                notificationList={notificationList}
                setActiveAction={setActiveAction} 
                setCurrentTab={setCurrentTab} 
                handleSelectPackage={handleSelectPackage} 
              />
            )}
            {currentTab === 'billing' && (
              <BillingTab 
                T={T} 
                isBillPaid={isBillPaid}
                lastPaymentDate={lastPaymentDate}
                setActiveAction={setActiveAction} 
                handlePayBill={handlePayBill} 
                autoPayEnabled={autoPayEnabled} 
                setAutoPayEnabled={setAutoPayEnabled} 
                setCustomAlert={setCustomAlert} 
                savedCards={savedCards}
              />
            )}
            {currentTab === 'settings' && (
              <SettingsTab T={T} userName={userName} userPhone={authPhone} addNotification={addNotification} setCustomAlert={setCustomAlert} biometricsEnabled={false} setBiometricsEnabled={() => {}} appLanguage={appLanguage} setAppLanguage={setAppLanguage} setActiveAction={setActiveAction} setShowAIChat={setShowAIChat} handleLogout={async () => await supabase.auth.signOut()} />
            )}

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
              <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('home')}>
                <Feather name="home" size={24} color={currentTab === 'home' ? '#FFF' : '#6B7280'} />
                <Text style={[styles.navText, { color: currentTab === 'home' ? '#FFF' : '#6B7280' }]}>{T.nav.home}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('overview')}>
                <Feather name="bar-chart-2" size={24} color={currentTab === 'overview' ? '#FFF' : '#6B7280'} />
                <Text style={[styles.navText, { color: currentTab === 'overview' ? '#FFF' : '#6B7280' }]}>{T.nav.overview}</Text>
              </TouchableOpacity>
              <View style={styles.centerNavBtnWrapper}>
                <TouchableOpacity style={styles.centerNavBtn} onPress={() => setShowAIChat(true)}>
                  <Feather name="message-square" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('billing')}>
                <Feather name="credit-card" size={24} color={currentTab === 'billing' ? '#FFF' : '#6B7280'} />
                <Text style={[styles.navText, { color: currentTab === 'billing' ? '#FFF' : '#6B7280' }]}>{T.nav.billing}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('settings')}>
                <Feather name="settings" size={24} color={currentTab === 'settings' ? '#FFF' : '#6B7280'} />
                <Text style={[styles.navText, { color: currentTab === 'settings' ? '#FFF' : '#6B7280' }]}>{T.nav.settings}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Global Modals & Alerts - Always mounted */}
        <CustomAlert 
          visible={customAlert.visible} 
          message={customAlert.message} 
          onClose={() => setCustomAlert({ visible: false, message: '' })} 
        />
        <AiChatModal visible={showAIChat} onClose={() => setShowAIChat(false)} chatMessages={chatMessages} chatInput={chatInput} setChatInput={setChatInput} onSendMessage={handleSendMessage} />
        <DataActionModal visible={activeAction === 'data'} onClose={() => { setActiveAction(null); setShowPayment(false); }} showPayment={showPayment} selectedDataPkg={selectedDataPkg} unitBalance={unitBalance} handleSelectPackage={handleSelectPackage} handlePaymentConfirm={handlePaymentConfirm} />
        <UnitActionModal visible={activeAction === 'unit'} onClose={() => setActiveAction(null)} mainBalance={mainBalance} handleUnitCardPurchase={handleUnitCardPurchase} />
        <TopUpActionModal 
          visible={activeAction === 'topup'} onClose={() => setActiveAction(null)}
          topUpAmount={topUpAmount} setTopUpAmount={setTopUpAmount}
          selectedBank={selectedBank} setSelectedBank={setSelectedBank}
          cardNumber={cardNumber} setCardNumber={setCardNumber}
          banks={banks} handleBalanceTopUp={handleBalanceTopUp}
          savedCards={savedCards}

        />
        <AllServicesModal visible={showAllServices} onClose={() => setShowAllServices(false)} setActiveAction={setActiveAction} setCurrentTab={setCurrentTab} setCustomAlert={setCustomAlert} />
        <SearchModal visible={isSearching} onClose={() => setIsSearching(false)} searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchableItems={[]} recentSearches={recentSearches} setRecentSearches={setRecentSearches} />

        {/* Notifications Modal */}
        <Modal visible={showNotifications} animationType="slide" transparent={true} onRequestClose={() => setShowNotifications(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: '#15151D', borderTopLeftRadius: 32, borderTopRightRadius: 32, height: '70%', padding: 24 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>Мэдэгдэл</Text>
                <TouchableOpacity onPress={() => setShowNotifications(false)} style={{ backgroundColor: '#2D2D3A', padding: 8, borderRadius: 20 }}>
                  <Feather name="x" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {notificationList.map(note => (
                  <View key={note.id} style={{ flexDirection: 'row', padding: 16, backgroundColor: '#1C1C24', borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#2D2D3A' }}>
                    <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: note.color + '15', justifyContent: 'center', alignItems: 'center' }}>
                      <Feather name={note.icon} size={22} color={note.color} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 16 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 15 }}>{note.title}</Text>
                        <Text style={{ color: '#6B7280', fontSize: 11 }}>{note.time}</Text>
                      </View>
                      <Text style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4, lineHeight: 18 }}>{note.desc}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}