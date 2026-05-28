import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Төслийн үндсэн хавтсанд байгаа файлуудыг зөв замаар дуудах (../../ ашиглана)
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { styles } from '../../my-payment-app/styles';
import { translations } from '../../my-payment-app/translations';

// Компонентуудыг импортлох
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
import TransferModal from '../../my-payment-app/TransferModal';
import UnitActionModal from '../../my-payment-app/UnitActionModal';
// Шинээр нэмсэн hook
import { useAuth } from '../../my-payment-app/useAuth';
import { useTransfer } from '../../my-payment-app/useTransfer';
import { AppPackage, useUserProfile } from '../../my-payment-app/useUserProfile';

export default function Index() {
  // --- GLOBAL BACKGROUND ANIMATION ---
  const blob1Anim = useRef(new Animated.Value(0)).current;
  const blob2Anim = useRef(new Animated.Value(0)).current;
  const blob3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (val: Animated.Value, duration: number, delay = 0) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: 1, duration, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration, useNativeDriver: true }),
        ])
      ).start();
    };
    animate(blob1Anim, 18000, 0);
    animate(blob2Anim, 25000, 1500);
    animate(blob3Anim, 22000, 3000);
  }, []);

  const blob1Style = {
    transform: [
      { translateX: blob1Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 80] }) },
      { translateY: blob1Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 40] }) },
    ],
  };
  const blob2Style = {
    transform: [
      { translateX: blob2Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -100] }) },
      { translateY: blob2Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -70] }) },
    ],
  };
  const blob3Style = {
    transform: [
      { scale: blob3Anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }) },
      { translateX: blob3Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 60] }) },
      { translateY: blob3Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -50] }) },
    ],
  };

  // --- LANGUAGE LOGIC ---
  const [appLanguage, setAppLanguage] = useState('MN');
  const T = (translations as any)[appLanguage] || (translations as any)['MN'];

  // Апп ачааллахад хадгалсан хэлийг унших
  useEffect(() => {
    const loadLanguage = async () => {
      const savedLang = await getItemAsync('app_language');
      if (savedLang) {
        setAppLanguage(savedLang);
      }
    };
    loadLanguage();
  }, []);

  // Хэл солих функцийг persistence-тэй болгох
  const changeLanguage = async (lang: string) => {
    setAppLanguage(lang);
    await setItemAsync('app_language', lang);
  };

  // --- AUTHENTICATION LOGIC (useAuth hook-оос авна) ---
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    authMode, 
    authPhone, 
    authName, 
    authPass, 
    setAuthMode, 
    setAuthPhone, 
    setAuthName, 
    setAuthPass, 
    handleAuth, 
    handleLogout, 
    handleBiometricLogin,
    canUseBiometric,
    clearBiometricCredentials,
    isProcessing, 
    authError 
  } = useAuth(T);

  // --- USER PROFILE LOGIC (useUserProfile hook-оос авна) ---
  const {
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
    fetchUserProfile,
  } = useUserProfile(user);

  // --- TRANSFER LOGIC (useTransfer hook-оос авна) ---
  const { isTransferring, transferError, handleTransfer, setTransferError } = useTransfer(user, mainBalance, setMainBalance);

  const [currentTab, setCurrentTab] = useState('home');

  useEffect(() => {
    // Хэрэглэгч солигдох эсвэл системээс гарах үед мэдэгдлийн жагсаалтыг цэвэрлэх
    setNotificationList([]);

    if (isAuthenticated) {
      setCurrentTab('home');
    }
  }, [user?.id, isAuthenticated]);

  const [showAIChat, setShowAIChat] = useState(false);
  
  type ActionType = 'data' | 'unit' | 'topup' | 'transfer' | 'more' | null;
  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [showAllServices, setShowAllServices] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notificationList, setNotificationList] = useState<any[]>([]);

  const [customAlert, setCustomAlert] = useState<{
    visible: boolean;
    message: string;
    buttons?: { text: string; style?: 'cancel' | 'default'; onPress: () => void }[];
    onClose?: () => void;
  }>({ visible: false, message: '' });
  
  const [inputDialog, setInputDialog] = useState({
    visible: false,
    title: '',
    placeholder: '',
    secureTextEntry: false,
    inputValue: '',
    onConfirm: (text: string) => {},
  });

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
  const [showProfileActionsModal, setShowProfileActionsModal] = useState(false);
  const [autoPayEnabled, setAutoPayEnabled] = useState(true);

  // App.js-ээс нэмэгдсэн хайлтын логик
  const handleSearchAction = (actionFn: () => void, query: string) => {
    actionFn(); // Тухайн үйлдлийг гүйцэтгэнэ
    if (query && query.trim() !== '') {
      // Хайсан үгийг recentSearches-т нэмэх, давхардлыг арилгах
      setRecentSearches(prev => {
        const newSearches = [query, ...prev.filter(item => item !== query)];
        return newSearches.slice(0, 5); // Эхний 5-ийг л хадгална
      });
    }
    setSearchQuery(''); // Хайлтын текстийг цэвэрлэх
  };

  const searchableItems = [
    { id: 'data', title: 'Дата багц авах', keywords: 'data data bagts datha', icon: 'wifi', color: '#10B981', action: () => handleSearchAction(() => setActiveAction('data'), searchQuery) },
    { id: 'unit', title: 'Нэгж цэнэглэх', keywords: 'unit negj tsenegleh unit', icon: 'zap', color: '#F59E0B', action: () => handleSearchAction(() => setActiveAction('unit'), searchQuery) },
    { id: 'billing', title: 'Төлбөр төлөх', keywords: 'billing tulbur card tulult', icon: 'credit-card', color: '#3B82F6', action: () => handleSearchAction(() => setCurrentTab('billing'), searchQuery) },
    { id: 'topup', title: 'Данс цэнэглэх', keywords: 'topup dans tsenegleh bank', icon: 'plus-circle', color: '#8B5CF6', action: () => handleSearchAction(() => setActiveAction('topup'), searchQuery) },
    { id: 'transfer', title: 'Шилжүүлэг', keywords: 'transfer shiljuuleg send', icon: 'send', color: '#EC4899', action: () => handleSearchAction(() => setActiveAction('transfer'), searchQuery) },
    { id: 'more', title: 'Бусад үйлчилгээ', keywords: 'busad more uramshuulal hitone news', icon: 'grid', color: '#8B5CF6', action: () => handleSearchAction(() => setShowAllServices(true), searchQuery) },
  ];

  const banks = [
    { id: 'khan', name: 'Хаан банк', color: '#10B981' },
    { id: 'golomt', name: 'Голомт банк', color: '#3B82F6' },
    { id: 'tdb', name: 'ХХБ', color: '#F59E0B' },
    { id: 'xac', name: 'Хас банк', color: '#EC4899' },
  ];

  const [toast, setToast] = useState({ visible: false, title: '', desc: '', icon: '' as any, color: '', family: 'feather' as 'feather' | 'material' });

  const addNotification = (title: string, desc: string, icon: any = 'info', color: string = '#3B82F6', family: 'feather' | 'material' = 'feather') => {
    const newNote = {
      id: Date.now(),
      title,
      desc,
      time: 'Дөнгөж сая',
      icon,
      color,
      family
    };
    setNotificationList(prev => [newNote, ...prev]);
    setToast({ visible: true, title, desc, icon, color, family });
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
    const lowerInput = chatInput.toLowerCase();
    setTimeout(() => {
      let response = "Би таны хүсэлтийг хүлээн авлаа. Танд өөрөөр туслах зүйл байна уу?";
      
      if (lowerInput.includes('данс') || lowerInput.includes('үлдэгдэл')) {
        response = `Таны одоогийн дансны үлдэгдэл ₮${mainBalance.toLocaleString()} байна. Цэнэглэхийг хүсвэл 'Цэнэглэх' товчийг ашиглана уу.`;
      } else if (lowerInput.includes('дата')) {
        response = `Танд одоогоор ${mainData.toFixed(1)}GB дата байна. Нэмэлт дата авахыг хүсвэл Дата багц цэс рүү ороорой.`;
      } else if (lowerInput.includes('төлбөр')) {
        response = isBillPaid 
          ? "Таны энэ сарын төлбөр төлөгдсөн байна. Баярлалаа!" 
          : `Таны төлөх төлбөр ₮${(activePackage?.price || 24500).toLocaleString()} байна. Төлбөр цэс рүү орж төлнө үү.`;
      }

      const botMsg = { id: Date.now() + 1, text: response, sender: 'ai' };
      setChatMessages(prev => [...prev, botMsg]);
    }, 800);
  };

  const handlePaymentConfirm = async (method: 'card' | 'unit') => {
    if (!selectedDataPkg || !user) {
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

    console.log("Updating profile for:", user.id, "New Bal:", newBalance);

    const { data, error } = await supabase
      .from('profiles')
      .update({ balance: newBalance, unit_balance: newUnitBalance, data_gb: mainData + selectedDataPkg.gb })
      .eq('id', user!.id);

    if (!error) {
      console.log("DB Update Success");
      setMainBalance(newBalance);
      setUnitBalance(newUnitBalance);
      setMainData(mainData + selectedDataPkg.gb);
      setShowPayment(false);
      setActiveAction(null);
      addNotification('Дата багц авлаа', `${selectedDataPkg.gb}GB дата багц амжилттай идэвхжлээ.`, 'wifi', '#10B981');
      setCustomAlert({ visible: true, message: 'Амжилттай!' });
    } else {
      setCustomAlert({ visible: true, message: 'Гүйлгээний алдаа: ' + error.message });
    }
  };

  const handleBalanceTopUp = async (shouldSave = false) => {
    if (!user || !topUpAmount) return;
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
      .eq('id', user!.id);

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
    if (!user || mainBalance < amount) {
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
      .eq('id', user!.id);

    if (!error) {
      setMainBalance(mainBalance - amount);
      setIsBillPaid(true);
      setLastPaymentDate(paymentDate);
      addNotification('Төлбөр төлөгдлөө', `₮${amount.toLocaleString()} амжилттай төлөгдлөө.`, 'credit-card', '#3B82F6');
      setCustomAlert({ visible: true, message: 'Төлбөр төлөгдлөө.' });
    } else {
      setCustomAlert({ visible: true, message: 'Төлбөр төлөхөд алдаа гарлаа: ' + error.message });
    }
  };

  const handleUnitCardPurchase = async (price: number, cardName: string, optionName: string, unitsToAdd: number, dataToAdd: number) => {
    if (!user) {
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
      .eq('id', user!.id);

    if (error) {
      setCustomAlert({ visible: true, message: 'Гүйлгээ амжилтгүй боллоо: ' + error.message });
      return;
    }

    setMainBalance(newBalance);
    setUnitBalance(newUnitBalance);
    setMainData(newData);
    setActiveAction(null);
    addNotification('Нэгж/Дата авлаа', `Та ${cardName}-н [${optionName}]-ийг авлаа.`, 'zap', '#F59E0B');
    setCustomAlert({
      visible: true,
      message: `Амжилттай! Та ${cardName}-н [${optionName}]-ийг авлаа.`
    });
  };

  // --- НЭР СОЛИХ ФУНКЦ ---
  const handleUpdateName = async (newName: string) => {
    if (!user || !newName || newName.trim() === '') return;
    setInputDialog({ ...inputDialog, visible: false });

    // Auth user update
    const { data: { user: updatedUser }, error: userError } = await supabase.auth.updateUser({ data: { full_name: newName } });
    // Profile table update
    const { error: profileError } = await supabase.from('profiles').update({ full_name: newName }).eq('id', user!.id);

    if (userError || profileError) {
      setCustomAlert({ visible: true, message: 'Нэр солих үед алдаа гарлаа.' });
    } else {
      setUserName(newName);
      addNotification('Амжилттай', 'Таны нэр амжилттай солигдлоо.', 'check-circle', '#10B981');
    }
  };

  // --- НУУЦ ҮГ СОЛИХ ФУНКЦ ---
  const handleUpdatePassword = async (newPassword: string) => {
    if (!newPassword || newPassword.length < 6) {
      setInputDialog({ ...inputDialog, visible: false });
      setCustomAlert({ visible: true, message: 'Нууц үг 6-аас доошгүй тэмдэгттэй байх ёстой.' });
      return;
    }
    setInputDialog({ ...inputDialog, visible: false });

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setCustomAlert({ visible: true, message: 'Нууц үг солих үед алдаа гарлаа.' });
    } else {
      addNotification('Амжилттай', 'Нууц үг амжилттай солигдлоо.', 'check-circle', '#10B981');
    }
  };

  // --- ШИЛЖҮҮЛГИЙГ МЭДЭГДЭЛТЭЙ ХОЛБОХ ---
  const handleTransferWithNotification = async (data: any) => {
    const success = await handleTransfer(data);
    if (success) {
      const typeLabel = data.type === 'money' ? '₮' : ' нэгж';
      const valueDisplay = `${data.value.toLocaleString()}${typeLabel}`;
      
      addNotification(
        'Шилжүүлэг амжилттай', 
        `${data.target} руу ${valueDisplay} шилжүүллээ.`, 
        'send', 
        '#EC4899'
      );
    }
    return success;
  };

  // --- БАГЦ СОЛИХ ФУНКЦ ---
  const handlePackageChange = async (selectedPkg: AppPackage) => {
    if (!user || !isBillPaid) return;

    setCustomAlert({
      visible: true,
      message: `Та дараа сараас идэвхжих багцаа "${selectedPkg.name}" болгохдоо итгэлтэй байна уу?`,
      buttons: [
        {
          text: "Цуцлах",
          style: "cancel",
          onPress: () => setCustomAlert({ visible: false, message: '' })
        },
        {
          text: "Тийм",
          onPress: async () => {
            const { error } = await supabase.from('profiles').update({ next_package: selectedPkg.id }).eq('id', user!.id);
            if (error) {
              setCustomAlert({ visible: true, message: 'Багц солих үед алдаа гарлаа.', buttons: [] });
            } else {
              setNextPackage(selectedPkg);
              setCustomAlert({ visible: true, message: `Амжилттай! Таны багц дараа сараас ${selectedPkg.name} болон солигдоно.`, buttons: [] });
            }
          }
        }
      ]
    });
  };

  // --- ҮЙЛЧИЛГЭЭНИЙ ТӨРӨЛ СОЛИХ ---
  const handleServiceTypeChange = async (newType: 'prepaid' | 'postpaid') => {
    if (!user || serviceType === newType) return; // Хэрэв ижил төрөл дээр дарвал юу ч хийхгүй

    const newTypeName = newType === 'prepaid' ? 'Урьдчилсан' : 'Дараа';
    setCustomAlert({
      visible: true,
      message: `Та үйлчилгээний төрлөө "${newTypeName} төлбөрт" болгон солихдоо итгэлтэй байна уу?`,
      buttons: [
        { text: "Цуцлах", style: "cancel", onPress: () => setCustomAlert({ visible: false, message: '' }) },
        {
          text: "Тийм",
          onPress: async () => {
            setCustomAlert({ visible: false, message: '' }); // Alert-г хаах
            const { error } = await supabase
              .from('profiles')
              .update({ service_type: newType })
              .eq('id', user.id);

            if (error) {
              console.error('Error updating service type:', error);
              setCustomAlert({ visible: true, message: 'Үйлчилгээний төрөл солиход алдаа гарлаа: ' + error.message });
            } else {
              setServiceType(newType); // Амжилттай бол UI-г шинэчлэх
              addNotification(
                'Амжилттай', 
                `Үйлчилгээний төрөл ${newTypeName} төлбөрт болж шинэчлэгдлээ.`, 
                'check-circle', 
                '#10B981'
              );
            }
          }
        }
      ]
    });
  };

  // --- PULL TO REFRESH LOGIC ---
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    await fetchUserProfile(user.id);
    addNotification('Шинэчлэгдлээ', 'Мэдээлэл амжилттай шинэчлэгдлээ.', 'refresh-cw', '#3B82F6');
    setRefreshing(false);
  }, [user, fetchUserProfile]);

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>X</Text>
        </View>
        <Text style={styles.appName}>XPAY</Text>
        <Text style={{ color: '#6B7280', fontSize: 13, marginTop: 12, letterSpacing: 3, fontWeight: '500' }}>ДИЖИТАЛ ХЭМНЭЛ</Text>
        <ActivityIndicator size="small" color="#7C3AED" style={{ marginTop: 40 }} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Global Background Blobs */}
      <Animated.View style={[styles.bgBlob1, blob1Style]} />
      <Animated.View style={[styles.bgBlob2, blob2Style]} />
      <Animated.View style={[styles.bgBlob3, blob3Style]} />

      {toast.visible && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setToast({ ...toast, visible: false })}
          style={styles.toastContainer}
        >
          <View style={[styles.toastIconBg, { backgroundColor: toast.color + '20' }]}>
            {toast.family === 'material' ? (
              <MaterialCommunityIcons name={toast.icon} size={20} color={toast.color} />
            ) : (
              <Feather name={toast.icon} size={20} color={toast.color} />
            )}
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
            isProcessing={isProcessing} // This prop is incorrect, handleAuth is a function. Let's fix this.
            // The handleAuth function now needs a callback to show the prompt.
            // We will wrap the original handleAuth from the hook.
            onAuthRequest={async () => {
              const success = await handleAuth((onConfirm) => {
                setCustomAlert({
                  visible: true,
                  message: 'Дараагийн удаа хурууны хээ/царайгаар нэвтрэх үү?',
                  buttons: [
                    { text: 'Үгүй', style: 'cancel', onPress: () => {
                        clearBiometricCredentials();
                        setCustomAlert({ visible: false, message: '' });
                      } 
                    },
                    { text: 'Тийм', onPress: () => {
                        onConfirm();
                        setCustomAlert({ visible: false, message: '' });
                        addNotification('Биометрик хадгаллаа', 'Дараагийн нэвтрэлтээс ашиглах боломжтой.', 'fingerprint', '#7C3AED', 'material');
                      } 
                    }
                  ]
                })
              });
              if (success) {
                addNotification('Амжилттай', authMode === 'login' ? 'Системд амжилттай нэвтэрлээ.' : 'Бүртгэл амжилттай үүслээ.', 'check-circle', '#10B981');
              }
            }}
            authError={authError}
            canUseBiometric={canUseBiometric}
            handleBiometricLogin={async () => {
              const success = await handleBiometricLogin();
              if (success) {
                addNotification('Амжилттай', 'Биометрикээр амжилттай нэвтэрлээ.', 'fingerprint', '#7C3AED', 'material');
              }
            }}
          />
        ) : (
          <View style={{ flex: 1 }}>
            {currentTab === 'home' && (
              <HomeTab 
                T={T} userName={userName} userPhone={authPhone} mainBalance={mainBalance} mainData={mainData} unitBalance={unitBalance}
                setActiveAction={setActiveAction} setCurrentTab={setCurrentTab} refreshing={refreshing} onRefresh={onRefresh}
                setIsSearching={setIsSearching} setShowNotifications={setShowNotifications} setShowAllServices={setShowAllServices}
                setCustomAlert={setCustomAlert} handleSelectPackage={handleSelectPackage}
              />
            )}
            {currentTab === 'overview' && (
              <OverviewTab 
                T={T} 
                mainBalance={mainBalance}
                mainData={mainData}
                unitBalance={unitBalance}
                activePackage={activePackage}
                notificationList={notificationList}
                setActiveAction={setActiveAction} 
                refreshing={refreshing}
                onRefresh={onRefresh}
                setCurrentTab={setCurrentTab} 
                handleSelectPackage={handleSelectPackage} 
                setShowNotifications={setShowNotifications}
              />
            )}
            {currentTab === 'billing' && (
              <BillingTab 
                T={T} 
                isBillPaid={isBillPaid}
                lastPaymentDate={lastPaymentDate}
                setActiveAction={setActiveAction} 
                refreshing={refreshing}
                onRefresh={onRefresh}
                handlePayBill={handlePayBill} 
                autoPayEnabled={autoPayEnabled} 
                setAutoPayEnabled={setAutoPayEnabled} 
                setCustomAlert={setCustomAlert} 
                savedCards={savedCards}
                activePackage={activePackage}
                nextPackage={nextPackage}
                handlePackageChange={handlePackageChange}
                serviceType={serviceType}
                handleServiceTypeChange={handleServiceTypeChange}
              />
            )}
            {currentTab === 'settings' && (
              <SettingsTab 
                T={T} 
                userName={userName} 
                userPhone={authPhone} 
                addNotification={addNotification} 
                setCustomAlert={setCustomAlert}
                biometricsEnabled={canUseBiometric} // Use state from useAuth hook
                setBiometricsEnabled={(enabled: boolean) => {
                  if (!enabled) {
                    // If user turns it off, call logout to clear credentials
                    handleLogout();
                  }
                }}
                appLanguage={appLanguage} setAppLanguage={changeLanguage} 
                setActiveAction={setActiveAction} 
                setShowAIChat={setShowAIChat} 
                handleLogout={handleLogout}
                setShowProfileActionsModal={setShowProfileActionsModal} />
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
                  <MaterialCommunityIcons name="robot" size={26} color="#FFF" />
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
          buttons={customAlert.buttons || []}
        />
        <AiChatModal visible={showAIChat} onClose={() => setShowAIChat(false)} chatMessages={chatMessages} chatInput={chatInput} setChatInput={setChatInput} onSendMessage={handleSendMessage} />

        {/* Input Dialog - Нэр, нууц үг солих */}
        <Modal
          visible={inputDialog.visible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setInputDialog({ ...inputDialog, visible: false })}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <View style={{ width: '85%', backgroundColor: '#1C1C24', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#2D2D3A' }}>
              <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>{inputDialog.title}</Text>
              <TextInput
                style={{ backgroundColor: '#15151D', borderRadius: 12, padding: 14, color: '#FFF', fontSize: 16, borderWidth: 1, borderColor: '#374151', marginBottom: 20 }}
                placeholder={inputDialog.placeholder}
                placeholderTextColor="#6B7280"
                secureTextEntry={inputDialog.secureTextEntry}
                value={inputDialog.inputValue}
                onChangeText={(text) => setInputDialog(prev => ({ ...prev, inputValue: text }))}
                autoFocus
              />
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity onPress={() => setInputDialog({ ...inputDialog, visible: false, inputValue: '' })} style={{ flex: 1, backgroundColor: '#374151', padding: 14, borderRadius: 12, alignItems: 'center' }}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Цуцлах</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  inputDialog.onConfirm(inputDialog.inputValue);
                  setInputDialog({ ...inputDialog, visible: false, inputValue: '' });
                }} style={{ flex: 1, backgroundColor: '#7C3AED', padding: 14, borderRadius: 12, alignItems: 'center' }}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Хадгалах</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Profile Actions Modal */}
        <Modal
          visible={showProfileActionsModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowProfileActionsModal(false)}
        >
          <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }} activeOpacity={1} onPressOut={() => setShowProfileActionsModal(false)}>
            <View style={{ width: '85%', backgroundColor: '#1C1C24', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#2D2D3A' }}>
              <TouchableOpacity onPress={() => { setShowProfileActionsModal(false); setInputDialog({ visible: true, title: 'Нэр солих', placeholder: 'Шинэ нэрээ оруулна уу', onConfirm: handleUpdateName, inputValue: '', secureTextEntry: false }); }} style={{ flexDirection: 'row', alignItems: 'center', padding: 14 }}>
                <Feather name="user" size={20} color="#A5B4FC" style={{ marginRight: 16 }} />
                <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '500' }}>Нэр солих</Text>
              </TouchableOpacity>
              <View style={{ height: 1, backgroundColor: '#2D2D3A', marginHorizontal: 14 }} />
              <TouchableOpacity onPress={() => { setShowProfileActionsModal(false); setInputDialog({ visible: true, title: 'Нууц үг солих', placeholder: 'Шинэ нууц үгээ оруулна уу', secureTextEntry: true, onConfirm: handleUpdatePassword, inputValue: '' }); }} style={{ flexDirection: 'row', alignItems: 'center', padding: 14 }}>
                <Feather name="key" size={20} color="#F9A8D4" style={{ marginRight: 16 }} />
                <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '500' }}>Нууц үг солих</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

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
        <TransferModal 
          visible={activeAction === 'transfer'} 
          onClose={() => { setActiveAction(null); setTransferError(null); }} 
          T={T} 
          handleTransfer={handleTransferWithNotification} 
          isProcessing={isTransferring}
          error={transferError}
        />
        <AllServicesModal visible={showAllServices} onClose={() => setShowAllServices(false)} setActiveAction={setActiveAction} setCurrentTab={setCurrentTab} setCustomAlert={setCustomAlert} />
        <SearchModal visible={isSearching} onClose={() => setIsSearching(false)} searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchableItems={searchableItems} recentSearches={recentSearches} setRecentSearches={setRecentSearches} />

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
                    <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: (note as any).color + '15', justifyContent: 'center', alignItems: 'center' }}>
                      {(note as any).family === 'material' ? (
                        <MaterialCommunityIcons name={(note as any).icon} size={22} color={(note as any).color} />
                      ) : (
                        <Feather name={(note as any).icon || 'arrow-up-right'} size={22} color={(note as any).color} />
                      )}
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