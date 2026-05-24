import { Feather } from '@expo/vector-icons';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

const ServiceItem = ({ icon, color, title, sub, action }) => (
  <TouchableOpacity style={styles.assetCard} onPress={action}>
    <View style={styles.assetLeft}>
      <View style={[styles.assetIcon, { backgroundColor: color }]}>
        <Feather name={icon} size={20} color="#FFF" />
      </View>
      <View>
        <Text style={styles.assetName}>{title}</Text>
        <Text style={styles.assetSub}>{sub}</Text>
      </View>
    </View>
    <Feather name="chevron-right" size={20} color="#6B7280" />
  </TouchableOpacity>
);

const AllServicesModal = ({ visible, onClose, setActiveAction, setCurrentTab, setCustomAlert }) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F14' }}>
        <View style={[styles.header, { paddingHorizontal: 20, paddingTop: 20 }]}>
          <View>
            <Text style={styles.greeting}>Бүх үйлчилгээ</Text>
            <Text style={styles.subGreeting}>Ангилалаар харах</Text>
          </View>
          <TouchableOpacity 
            onPress={onClose} 
            style={[styles.iconButton, { backgroundColor: '#2D2D3A' }]}
          >
            <Feather name="x" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 20 }}>
          <Text style={styles.sectionTitleInternal}>Харилцаа холбоо</Text>
          <ServiceItem icon="wifi" color="#10B981" title="Дата багц" sub="Дата, нэмэлт багцууд" action={() => {onClose(); setActiveAction('data');}}/>
          <ServiceItem icon="zap" color="#F59E0B" title="Нэгж цэнэглэх" sub="Данснаасаа нэгж авах" action={() => {onClose(); setActiveAction('unit');}}/>
          <ServiceItem icon="hash" color="#EC4899" title="Шинэ дугаар" sub="Дугаар захиалах" action={() => setCustomAlert({visible:true, message:"Coming soon"})}/>
          <ServiceItem icon="smartphone" color="#3B82F6" title="Роуминг" sub="Олон улсын яриа, дата" action={() => {}}/>
          
          <Text style={styles.sectionTitleInternal}>Санхүү ба Төлбөр</Text>
          <ServiceItem icon="credit-card" color="#3B82F6" title="Төлбөр төлөх" sub="Сарын хэрэглээний төлбөр" action={() => {onClose(); setCurrentTab('billing');}}/>
          <ServiceItem icon="plus-circle" color="#8B5CF6" title="Данс цэнэглэх" sub="Банкны картаар данс цэнэглэх" action={() => {onClose(); setActiveAction('topup');}}/>
          <ServiceItem icon="repeat" color="#10B981" title="Автомат төлбөр" sub="Auto-pay тохиргоо" action={() => {onClose(); setCurrentTab('billing');}}/>

          <Text style={styles.sectionTitleInternal}>Нэмэлт үйлчилгээ</Text>
          <ServiceItem icon="music" color="#FCA5A5" title="Hi-Tone" sub="Дуут дохионы ая" action={() => {}}/>
          <ServiceItem icon="play" color="#F43F5E" title="Entertainment" sub="LookTV, контент эрх" action={() => {}}/>
          <ServiceItem icon="shield" color="#6EE7B7" title="Даатгал" sub="Гар утасны даатгал" action={() => {}}/>
          
          <View style={{ height: 50 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default AllServicesModal;