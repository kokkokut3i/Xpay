import { Feather } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
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
  // --- AUTHENTICATION LOGIC (useAuth hook-оос авна) ---
  const { user, isAuthenticated, isLoading, authMode, authPhone, authName, authPass, setAuthMode, setAuthPhone, setAuthName, setAuthPass, handleAuth, handleLogout, isProcessing, authError } = useAuth();

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
  const { isTransferring, transferError, handleTransfer, setTransferError } = useTransfer(user);

  const [appLanguage, setAppLanguage] = useState('MN');
  const T = (translations as any)[appLanguage] || (translations as any)['MN'];

  const [currentTab, setCurrentTab] = useState('home');
  const [showAIChat, setShowAIChat] = useState(false);
  
  type ActionType = 'data' | 'unit' | 'topup' | 'transfer' | 'more' | null;
  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [showAllServices, setShowAllServices] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notificationList, setNotificationList] = useState([
    { id: 1, title: 'Амжилттай', desc: '5,000₮-н цэнэглэлт амжилттай боллоо.', time: '10 минутын өмнө', icon: 'check-circle' as const, color: '#10B981' },
    { id: 2, title: 'Урамшуулал', desc: 'Найзаа уриад 1GB дата аваарай.', time: '2 цагийн өмнө', icon: 'gift' as const, color: '#F59E0B' },
    { id: 3, title: 'Анхааруулга', desc: 'Таны дата 500MB үлдсэн байна.', time: '1 өдрийн өмнө', icon: 'alert-triangle' as const, color: '#EF4444' },
  ]);

  const [customAlert, setCustomAlert] = useState<{
    visible: boolean;
    message: string;
    buttons?: { text: string; style?: 'cancel' | 'default'; onPress: () => void }[];
  }>({ visible: false, message: '' });
  
  const [inputDialog, setInputDialog] = useState({
    visible: false,
    title: '',
    placeholder: '',
    secureTextEntry: false,
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
  const [autoPayEnabled, setAutoPayEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

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
    { id: 'insurance', title: 'Утасны даатгал', keywords: 'daatgal insurance utas', icon: 'shield', color: '#8B5CF6', action: () => handleSearchAction(() => setCustomAlert({ visible: true, message: "Гар утасны даатгал үйлчилгээ удахгүй нээгдэнэ." }), searchQuery) },
    { id: 'entertainment', title: 'Entertainment', keywords: 'entertainment kino content uramshuulal', icon: 'play', color: '#F43F5E', action: () => handleSearchAction(() => setCustomAlert({ visible: true, message: "Контент үзэх эрхийг удахгүй авдаг болно." }), searchQuery) },
  ];

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
    if (!user || serviceType === newType) return;

    setServiceType(newType); // Optimistic update
    const { error } = await supabase
        .from('profiles')
        .update({ service_type: newType })
        .eq('id', user!.id);

    if (error) {
        setCustomAlert({ visible: true, message: 'Үйлчилгээний төрөл солиход алдаа гарлаа.' });
        setServiceType(serviceType as 'prepaid' | 'postpaid'); // Revert on error
    }
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
      <View style={{ flex: 1, backgroundColor: '#0F0F14', justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
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
            isProcessing={isProcessing}
            authError={authError}
          />
        ) : (
          <View style={{ flex: 1 }}>
            {currentTab === 'home' && (
              <HomeTab 
                T={T} userName={userName} userPhone={authPhone} mainBalance={mainBalance} mainData={mainData} unitBalance={unitBalance}
                setActiveAction={setActiveAction} setCurrentTab={setCurrentTab} refreshing={refreshing} onRefresh={onRefresh}
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
                refreshing={refreshing}
                onRefresh={onRefresh}
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
                biometricsEnabled={biometricsEnabled} setBiometricsEnabled={setBiometricsEnabled} 
                appLanguage={appLanguage} setAppLanguage={setAppLanguage} 
                setActiveAction={setActiveAction} 
                setShowAIChat={setShowAIChat} 
                handleLogout={handleLogout} 
                openInputDialog={setInputDialog} handleUpdateName={handleUpdateName} handleUpdatePassword={handleUpdatePassword} />
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
          buttons={customAlert.buttons || []}
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
        <TransferModal 
          visible={activeAction === 'transfer'} 
          onClose={() => { setActiveAction(null); setTransferError(null); }} 
          T={T} 
          handleTransfer={handleTransfer} 
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