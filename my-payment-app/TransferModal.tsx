import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from './supabase';

const { height } = Dimensions.get('window');

interface TransferModalProps {
  visible: boolean;
  onClose: () => void;
  T: any;
  mainBalance: number;
  unitBalance: number;
  mainData: number;
  handleTransfer: (data: { method: 'phone' | 'account' | null; target: string; type: string; value: any }) => Promise<boolean>;
}

const TransferModal: React.FC<TransferModalProps> = ({ 
  visible, 
  onClose, 
  T, 
  mainBalance, 
  unitBalance, 
  mainData, 
  handleTransfer 
}) => {
  const [step, setStep] = useState(1); // 1: Method, 2: Target, 3: Amount/Type
  const [method, setMethod] = useState<'phone' | 'account' | null>(null);
  const [target, setTarget] = useState('');
  const [type, setType] = useState('money'); // 'money', 'unit', 'data'
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recipientInfo, setRecipientInfo] = useState<{ name: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  const dataPackages = [
    { id: 'd1', gb: 1, price: 1000, name: '1GB Багц' },
    { id: 'd2', gb: 3, price: 2500, name: '3GB Багц' },
    { id: 'd3', gb: 5, price: 4500, name: '5GB Багц' },
  ];

  if (!visible) return null;

  const resetAndClose = () => {
    setStep(1);
    setMethod(null);
    setTarget('');
    setType('money');
    setAmount('');
    setRecipientInfo(null);
    setVerifyError('');
    setIsVerifying(false);
    onClose();
  };

  const handleVerifyRecipient = async () => {
    if (target.length !== 8) {
      setVerifyError("Утасны дугаар 8 оронтой байх ёстой.");
      return;
    }
    setIsVerifying(true);
    setVerifyError('');
    setRecipientInfo(null);

    const { data, error } = await supabase.rpc('get_user_by_phone', { phone_number: target }).single() as { data: { id: string, full_name: string } | null, error: any };

    if (error || !data || !(data as any).full_name) {
      setVerifyError("Уучлаарай, энэ дугаар бүртгэлгүй байна.");
    } else {
      setRecipientInfo({ name: (data as any).full_name });
    }
    setIsVerifying(false);
  };

  const handleConfirm = async (dataPkg: any = null) => {
    setIsProcessing(true);
    const success = await handleTransfer({
      method,
      target,
      type: dataPkg ? 'data' : type,
      value: dataPkg || amount
    });
    setIsProcessing(false);
    if (success) resetAndClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={resetAndClose}>
      <View style={localStyles.overlay}>
        <View style={localStyles.container}>
          <View style={localStyles.header}>
            <Text style={localStyles.title}>Шилжүүлэг хийх</Text>
            <TouchableOpacity onPress={resetAndClose} style={localStyles.closeBtn}>
              <Feather name="x" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          {isProcessing ? (
            <View style={localStyles.center}>
              <ActivityIndicator size="large" color="#7C3AED" />
              <Text style={{ color: '#9CA3AF', marginTop: 12 }}>Боловсруулж байна...</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {step === 1 && (
                <View>
                  <Text style={localStyles.label}>Шилжүүлэх суваг</Text>
                  <TouchableOpacity onPress={() => { setMethod('phone'); setStep(2); }} style={localStyles.option}>
                    <Feather name="smartphone" size={24} color="#10B981" />
                    <View style={{ marginLeft: 16 }}>
                      <Text style={localStyles.optionTitle}>Утасны дугаар руу</Text>
                      <Text style={localStyles.optionSub}>Мөнгө, нэгж, дата шилжүүлэх</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { setMethod('account'); setStep(2); }} style={localStyles.option}>
                    <Feather name="credit-card" size={24} color="#3B82F6" />
                    <View style={{ marginLeft: 16 }}>
                      <Text style={localStyles.optionTitle}>Дансны дугаар руу</Text>
                      <Text style={localStyles.optionSub}>Зөвхөн мөнгө шилжүүлэх</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              {step === 2 && (
                <View>
                  <Text style={localStyles.label}>{method === 'phone' ? 'Утасны дугаар' : 'Дансны дугаар'}</Text>
                  <TextInput
                    style={localStyles.input}
                    placeholder={method === 'phone' ? "Дугаар оруулах" : "Дансны дугаар"}
                    placeholderTextColor="#4B5563"
                    keyboardType="numeric"
                    value={target}
                    onChangeText={setTarget}
                    maxLength={method === 'phone' ? 8 : undefined}
                  />
                  {isVerifying ? (
                    <ActivityIndicator color="#7C3AED" style={{ marginVertical: 16 }} />
                  ) : recipientInfo ? (
                    <View>
                      <View style={localStyles.recipientInfoBox}>
                        <Feather name="user-check" size={18} color="#10B981" />
                        <Text style={localStyles.recipientName}>Хүлээн авагч: {recipientInfo.name}</Text>
                      </View>
                      <TouchableOpacity onPress={() => setStep(3)} style={localStyles.mainBtn}>
                        <Text style={localStyles.btnText}>Үргэлжлүүлэх</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={handleVerifyRecipient} disabled={target.length !== 8} style={[localStyles.mainBtn, target.length !== 8 && { opacity: 0.5 }]}>
                      <Text style={localStyles.btnText}>Шалгах</Text>
                    </TouchableOpacity>
                  )}
                  {verifyError && <Text style={localStyles.errorText}>{verifyError}</Text>}
                  <TouchableOpacity 
                    onPress={() => { 
                      setStep(1); 
                      setRecipientInfo(null); 
                      setVerifyError('');
                    }} 
                    style={localStyles.backBtn}
                  ><Text style={{ color: '#9CA3AF' }}>Буцах</Text></TouchableOpacity>
                </View>
              )}

              {step === 3 && (
                <View>
                  {method === 'phone' ? (
                    <>
                      <Text style={localStyles.label}>Шилжүүлэх төрөл</Text>
                      <View style={localStyles.chipRow}>
                        {['money', 'unit', 'data'].map(t => (
                          <TouchableOpacity key={t} onPress={() => setType(t)} style={[localStyles.chip, type === t && localStyles.activeChip]}>
                            <Text style={{ color: '#FFF', textTransform: 'capitalize' }}>{t === 'money' ? 'Мөнгө' : t === 'unit' ? 'Нэгж' : 'Дата'}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </>
                  ) : null}

                  {type === 'data' && method === 'phone' ? (
                    dataPackages.map(pkg => (
                      <TouchableOpacity key={pkg.id} onPress={() => handleConfirm(pkg)} style={localStyles.pkgItem}>
                        <View><Text style={localStyles.pkgName}>{pkg.name}</Text><Text style={localStyles.pkgPrice}>₮{pkg.price.toLocaleString()}</Text></View>
                        <Feather name="send" size={18} color="#7C3AED" />
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View>
                      <Text style={localStyles.label}>Шилжүүлэх дүн</Text>
                      <TextInput
                        style={localStyles.input}
                        placeholder="0"
                        placeholderTextColor="#4B5563"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                      />
                      <TouchableOpacity onPress={() => handleConfirm()} style={localStyles.mainBtn}>
                        <Text style={localStyles.btnText}>Шилжүүлэх</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  <TouchableOpacity onPress={() => setStep(2)} style={localStyles.backBtn}><Text style={{ color: '#9CA3AF' }}>Буцах</Text></TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  container: { backgroundColor: '#15151D', borderTopLeftRadius: 32, borderTopRightRadius: 32, height: '75%', padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  closeBtn: { backgroundColor: '#2D2D3A', padding: 8, borderRadius: 20 },
  label: { color: '#9CA3AF', fontSize: 13, marginBottom: 12, fontWeight: '600' },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C24', padding: 18, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#2D2D3A' },
  optionTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  optionSub: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },
  input: { backgroundColor: '#1C1C24', borderRadius: 16, padding: 18, color: '#FFF', fontSize: 20, fontWeight: 'bold', borderWidth: 1, borderColor: '#2D2D3A', marginBottom: 16 },
  mainBtn: { backgroundColor: '#7C3AED', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  backBtn: { alignItems: 'center', marginTop: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  chipRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#2D2D3A' },
  activeChip: { backgroundColor: '#7C3AED' },
  pkgItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1C1C24', padding: 16, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#2D2D3A' },
  pkgName: { color: '#FFF', fontWeight: 'bold' },
  pkgPrice: { color: '#9CA3AF', fontSize: 12 },
  recipientInfoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 14, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)' },
  recipientName: { color: '#FFF', marginLeft: 10, fontWeight: '600' },
  errorText: { color: '#EF4444', textAlign: 'center', marginTop: 12 }
});

export default TransferModal;