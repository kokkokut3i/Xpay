import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { height } = Dimensions.get('window');

const TopUpActionModal = ({ 
  visible, 
  onClose, 
  topUpAmount, 
  setTopUpAmount, 
  selectedBank, 
  setSelectedBank, 
  cardNumber, 
  setCardNumber, 
  banks, 
  handleBalanceTopUp,
  savedCards
}) => {
  const [step, setStep] = useState(1); // 1: Amount, 2: Method/Bank, 3: Card/QPay
  const [isProcessing, setIsProcessing] = useState(false);
  const [method, setMethod] = useState('card'); // 'card' or 'qpay'
  const [shouldSaveCard, setShouldSaveCard] = useState(false);
  const [useSavedCard, setUseSavedCard] = useState(null);

  if (!visible) return null;

  const presets = ['1000', '5000', '10000', '20000', '50000', '100000'];

  const handleClose = () => {
    setStep(1);
    setMethod('card');
    setUseSavedCard(null);
    onClose();
  };

  const onFinalConfirm = async () => {
    setIsProcessing(true);
    setTimeout(async () => {
      await handleBalanceTopUp(shouldSaveCard);
      setIsProcessing(false);
      setStep(1);
      setUseSavedCard(null);
    }, 1500);
  };

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 15, 20, 0.98)', zIndex: 1000, paddingTop: height * 0.1, paddingHorizontal: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <View>
          <Text style={{ color: '#FFF', fontSize: 24, fontWeight: 'bold' }}>Данс цэнэглэх</Text>
          <Text style={{ color: '#9CA3AF', fontSize: 14, marginTop: 4 }}>Алхам {step} / 3</Text>
        </View>
        <TouchableOpacity onPress={handleClose} style={{ backgroundColor: '#1F2937', padding: 10, borderRadius: 25 }}>
          <Feather name="x" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {isProcessing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={{ color: '#FFF', marginTop: 20, fontSize: 16 }}>Гүйлгээг боловсруулж байна...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {step === 1 && (
            <View>
              <Text style={localStyles.label}>Цэнэглэх дүн (₮)</Text>
              <TextInput
                style={localStyles.input}
                placeholder="0"
                placeholderTextColor="#4B5563"
                keyboardType="numeric"
                value={topUpAmount}
                onChangeText={setTopUpAmount}
                autoFocus
              />
              <View style={localStyles.presetGrid}>
                {presets.map(p => (
                  <TouchableOpacity 
                    key={p} 
                    onPress={() => setTopUpAmount(p)}
                    style={[localStyles.presetBtn, topUpAmount === p && { borderColor: '#7C3AED', backgroundColor: '#7C3AED20' }]}
                  >
                    <Text style={{ color: topUpAmount === p ? '#FFF' : '#9CA3AF', fontWeight: 'bold' }}>{parseInt(p).toLocaleString()}₮</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity 
                onPress={() => topUpAmount > 0 && setStep(2)}
                style={[localStyles.mainBtn, { opacity: topUpAmount > 0 ? 1 : 0.5 }]}
              >
                <Text style={localStyles.mainBtnText}>Үргэлжлүүлэх</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={localStyles.label}>Төлбөрийн хэлбэр сонгох</Text>
              <TouchableOpacity onPress={() => setMethod('qpay')} style={[localStyles.methodCard, method === 'qpay' && localStyles.activeMethod]}>
                <Feather name="qr-code" size={24} color="#10B981" />
                <Text style={localStyles.methodText}>QPay - QR код уншуулах</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMethod('card')} style={[localStyles.methodCard, method === 'card' && localStyles.activeMethod]}>
                <Feather name="credit-card" size={24} color="#3B82F6" />
                <Text style={localStyles.methodText}>Банкны карт</Text>
              </TouchableOpacity>

              {method === 'card' && savedCards && savedCards.length > 0 && (
                <View style={{ marginBottom: 20 }}>
                  <Text style={localStyles.label}>Хадгалсан картууд</Text>
                  {savedCards.map(card => (
                    <TouchableOpacity 
                      key={card.id} 
                      onPress={() => {
                        setUseSavedCard(card);
                        setStep(3);
                      }}
                      style={localStyles.bankItem}
                    >
                      <Feather name="credit-card" size={20} color={card.color} />
                      <Text style={{ color: '#FFF', flex: 1, marginLeft: 12 }}>{card.bank} (**** {card.number})</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={[localStyles.label, { marginTop: 20 }]}>Банк сонгох</Text>
              {banks.map(bank => (
                <TouchableOpacity 
                  key={bank.id} 
                  onPress={() => setSelectedBank(bank)}
                  style={[localStyles.bankItem, selectedBank?.id === bank.id && { borderColor: bank.color }]}
                >
                  <View style={[localStyles.bankIcon, { backgroundColor: bank.color }]}><Text style={{color:'#FFF', fontWeight:'bold'}}>{bank.name[0]}</Text></View>
                  <Text style={{ color: '#FFF', flex: 1, marginLeft: 12 }}>{bank.name}</Text>
                  {selectedBank?.id === bank.id && <Feather name="check-circle" size={20} color={bank.color} />}
                </TouchableOpacity>
              ))}
              
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity onPress={() => setStep(1)} style={[localStyles.mainBtn, { flex: 1, backgroundColor: '#374151' }]}><Text style={localStyles.mainBtnText}>Буцах</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => selectedBank && setStep(3)} style={[localStyles.mainBtn, { flex: 2, opacity: selectedBank ? 1 : 0.5 }]}><Text style={localStyles.mainBtnText}>Сонгох</Text></TouchableOpacity>
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={{ alignItems: 'center' }}>
              {useSavedCard ? (
                <View style={{ width: '100%', backgroundColor: '#1C1C24', padding: 20, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: useSavedCard.color }}>
                  <Text style={{ color: '#9CA3AF', fontSize: 12 }}>Сонгосон карт</Text>
                  <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 5 }}>{useSavedCard.bank}</Text>
                  <Text style={{ color: '#FFF', fontSize: 16, marginTop: 5 }}>**** **** **** {useSavedCard.number}</Text>
                </View>
              ) : method === 'qpay' ? (
                <View style={{ alignItems: 'center', backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 20 }}>
                  <Feather name="qr-code" size={200} color="#000" />
                  <Text style={{ color: '#000', fontWeight: 'bold', marginTop: 10 }}>₮{parseInt(topUpAmount).toLocaleString()}</Text>
                </View>
              ) : (
                <View style={{ width: '100%' }}>
                  <Text style={localStyles.label}>Картын дугаар</Text>
                  <TextInput
                    style={localStyles.input}
                    placeholder="0000 0000 0000 0000"
                    placeholderTextColor="#4B5563"
                    keyboardType="numeric"
                    maxLength={16}
                    value={cardNumber}
                    onChangeText={setCardNumber}
                  />
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <Text style={{ color: '#FFF' }}>Дараа ашиглахаар хадгалах</Text>
                    <Switch 
                      value={shouldSaveCard} 
                      onValueChange={setShouldSaveCard}
                      trackColor={{ false: "#374151", true: "#7C3AED" }}
                    />
                  </View>
                </View>
              )}
              <Text style={{ color: '#9CA3AF', textAlign: 'center', marginBottom: 30 }}>Таны гүйлгээ {(useSavedCard?.bank || selectedBank?.name)}-ээр дамжин хийгдэнэ.</Text>
              <TouchableOpacity onPress={onFinalConfirm} style={localStyles.mainBtn}>
                <Text style={localStyles.mainBtnText}>Цэнэглэх</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStep(2)} style={{ marginTop: 15 }}><Text style={{ color: '#9CA3AF' }}>Буцах</Text></TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  label: { color: '#9CA3AF', fontSize: 13, marginBottom: 10, fontWeight: '600' },
  input: { backgroundColor: '#1C1C24', borderRadius: 16, padding: 18, color: '#FFF', fontSize: 24, fontWeight: 'bold', borderWidth: 1, borderColor: '#2D2D3A', marginBottom: 20 },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 },
  presetBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: '#2D2D3A', minWidth: '30%', alignItems: 'center' },
  mainBtn: { backgroundColor: '#7C3AED', paddingVertical: 16, borderRadius: 16, alignItems: 'center', width: '100%' },
  mainBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  methodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C24', padding: 18, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#2D2D3A' },
  activeMethod: { borderColor: '#7C3AED', backgroundColor: '#7C3AED10' },
  methodText: { color: '#FFF', marginLeft: 15, fontWeight: '600' },
  bankItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C24', padding: 14, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#2D2D3A' },
  bankIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }
});

export default TopUpActionModal;