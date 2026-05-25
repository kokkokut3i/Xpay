import { Feather } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

const SettingsTab = ({ T, userName, userPhone, addNotification, setCustomAlert, biometricsEnabled, setBiometricsEnabled, appLanguage, setAppLanguage, setActiveAction, setShowAIChat, handleLogout, openInputDialog, handleUpdateName, handleUpdatePassword }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{T.settings.title}</Text>
          <Text style={styles.subGreeting}>{T.settings.subtitle}</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => addNotification('Settings', 'Тохиргоо шинэчлэгдлээ.')}>
          <Feather name="refresh-cw" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Профайл карт */}
      <TouchableOpacity 
        onPress={() => setCustomAlert({ visible: true, message: "Таны хэрэглэгчийн түвшин: АЛТАН ГИШҮҮН ⭐" })}
        style={{ backgroundColor: '#1C1C24', padding: 20, borderRadius: 24, flexDirection: 'row', alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#2D2D3A' }}
      >
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#7C3AED', justifyContent: 'center', alignItems: 'center' }}>
          <Feather name="user" size={32} color="#FFF" />
        </View>
        <View style={{ marginLeft: 16, flex: 1 }}>
          <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>{userName || 'Хэрэглэгч'}</Text>
          <Text style={{ color: '#9CA3AF', fontSize: 14, marginTop: 4 }}>{userPhone} • Алтан гишүүн</Text>
        </View>
        <Feather name="edit-3" size={18} color="#4B5563" />
      </TouchableOpacity>

      {/* Хэрэглэгчийн тохиргоо */}
      <Text style={styles.sectionTitleInternal}>Хувийн мэдээлэл</Text>
      <View style={{ backgroundColor: '#1C1C24', borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: '#2D2D3A', overflow: 'hidden' }}>
        <TouchableOpacity 
          onPress={() => openInputDialog({ 
            visible: true, 
            title: 'Нэр солих', 
            placeholder: 'Шинэ нэрээ оруулна уу', 
            onConfirm: handleUpdateName
          })}
          style={{ flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#2D2D3A' }}
        >
          <View style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: 10, borderRadius: 12, marginRight: 16 }}>
            <Feather name="user" size={20} color="#A5B4FC" />
          </View>
          <Text style={{ color: '#FFF', flex: 1, fontSize: 15, fontWeight: '500' }}>Профайл засах</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => openInputDialog({ 
            visible: true, 
            title: 'Нууц үг солих', 
            placeholder: 'Шинэ нууц үгээ оруулна уу', 
            secureTextEntry: true, 
            onConfirm: handleUpdatePassword
          })}
          style={{ flexDirection: 'row', alignItems: 'center', padding: 18 }}
        >
          <View style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', padding: 10, borderRadius: 12, marginRight: 16 }}>
            <Feather name="key" size={20} color="#F9A8D4" />
          </View>
          <Text style={{ color: '#FFF', flex: 1, fontSize: 15, fontWeight: '500' }}>Нууц үг солих</Text>
        </TouchableOpacity>
      </View>

      {/* Апп тохиргоо */}
      <Text style={styles.sectionTitleInternal}>Аппликейшн</Text>
      <View style={{ backgroundColor: '#1C1C24', borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: '#2D2D3A', overflow: 'hidden' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#2D2D3A' }}>
          <View style={{ backgroundColor: 'rgba(110, 231, 183, 0.1)', padding: 10, borderRadius: 12, marginRight: 16 }}>
            <Feather name="shield" size={20} color="#6EE7B7" />
          </View>
          <Text style={{ color: '#FFF', flex: 1, fontSize: 15, fontWeight: '500' }}>Biometric нэвтрэлт</Text>
          <TouchableOpacity 
            onPress={() => setBiometricsEnabled(!biometricsEnabled)}
            style={{ 
              width: 48, height: 26, borderRadius: 13, 
              backgroundColor: biometricsEnabled ? '#10B981' : '#374151', 
              padding: 2, justifyContent: 'center'
            }}>
            <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFF', alignSelf: biometricsEnabled ? 'flex-end' : 'flex-start' }} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={() => setAppLanguage(appLanguage === 'MN' ? 'EN' : 'MN')}
          style={{ flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#2D2D3A' }}
        >
          <View style={{ backgroundColor: 'rgba(147, 197, 253, 0.1)', padding: 10, borderRadius: 12, marginRight: 16 }}>
            <Feather name="globe" size={20} color="#93C5FD" />
          </View>
          <Text style={{ color: '#FFF', flex: 1, fontSize: 15, fontWeight: '500' }}>Апп-ын хэл</Text>
          <Text style={{ color: '#9CA3AF', marginRight: 8 }}>{appLanguage === 'MN' ? 'Монгол' : 'English'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowAIChat(true)} style={{ flexDirection: 'row', alignItems: 'center', padding: 18 }}>
          <View style={{ backgroundColor: 'rgba(252, 211, 77, 0.1)', padding: 10, borderRadius: 12, marginRight: 16 }}>
            <Feather name="help-circle" size={20} color="#FCD34D" />
          </View>
          <Text style={{ color: '#FFF', flex: 1, fontSize: 15, fontWeight: '500' }}>Тусламж, Санал хүсэлт</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        onPress={handleLogout}
        style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', padding: 18, borderRadius: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginBottom: 40 }}
      >
        <Feather name="log-out" size={20} color="#EF4444" style={{ marginRight: 12 }} />
        <Text style={{ color: '#EF4444', fontSize: 16, fontWeight: 'bold' }}>Системээс гарах</Text>
      </TouchableOpacity>
      <View style={{ height: 80 }} />
    </ScrollView>
  );
};
export default SettingsTab;