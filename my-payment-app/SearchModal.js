import { Feather } from '@expo/vector-icons';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SearchModal = ({ visible, onClose, searchQuery, setSearchQuery, searchableItems, recentSearches, setRecentSearches }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F14' }}>
        <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C24', borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: '#2D2D3A' }}>
            <Feather name="search" size={18} color="#9CA3AF" />
            <TextInput
              style={{ flex: 1, padding: 12, color: '#FFF' }}
              placeholder="Үйлчилгээ хайх..."
              placeholderTextColor="#6B7280"
              autoFocus={true}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: '#9CA3AF' }}>Болих</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ paddingHorizontal: 20 }}>
          {searchQuery.length > 0 ? (
            searchableItems
              .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.keywords.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(item => (
                <TouchableOpacity key={item.id} onPress={item.action} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1C1C24' }}>
                  <View style={{ backgroundColor: item.color + '20', padding: 10, borderRadius: 10 }}>
                    <Feather name={item.icon} size={20} color={item.color} />
                  </View>
                  <Text style={{ color: '#FFF', marginLeft: 16, fontSize: 16 }}>{item.title}</Text>
                </TouchableOpacity>
              ))
          ) : (
            recentSearches.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ color: '#9CA3AF', fontSize: 14, fontWeight: 'bold' }}>Сүүлд хайсан</Text>
                  <TouchableOpacity onPress={() => setRecentSearches([])}>
                    <Text style={{ color: '#EF4444', fontSize: 13 }}>Устгах</Text>
                  </TouchableOpacity>
                </View>
                {recentSearches.map((query, index) => (
                  <TouchableOpacity key={index} onPress={() => setSearchQuery(query)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1C1C24' }}>
                    <Feather name="clock" size={16} color="#6B7280" />
                    <Text style={{ color: '#FFF', marginLeft: 16, fontSize: 15 }}>{query}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default SearchModal;