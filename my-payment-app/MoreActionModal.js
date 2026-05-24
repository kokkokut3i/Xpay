import { Feather } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const MoreActionModal = ({ visible, onClose, setCustomAlert }) => {
  if (!visible) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 15, 20, 0.96)', zIndex: 999, paddingTop: 60, paddingHorizontal: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Text style={{ color: '#FFF', fontSize: 22, fontWeight: 'bold' }}>
          Нэмэлт үйлчилгээ
        </Text>
        <TouchableOpacity onPress={onClose} style={{ backgroundColor: '#1F2937', padding: 8, borderRadius: 20 }}>
          <Feather name="x" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{ color: '#9CA3AF', marginBottom: 12, fontSize: 14, fontWeight: '500' }}>Урамшуулал ба бэлэг</Text>
          
          <TouchableOpacity 
            onPress={() => setCustomAlert({ visible: true, message: "Танд өнөөдрийн 500MB дата бонус орлоо! 🎉" })}
            style={{ backgroundColor: '#1F2937', borderRadius: 20, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center' }}
          >
            <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: 12, borderRadius: 14 }}>
              <Feather name="gift" size={24} color="#10B981" />
            </View>
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>Өдөр бүр бонус</Text>
              <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>Дата болон нэгж хожих боломж</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#4B5563" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setCustomAlert({ visible: true, message: "Найзаа урьж 1GB дата аваарай. Таны код: XPAY99" })}
            style={{ backgroundColor: '#1F2937', borderRadius: 20, padding: 16, marginBottom: 24, flexDirection: 'row', alignItems: 'center' }}
          >
            <View style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', padding: 12, borderRadius: 14 }}>
              <Feather name="users" size={24} color="#3B82F6" />
            </View>
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>Найзаа урих</Text>
              <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>1GB дата бэлгэнд аваарай</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#4B5563" />
          </TouchableOpacity>

          <Text style={{ color: '#9CA3AF', marginBottom: 12, fontSize: 14, fontWeight: '500' }}>Нэмэлт үйлчилгээ</Text>

          {[
            { name: "Hi-Tone", icon: "music", color: "#FCA5A5", desc: "Дуут дохионы оронд ая эгшиглүүлэх" },
            { name: "X-News", icon: "globe", color: "#93C5FD", desc: "Шуурхай мэдээ мэдээлэл хүлээн авах" },
            { name: "Entertainment", icon: "play-circle", color: "#FCD34D", desc: "Кино, контент үзэх эрх" },
          ].map((item, idx) => (
            <TouchableOpacity 
              key={idx}
              onPress={() => setCustomAlert({ visible: true, message: `${item.name} үйлчилгээ тун удахгүй нээгдэнэ.` })}
              style={{ backgroundColor: '#1C1C24', borderRadius: 18, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#2D2D3A' }}
            >
              <View style={{ backgroundColor: '#2D2D3A', padding: 10, borderRadius: 12 }}>
                <Feather name={item.icon} size={20} color={item.color} />
              </View>
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '600' }}>{item.name}</Text>
                <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>{item.desc}</Text>
              </View>
              <Feather name="plus" size={18} color="#4B5563" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default MoreActionModal;