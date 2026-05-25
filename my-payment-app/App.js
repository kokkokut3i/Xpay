import { Feather } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { translations } from './translations';

// Компонентуудыг зөв замаар import хийх
import AiChatModal from './AiChatModal';
import AllServicesModal from './AllServicesModal';
import AuthScreen from './AuthScreen';
import BillingTab from './BillingTab';
import CustomAlert from './CustomAlert';
import DataActionModal from './DataActionModal';
import HomeTab from './HomeTab';
import InputDialog from './InputDialog';
import MoreActionModal from './MoreActionModal';
import OverviewTab from './OverviewTab';
import SearchModal from './SearchModal';
import SettingsTab from './SettingsTab';
import TopUpActionModal from './TopUpActionModal';
import TransferModal from './TransferModal';
import UnitActionModal from './UnitActionModal';
import { supabase } from './supabase';

const { width } = Dimensions.get('window');

export default function App() {
  const [appLanguage, setAppLanguage] = useState('MN'); // MN эсвэл EN
  const T = translations[appLanguage] || translations['MN']; // Одоогийн хэл олдохгүй бол МН-ийг ашиглах

  const [showAIChat, setShowAIChat] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [showAllServices, setShowAllServices] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('home');
  const [userName, setUserName] = useState('');
  const [mainData, setMainData] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Нэвтрэх төлөв
  const [authMode, setAuthMode] = useState('login'); // 'login' эсвэл 'register'
  const [authPhone, setAuthPhone] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [autoPayEnabled, setAutoPayEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [selectedDataPkg, setSelectedDataPkg] = useState(null);
  const [showPayment, setShowPayment] = useState(false); 
  const [mainBalance, setMainBalance] = useState(0);
  const [isBillPaid, setIsBillPaid] = useState(false);
  const [lastPaymentDate, setLastPaymentDate] = useState(null);
  const [unitBalance, setUnitBalance] = useState(0);
  const [customAlert, setCustomAlert] = useState({ visible: false, message: '' });
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [savedCards, setSavedCards] = useState([]);
  const [serviceType, setServiceType] = useState('postpaid'); // 'prepaid' or 'postpaid'

  // Багцын мэдээлэл
  const availablePackages = [
    { id: 'standard', name: 'Стандарт багц', price: 25000, desc: 'Үндсэн хэрэглээнд' },
    { id: 'unlimited', name: 'Хязгааргүй дата', price: 35000, desc: 'Дата хэрэглээ өндөр хүмүүст' },
    { id: 'premium', name: 'Премиум багц', price: 55000, desc: 'Бүх үйлчилгээг багтаасан' },
  ];
  const [activePackage, setActivePackage] = useState(availablePackages[0]);
  const [nextPackage, setNextPackage] = useState(null);

  // Хайлт болон Мэдэгдлийн төлөв
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]); // Шинэ: Сүүлд хайсан үгс
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationList, setNotificationList] = useState([
    { id: 1, title: 'Амжилттай', desc: '5,000₮-н цэнэглэлт амжилттай боллоо.', time: '10 минутын өмнө', icon: 'check-circle', color: '#10B981' },
    { id: 2, title: 'Урамшуулал', desc: 'Найзаа уриад 1GB дата аваарай.', time: '2 цагийн өмнө', icon: 'gift', color: '#F59E0B' },
    { id: 3, title: 'Анхааруулга', desc: 'Таны дата 500MB үлдсэн байна.', time: '1 өдрийн өмнө', icon: 'alert-triangle', color: '#EF4444' },
  ]);
  const [toast, setToast] = useState({ visible: false, title: '', desc: '', icon: '', color: '' });
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Сайн байна уу! 🤖 Би таны ухаалаг туслах байна. Таны дата эсвэл нэгж дууссан уу? Би танд тохирох шилдэг багцыг санал болгож чадна.', sender: 'ai', time: 'Яг одоо: Таны дата 80%-тай байна.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [inputDialog, setInputDialog] = useState({
    visible: false,
    title: '',
    placeholder: '',
    secureTextEntry: false,
    onConfirm: (text) => {},
  });

  const addNotification = (title, desc, icon = 'info', color = '#3B82F6') => {
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

  // Шинэ: Хайлт хийх үед эсвэл илэрц дээр дарахад ажиллах
  const handleSearchAction = (actionFn, query) => {
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
    { id: 'more', title: 'Бусад үйлчилгээ', keywords: 'busad more uramshuulal hitone news', icon: 'grid', color: '#8B5CF6', action: () => handleSearchAction(() => setActiveAction('more'), searchQuery) },
    // Жич: Бусад үйлчилгээнүүдийг хайлтын системтэй холбох бол энд нэмээрэй
    { id: 'insurance', title: 'Утасны даатгал', keywords: 'daatgal insurance utas', icon: 'shield', color: '#8B5CF6', action: () => handleSearchAction(() => setCustomAlert({ visible: true, message: "Гар утасны даатгал үйлчилгээ удахгүй нээгдэнэ." }), searchQuery) },
    { id: 'entertainment', title: 'Entertainment', keywords: 'entertainment kino content uramshuulal', icon: 'play', color: '#F43F5E', action: () => handleSearchAction(() => setCustomAlert({ visible: true, message: "Контент үзэх эрхийг удахгүй авдаг болно." }), searchQuery) },
  ];

  const banks = [
    { id: 'khan', name: 'Хаан банк', color: '#10B981' },
    { id: 'golomt', name: 'Голомт банк', color: '#3B82F6' },
    { id: 'tdb', name: 'ХХБ', color: '#F59E0B' },
    { id: 'xac', name: 'Хас банк', color: '#EC4899' },
  ];

  // Багц сонгохдоо GB болон Үнийг хамтад нь хадгална
  const handleSelectPackage = (gbAmount, priceAmount) => {
    setSelectedDataPkg({ gb: gbAmount, price: priceAmount });
    setShowPayment(true);
  };
  // Төлбөр хийх үед (карт эсвэл нэгж гэдгийг ялгана)
  const handlePaymentConfirm = async (method) => {
    if (selectedDataPkg && userId) {
      let newBalance = mainBalance;
      let newUnitBalance = unitBalance;
      
      if (method === 'unit') {
        if (unitBalance < selectedDataPkg.price) {
          setCustomAlert({ visible: true, message: 'Уучлаарай, таны НЭГЖНИЙ үлдэгдэл хүрэлцэхгүй байна.' });
          return;
        }
        newUnitBalance -= selectedDataPkg.price;
      } else if (method === 'card') {
        if (mainBalance < selectedDataPkg.price) {
          // Хуучин alert-ийг солив
          setCustomAlert({ visible: true, message: 'Уучлаарай, таны ДАНСНЫ үлдэгдэл хүрэлцэхгүй байна.' });
          return;
        }
        newBalance -= selectedDataPkg.price;
      }

      const newData = mainData + selectedDataPkg.gb;

      // Supabase шинэчлэх
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          balance: newBalance, 
          data_gb: newData, 
          unit_balance: newUnitBalance 
        })
        .eq('id', userId);

      if (error) {
        console.error("Update error:", error);
        setCustomAlert({ visible: true, message: 'Өгөгдөл хадгалахад алдаа гарлаа: ' + error.message });
        return;
      }

      setMainBalance(newBalance);
      setUnitBalance(newUnitBalance);
      setMainData(newData);
      setShowPayment(false);
      setActiveAction(null);
      
      // Амжилттай болсон үеийн alert-ийг солив
      addNotification('Дата амжилттай', `Таны дансанд ${selectedDataPkg.gb}GB дата нэмэгдлээ.`, 'check-circle', '#10B981');
      setCustomAlert({ visible: true, message: `Амжилттай! Таны дансанд ${selectedDataPkg.gb}GB дата нэмэгдлээ.` });
    }
  };
  // --- НЭГЖИЙН КАРТ ХУДАЛДАН АВАХ ФУНКЦ ---
  const handleUnitCardPurchase = async (price, cardName, optionName, unitsToAdd, dataToAdd) => {
    // Зөвхөн дансны үлдэгдлээр шалгана
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

    // Supabase шинэчлэх
    const { error } = await supabase
      .from('profiles')
      .update({ balance: newBalance, unit_balance: newUnitBalance, data_gb: newData })
      .eq('id', userId);

    if (error) {
      setCustomAlert({ visible: true, message: 'Алдаа: ' + error.message });
      return;
    }

    // Данснаас хасах
    setMainBalance(newBalance);
    setUnitBalance(newUnitBalance);
    setMainData(newData);

    // Цонхыг хааж, амжилтын мэдээлэл харуулах
    setActiveAction(null);
    addNotification('Нэгж/Дата авлаа', `Та ${cardName}-н [${optionName}]-ийг авлаа.`, 'check-circle', '#10B981');
    setCustomAlert({
      visible: true,
      message: `Амжилттай! Та ${cardName}-н [${optionName}]-ийг авлаа. Данснаас ₮${price.toLocaleString()} хасагдлаа.`
    });
  };

  // --- ДАНС ЦЭНЭГЛЭХ ФУНКЦ ---
  const handleBalanceTopUp = async (shouldSave = false) => {
    const amount = parseInt(topUpAmount);
    const newBalance = mainBalance + amount;

    let updateData = { balance: newBalance };

    // Карт хадгалах логик
    if (shouldSave && cardNumber.length >= 12) {
      const newCard = { id: Date.now(), number: cardNumber.slice(-4), bank: selectedBank?.name, color: selectedBank?.color };
      const updatedCards = [...savedCards, newCard];
      updateData.saved_cards = updatedCards;
      setSavedCards(updatedCards);
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      setCustomAlert({ visible: true, message: 'Алдаа: ' + error.message });
      return;
    }

    setMainBalance(newBalance);
    setTopUpAmount('');
    setCardNumber('');
    setSelectedBank(null);
    setActiveAction(null);
    addNotification('Цэнэглэлт амжилттай', `Таны дансанд ${amount.toLocaleString()}₮ нэмэгдлээ.`, 'check-circle', '#10B981');
    setCustomAlert({ visible: true, message: `Амжилттай! Таны дансанд ${amount.toLocaleString()}₮ нэмэгдлээ.` });
  };

  // --- ТӨЛБӨР ТӨЛӨХ ФУНКЦ ---
  const handlePayBill = async (amount) => {
    if (mainBalance < amount) {
      setCustomAlert({ 
        visible: true, 
        message: `Уучлаарай, таны ДАНСНЫ үлдэгдэл хүрэлцсэн байна. (${amount.toLocaleString()}₮ шаардлагатай)` 
      });
      return;
    }

    const newBalance = mainBalance - amount;
    const paymentDate = new Date().toISOString();

    const { error } = await supabase
      .from('profiles')
      .update({ 
        balance: newBalance,
        is_bill_paid: true,
        last_payment_date: paymentDate
      })
      .eq('id', userId);

    if (error) {
      setCustomAlert({ visible: true, message: 'Төлбөр төлөхөд алдаа гарлаа.' });
      return;
    }

    setMainBalance(newBalance);
    setIsBillPaid(true);
    setLastPaymentDate(paymentDate);
    addNotification('Төлбөр төлөгдлөө', `6-р сарын нэхэмжлэх ₮${amount.toLocaleString()} амжилттай төлөгдлөө.`, 'check-circle', '#10B981');
    setCustomAlert({ visible: true, message: "Төлбөр амжилттай төлөгдлөө! 🎉" });
  };

  // --- ШИЛЖҮҮЛЭГ ХИЙХ ФУНКЦ ---
  const handleTransfer = async ({ method, target, type, value }) => {
    if (!userId) return false;
    
    try {
      if (method !== 'phone') {
        throw new Error("Одоогоор зөвхөн утасны дугаараар шилжүүлэх боломжтой.");
      }

      const { data: result, error } = await supabase.rpc('execute_transfer', {
        sender_id: userId,
        recipient_phone: target,
        transfer_type: type,
        transfer_value: type === 'data' ? value : parseInt(value)
      });

      if (error) throw error;

      if (result !== 'Амжилттай') {
        // SQL функцээс буцаасан алдааг харуулах
        throw new Error(result.replace('Алдаа: ', ''));
      }

      addNotification(
        'Шилжүүлэг амжилттай', 
        `${target} руу ${type === 'data' ? value.name : parseInt(value) + (type === 'money' ? '₮' : ' нэгж')} шилжүүллээ.`, 
        'send', '#10B981'
      );
      setCustomAlert({ visible: true, message: 'Шилжүүлэг амжилттай хийгдлээ.' });
      return true;
    } catch (err) {
      setCustomAlert({ visible: true, message: err.message });
      return false;
    }
  };

  // --- ҮЙЛЧИЛГЭЭНИЙ ТӨРӨЛ СОЛИХ ---
  const handleServiceTypeChange = async (newType) => {
    if (!userId || serviceType === newType) return;

    setServiceType(newType); // Optimistic update
    const { error } = await supabase
        .from('profiles')
        .update({ service_type: newType })
        .eq('id', userId);

    if (error) {
        setCustomAlert({ visible: true, message: 'Үйлчилгээний төрөл солиход алдаа гарлаа.' });
        setServiceType(serviceType); // Revert on error
    }
  };
  // --- БАГЦ СОЛИХ ФУНКЦ ---
  const handlePackageChange = async (selectedPkg) => {
    if (!userId || !isBillPaid) return;

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
            const { error } = await supabase.from('profiles').update({ next_package: selectedPkg.id }).eq('id', userId);
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

  // --- AI CHAT ЛОГИК ---
  const handleSendMessage = () => {
    if (chatInput.trim() === '') return;

    const userMsg = { id: Date.now(), text: chatInput, sender: 'user' };
    setChatMessages(prev => [...prev, userMsg]);
    const currentInput = chatInput.toLowerCase();
    setChatInput('');

    // AI Хариу үйлдэл (Mock Response)
    setTimeout(() => {
      let botResponse = "Уучлаарай, би таныг сайн ойлгосонгүй. Та 'дата', 'нэгж' эсвэл 'үлдэгдэл' гэж бичиж асууна уу. 😊";
      
      if (currentInput.includes('дата') || currentInput.includes('data')) {
        botResponse = "Танд 15GB дата багцыг санал болгож байна. Энэ нь хамгийн эрэлттэй багц юм. 'Дата багц' цэснээс аваарай.";
      } else if (currentInput.includes('нэгж') || currentInput.includes('unit')) {
        botResponse = "Та данснаасаа шууд нэгж авах боломжтой. 5,000₮-н карт хамгийн тохиромжтой гэж бодож байна.";
      } else if (currentInput.includes('үлдэгдэл') || currentInput.includes('balance')) {
        botResponse = `Таны дансны үлдэгдэл ₮${mainBalance.toLocaleString()} байна. Хэрэглээндээ анхаараарай.`;
      } else if (currentInput.includes('сайн уу') || currentInput.includes('hello')) {
        botResponse = "Сайн байна уу! Танд юугаар туслах вэ?";
      }

      const botMsg = { id: Date.now() + 1, text: botResponse, sender: 'ai' };
      setChatMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  // --- НЭР СОЛИХ ФУНКЦ ---
  const handleUpdateName = async (newName) => {
    if (!userId || !newName || newName.trim() === '') return;
    setInputDialog({ ...inputDialog, visible: false });

    // Auth user update
    const { data: { user }, error: userError } = await supabase.auth.updateUser({ data: { full_name: newName } });
    // Profile table update
    const { error: profileError } = await supabase.from('profiles').update({ full_name: newName }).eq('id', userId);

    if (userError || profileError) {
      setCustomAlert({ visible: true, message: 'Нэр солих үед алдаа гарлаа.' });
    } else {
      setUserName(newName);
      addNotification('Амжилттай', 'Таны нэр амжилттай солигдлоо.', 'check-circle', '#10B981');
    }
  };

  // --- НУУЦ ҮГ СОЛИХ ФУНКЦ ---
  const handleUpdatePassword = async (newPassword) => {
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

  // --- НЭВТРЭХ / БҮРТГҮҮЛЭХ ФУНКЦ ---
  const handleAuth = async () => {
    if (!authPhone || !authPass || (authMode === 'register' && !authName)) {
      setCustomAlert({ visible: true, message: 'Мэдээллээ бүрэн оруулна уу.' });
      return;
    }

    setIsLoading(true);
    try {
      const email = `${authPhone}@xpay.mn`; // Утасны дугаарыг имэйл хэлбэрт шилжүүлэх

      if (authMode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: authPass,
        });
        if (error) throw error;
        
        if (data.user) {
          setIsAuthenticated(true);
          setUserId(data.user.id);
          setUserName(data.user.user_metadata?.full_name || '');
          setCurrentTab('home');
          addNotification('Тавтай морил', 'Амжилттай нэвтэрлээ.', 'user', '#10B981');
          fetchUserProfile(data.user.id);

          // Биометрик асуух
          if (!biometricsEnabled) {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (hasHardware && isEnrolled) {
              setCustomAlert({
                visible: true,
                message: 'Та дараагийн удаа хурууны хээ эсвэл нүүр танигчаар нэвтрэх үү?',
                buttons: [
                  { text: 'Үгүй', style: 'cancel', onPress: () => setCustomAlert({ visible: false, message: '' }) },
                  {
                    text: 'Асаах',
                    onPress: async () => {
                      await SecureStore.setItemAsync('user_phone', authPhone);
                      await SecureStore.setItemAsync('user_pass', authPass);
                      await supabase.from('profiles').update({ biometrics_enabled: true }).eq('id', data.user.id);
                      setBiometricsEnabled(true);
                      setCustomAlert({ visible: false, message: '' });
                    },
                  },
                ],
              });
            } 
          }
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: authPass,
          options: { data: { full_name: authName, phone: authPhone } }
        });
        if (error) throw error;

        if (data.user) {
          setIsAuthenticated(true);
          setUserId(data.user.id);
          setUserName(authName);
          setCurrentTab('home');
          setCustomAlert({ visible: true, message: 'Амжилттай бүртгэгдлээ!' });
          
          // Шинэ хэрэглэгчид биометрик санал болгох
          await SecureStore.setItemAsync('user_phone', authPhone);
          await SecureStore.setItemAsync('user_pass', authPass);
          await supabase.from('profiles').update({ biometrics_enabled: true }).eq('id', data.user.id);
          setBiometricsEnabled(true);
        }
      }
    } catch (error) {
      setCustomAlert({ visible: true, message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Хэрэглэгчийн мэдээлэл татах
  const fetchUserProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, phone, balance, data_gb, unit_balance, is_bill_paid, last_payment_date, saved_cards, active_package, next_package, service_type')
      .eq('id', userId)
      .maybeSingle(); // single() биш maybeSingle() ашиглах нь алдаанаас сэргийлнэ

    if (error) {
      console.error("Profile fetch error:", error.message);
      return;
    }

    if (data) {
      console.log("Profile data loaded:", data);
      if (data.full_name) setUserName(data.full_name);
      if (data.phone) setAuthPhone(data.phone);
      setMainBalance(Number(data.balance) || 0);
      setMainData(Number(data.data_gb) || 0);
      setUnitBalance(Number(data.unit_balance) || 0);
      setSavedCards(data.saved_cards || []);
      setServiceType(data.service_type || 'postpaid');

      // Идэвхтэй болон дараагийн багцыг тохируулах
      const currentPkg = availablePackages.find(p => p.id === data.active_package) || availablePackages[0];
      const upcomingPkg = availablePackages.find(p => p.id === data.next_package);
      setActivePackage(currentPkg);
      setNextPackage(upcomingPkg || null);

      // Төлбөрийн төлөвийг сар шалгаж шинэчлэх
      const lastPaid = data.last_payment_date ? new Date(data.last_payment_date) : null;
      const now = new Date();
      let updates = {};
      let needsUpdate = false;

      if (lastPaid && lastPaid.getMonth() === now.getMonth() && lastPaid.getFullYear() === now.getFullYear()) {
        // Энэ сард төлсөн бол төлсөн төлөвт үлдээх
        setIsBillPaid(true);
        setLastPaymentDate(data.last_payment_date);
      } else {
        // Сар солигдсон бол төлбөрийн төлөвийг шинэчлэх
        setIsBillPaid(false);
        setLastPaymentDate(null);
        updates = { is_bill_paid: false, last_payment_date: null };
        needsUpdate = true;

        // Хэрэв дараа сарын багц сонгосон байвал түүнийг идэвхжүүлэх
        if (upcomingPkg) {
          setActivePackage(upcomingPkg);
          setNextPackage(null);
          updates = { ...updates, active_package: upcomingPkg.id, next_package: null };
        }
        if (needsUpdate) await supabase.from('profiles').update(updates).eq('id', userId);
      }
    } else {
      console.log("No profile found for user:", userId);
    }
  };

  // --- СИСТЕМЭЭС ГАРАХ ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    // Сесс байгаа эсэхийг шалгах
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        fetchUserProfile(session.user.id);
      }
      setIsLoading(false);
    });

    // Auth төлөв өөрчлөгдөхийг сонсох
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setUserId(session?.user.id || null);
      if (session) {
        console.log("Session detected for:", session.user.id);
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
        setNotificationList([]); // Нэвтрэлт дуусах үед мэдэгдлийг цэвэрлэх
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Real-time Update: profiles хүснэгт өөрчлөгдөхөд (нэр, баланс г.м) апп-ыг шууд шинэчлэх
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
        (payload) => {
          if (payload.new) {
            setUserName(payload.new.full_name || '');
            setMainBalance(Number(payload.new.balance));
            setMainData(Number(payload.new.data_gb));
            setUnitBalance(Number(payload.new.unit_balance));
            setIsBillPaid(payload.new.is_bill_paid);
            setLastPaymentDate(payload.new.last_payment_date);
            setSavedCards(payload.new.saved_cards || []);
            if (payload.new.service_type) setServiceType(payload.new.service_type);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Мэдэгдэл ирэх үед Toast-ийг 3 секундын дараа автоматаар хаах
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // --- LOADING ДЭЛГЭЦ ---
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F0F14', justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar barStyle="light-content" backgroundColor="#0F0F14" />
        
        {/* Шинэчилсэн 'X' Лого */}
        <View style={{
          width: 100,
          height: 100,
          backgroundColor: '#7b00ce',
          borderRadius: 28, 
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
          elevation: 12,
          shadowColor: '#0052CC',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.5,
          shadowRadius: 16,
        }}>
          <Text style={{
            color: '#FFF',
            fontSize: 64,
            fontWeight: '900',
            fontStyle: 'italic', 
          }}>
            X
          </Text>
        </View>

        {/* Апп-ын нэр */}
        <Text style={{
          color: '#FFF',
          fontSize: 32,
          fontWeight: 'bold',
          letterSpacing: 2,
        }}>
          XPAY
        </Text>
        <Text style={{ color: '#6B7280', fontSize: 14, marginTop: 8, letterSpacing: 2 }}>
          ДИЖИТАЛ ХЭМНЭЛ
        </Text>

        {/* Уншиж байгаа дүрс */}
        <ActivityIndicator size="large" color="#0052CC" style={{ marginTop: 40 }} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F14" />

      {/* Toast Notification - Дэлгэцийн дээд хэсэгт харагдах түр зуурын мэдэгдэл */}
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
          <>
            {/* Сонгогдсон хуудсыг харуулах логик */}
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
                activePackage={activePackage}
                nextPackage={nextPackage}
                handlePackageChange={handlePackageChange}
                serviceType={serviceType}
                handleServiceTypeChange={handleServiceTypeChange}
              />
            )}
            {currentTab === 'settings' && (
              <SettingsTab 
                T={T} userName={userName} userPhone={authPhone} addNotification={addNotification} setCustomAlert={setCustomAlert} biometricsEnabled={biometricsEnabled} setBiometricsEnabled={setBiometricsEnabled}
                appLanguage={appLanguage} setAppLanguage={setAppLanguage} setActiveAction={setActiveAction} setShowAIChat={setShowAIChat} handleLogout={handleLogout}
                openInputDialog={setInputDialog} handleUpdateName={handleUpdateName} handleUpdatePassword={handleUpdatePassword}
              />
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
              {!showAIChat && !activeAction && (
                <View style={styles.centerNavBtnWrapper}>
                  <TouchableOpacity style={styles.centerNavBtn} onPress={() => setShowAIChat(true)}>
                    <Feather name="message-square" size={24} color="#FFF" />
                  </TouchableOpacity>
                </View>
              )}
              <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('billing')}>
                <Feather name="credit-card" size={24} color={currentTab === 'billing' ? '#FFF' : '#6B7280'} />
                <Text style={[styles.navText, { color: currentTab === 'billing' ? '#FFF' : '#6B7280' }]}>{T.nav.billing}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('settings')}>
                <Feather name="settings" size={24} color={currentTab === 'settings' ? '#FFF' : '#6B7280'} />
                <Text style={[styles.navText, { color: currentTab === 'settings' ? '#FFF' : '#6B7280' }]}>{T.nav.settings}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Global Components - Must be outside isAuthenticated to be visible on AuthScreen */}
        <CustomAlert 
          visible={customAlert.visible} 
          message={customAlert.message} 
          onClose={() => setCustomAlert({ visible: false, message: '' })} 
          buttons={customAlert.buttons}
        />
        <InputDialog
          visible={inputDialog.visible}
          title={inputDialog.title}
          placeholder={inputDialog.placeholder}
          secureTextEntry={inputDialog.secureTextEntry}
          onCancel={() => setInputDialog({ ...inputDialog, visible: false })}
          onConfirm={inputDialog.onConfirm}
        />

        {/* Салгасан Modal компонентуудыг ашиглах */}
        <AiChatModal 
          visible={showAIChat} onClose={() => setShowAIChat(false)} 
          chatMessages={chatMessages} chatInput={chatInput} setChatInput={setChatInput} onSendMessage={handleSendMessage} 
        />
        <DataActionModal 
          visible={activeAction === 'data'} onClose={() => { setActiveAction(null); setShowPayment(false); }}
          showPayment={showPayment} selectedDataPkg={selectedDataPkg} unitBalance={unitBalance}
          handleSelectPackage={handleSelectPackage} handlePaymentConfirm={handlePaymentConfirm}
        />
        <MoreActionModal visible={activeAction === 'more'} onClose={() => setActiveAction(null)} setCustomAlert={setCustomAlert} />
        <UnitActionModal visible={activeAction === 'unit'} onClose={() => setActiveAction(null)} mainBalance={mainBalance} handleUnitCardPurchase={handleUnitCardPurchase} />
        <TopUpActionModal 
          visible={activeAction === 'topup'} onClose={() => setActiveAction(null)}
          topUpAmount={topUpAmount} setTopUpAmount={setTopUpAmount}
          selectedBank={selectedBank} setSelectedBank={setSelectedBank}
          cardNumber={cardNumber} setCardNumber={setCardNumber}
          banks={banks} handleBalanceTopUp={handleBalanceTopUp}
          savedCards={savedCards}
        />
        <TransferModal visible={activeAction === 'transfer'} onClose={() => setActiveAction(null)} T={T} mainBalance={mainBalance} unitBalance={unitBalance} mainData={mainData} handleTransfer={handleTransfer} />
        <AllServicesModal visible={showAllServices} onClose={() => setShowAllServices(false)} setActiveAction={setActiveAction} setCurrentTab={setCurrentTab} setCustomAlert={setCustomAlert} />
        <SearchModal visible={isSearching} onClose={() => { setIsSearching(false); setSearchQuery(''); }} searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchableItems={searchableItems} recentSearches={recentSearches} setRecentSearches={setRecentSearches} />

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
    </SafeAreaProvider>
  );
}