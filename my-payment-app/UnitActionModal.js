import { Feather } from '@expo/vector-icons';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const UnitActionModal = ({ visible, onClose, mainBalance, handleUnitCardPurchase }) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: '#0F0F14', paddingTop: 50, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ color: '#FFF', fontSize: 22, fontWeight: 'bold' }}>Нэгж цэнэглэх</Text>
          <TouchableOpacity 
            onPress={onClose} 
            style={{ backgroundColor: '#272732', padding: 10, borderRadius: 50 }}
          >
            <Feather name="x" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <Text style={{ color: '#9CA3AF', marginBottom: 20, fontSize: 14 }}>
          Нэгжийг зөвхөн дансны үлдэгдлээр авах боломжтой. {"\n"}
          Таны дансны үлдэгдэл: <Text style={{ color: '#F59E0B', fontWeight: 'bold' }}>₮{mainBalance.toLocaleString()}</Text>
        </Text>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 50 }}>
          
          {/* 5,000₮-н карт */}
          <View style={{ backgroundColor: '#1C1C24', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#374151' }}>
            <Text style={{ color: '#F59E0B', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>5,000₮-н карт</Text>
            <TouchableOpacity onPress={() => handleUnitCardPurchase(5000, '5,000₮ карт', 'Сонголт 1', 1000, 4)} style={{ backgroundColor: '#2D2D3A', padding: 14, borderRadius: 10, marginBottom: 10 }}>
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Сонголт 1: <Text style={{ color: '#10B981' }}>1,000 нэгж + 4GB дата</Text></Text>
              <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>Хүчинтэй хугацаа: 7 хоног</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleUnitCardPurchase(5000, '5,000₮ карт', 'Сонголт 2', 5000, 0)} style={{ backgroundColor: '#2D2D3A', padding: 14, borderRadius: 10 }}>
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Сонголт 2: <Text style={{ color: '#3B82F6' }}>5,000 нэгж</Text></Text>
            </TouchableOpacity>
          </View>

          {/* 10,000₮-н карт */}
          <View style={{ backgroundColor: '#1C1C24', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#374151' }}>
            <Text style={{ color: '#F59E0B', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>10,000₮-н карт</Text>
            <TouchableOpacity onPress={() => handleUnitCardPurchase(10000, '10,000₮ карт', 'Сонголт 1', 5000, 15)} style={{ backgroundColor: '#2D2D3A', padding: 14, borderRadius: 10, marginBottom: 10 }}>
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Сонголт 1: <Text style={{ color: '#10B981' }}>5,000 нэгж + 15GB дата</Text></Text>
              <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>Хүчинтэй хугацаа: 10 хоног</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleUnitCardPurchase(10000, '10,000₮ карт', 'Сонголт 2', 10000, 0)} style={{ backgroundColor: '#2D2D3A', padding: 14, borderRadius: 10 }}>
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Сонголт 2: <Text style={{ color: '#3B82F6' }}>10,000 нэгж</Text></Text>
            </TouchableOpacity>
          </View>

          {/* 14,000₮-н карт */}
          <View style={{ backgroundColor: '#1C1C24', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#374151' }}>
            <Text style={{ color: '#F59E0B', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>14,000₮-н карт</Text>
            <TouchableOpacity onPress={() => handleUnitCardPurchase(14000, '14,000₮ карт', 'Сонголт 1', 0, 4)} style={{ backgroundColor: '#2D2D3A', padding: 14, borderRadius: 10, marginBottom: 10 }}>
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Сонголт 1: <Text style={{ color: '#E9D5FF' }}>Сүлжээнд хязгааргүй яриа + 4GB</Text></Text>
              <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>Хүчинтэй хугацаа: 30 хоног</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleUnitCardPurchase(14000, '14,000₮ карт', 'Сонголт 2', 4000, 10)} style={{ backgroundColor: '#2D2D3A', padding: 14, borderRadius: 10, marginBottom: 10 }}>
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Сонголт 2: <Text style={{ color: '#10B981' }}>4,000 нэгж + 10GB дата</Text></Text>
              <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>Хүчинтэй хугацаа: 30 хоног</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleUnitCardPurchase(14000, '14,000₮ карт', 'Сонголт 3', 14000, 0)} style={{ backgroundColor: '#2D2D3A', padding: 14, borderRadius: 10 }}>
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Сонголт 3: <Text style={{ color: '#3B82F6' }}>14,000 нэгж</Text></Text>
            </TouchableOpacity>
          </View>

          {/* 25,000₮-н карт */}
          <View style={{ backgroundColor: '#1C1C24', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#374151' }}>
            <Text style={{ color: '#F59E0B', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>25,000₮-н карт</Text>
            <TouchableOpacity onPress={() => handleUnitCardPurchase(25000, '25,000₮ карт', 'Үндсэн багц', 5000, 10)} style={{ backgroundColor: '#2D2D3A', padding: 14, borderRadius: 10 }}>
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Сүлжээндээ ХЯЗГААРГҮЙ + 10GB дата + 5,000 нэгж</Text>
              <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>Хүчинтэй хугацаа: 30 хоног</Text>
            </TouchableOpacity>
          </View>

          {/* 28,000₮-н карт */}
          <View style={{ backgroundColor: '#1C1C24', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#374151' }}>
            <Text style={{ color: '#F59E0B', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>28,000₮-н карт</Text>
            <TouchableOpacity onPress={() => handleUnitCardPurchase(28000, '28,000₮ карт', 'Сонголт 1', 0, 4)} style={{ backgroundColor: '#2D2D3A', padding: 14, borderRadius: 10, marginBottom: 10 }}>
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Сонголт 1: <Text style={{ color: '#E9D5FF' }}>БҮХ СҮЛЖЭЭНД ХЯЗГААРГҮЙ + 4GB</Text></Text>
              <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>Хүчинтэй хугацаа: 30 хоног</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleUnitCardPurchase(28000, '28,000₮ карт', 'Сонголт 2', 4000, 24)} style={{ backgroundColor: '#2D2D3A', padding: 14, borderRadius: 10, marginBottom: 10 }}>
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Сонголт 2: <Text style={{ color: '#10B981' }}>4,000 нэгж + 24GB дата</Text></Text>
              <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>Хүчинтэй хугацаа: 30 хоног</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleUnitCardPurchase(28000, '28,000₮ карт', 'Сонголт 3', 28000, 0)} style={{ backgroundColor: '#2D2D3A', padding: 14, borderRadius: 10 }}>
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Сонголт 3: <Text style={{ color: '#3B82F6' }}>28,000 нэгж</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default UnitActionModal;