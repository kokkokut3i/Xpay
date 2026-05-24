import { Feather } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const DataActionModal = ({ visible, onClose, showPayment, selectedDataPkg, unitBalance, handleSelectPackage, handlePaymentConfirm }) => {
  if (!visible) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 15, 20, 0.96)', zIndex: 999, paddingTop: 60, paddingHorizontal: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Text style={{ color: '#FFF', fontSize: 22, fontWeight: 'bold' }}>
          Дата багц авах
        </Text>
        <TouchableOpacity onPress={onClose} style={{ backgroundColor: '#1F2937', padding: 8, borderRadius: 20 }}>
          <Feather name="x" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Дата багц сонгох хэсэг */}
      {!showPayment && (
        <View style={{ flex: 1, paddingBottom: 20 }}>
          <Text style={{color: '#9CA3AF', marginBottom: 15, fontSize: 14}}>Багцаа сонгоно уу:</Text>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {[
              { gb: 3, name: "3 хоногийн 3GB", price: 3000, desc: "Богино хугацааны хэрэглээнд" },
              { gb: 5, name: "5 хоногийн 5GB", price: 5000, desc: "Аялал зугаалгаар явахад" },
              { gb: 7, name: "7 хоногийн 7GB", price: 7000, desc: "Долоо хоногийн багц" },
              { gb: 15, name: "15 хоногийн 15GB", price: 15000, desc: "Их хэрэглээнд зориулав" },
              { gb: 25, name: "30 хоногийн 25GB", price: 25000, desc: "Сарын хэрэглээ" },
              { gb: 70, name: "30 хоногийн 70GB", price: 65000, desc: "Өндөр хурдны дата" },
              { gb: 99, name: "30 хоногийн 99GB", price: 90000, desc: "Хязгааргүй мэт дата" },
            ].map((pkg, index) => (
              <TouchableOpacity key={index} onPress={() => handleSelectPackage(pkg.gb, pkg.price)} style={{ backgroundColor: '#1F2937', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>{pkg.name}</Text>
                  <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>{pkg.desc}</Text>
                </View>
                <Text style={{ color: '#10B981', fontSize: 16, fontWeight: 'bold' }}>{pkg.price.toLocaleString()} ₮</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Төлбөр төлөх хэсэг */}
      {showPayment && selectedDataPkg && (
        <View>
          <Text style={{color: '#9CA3AF', marginBottom: 15, fontSize: 14}}>Төлбөр төлөх хэлбэрээ сонгоно уу:</Text>

          {/* КАРТААР ТӨЛӨХ ('card' гэж дамжуулна) */}
          <TouchableOpacity onPress={() => handlePaymentConfirm('card')} style={{ backgroundColor: '#3B82F6', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="credit-card" size={20} color="#FFF" style={{ marginRight: 12 }} />
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>Дансаар төлөх</Text>
          </TouchableOpacity>

          {/* НЭГЖЭЭР ТӨЛӨХ ('unit' гэж дамжуулна) */}
          <TouchableOpacity onPress={() => handlePaymentConfirm('unit')} style={{ backgroundColor: '#8B5CF6', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="smartphone" size={20} color="#FFF" style={{ marginRight: 12 }} />
            <View>
              <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>Нэгжээс хасуулах</Text>
              <Text style={{ color: '#D8B4FE', fontSize: 12, marginTop: 2 }}>Нэгжний үлдэгдэл: {unitBalance.toLocaleString()} ₮</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={{ padding: 16, alignItems: 'center', marginTop: 10 }}>
            <Text style={{ color: '#EF4444', fontSize: 15, fontWeight: '500' }}>Буцах</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DataActionModal;