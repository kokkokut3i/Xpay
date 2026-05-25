import { Feather } from '@expo/vector-icons';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const CustomAlert = ({ visible, message, onClose, buttons }) => {
  if (!visible) return null;

  return (
    <View style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 15, 20, 0.85)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000
    }}>
      <View style={{
        backgroundColor: '#2E1065',
        width: width * 0.82,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#6D28D9',
        shadowColor: '#6D28D9',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10
      }}>
        <View style={{
          backgroundColor: message.toLowerCase().includes('амжилттай') ? '#10B981' : (buttons && buttons.length > 0) ? '#3B82F6' : '#EF4444',
          width: 50, height: 50, borderRadius: 25,
          justifyContent: 'center', alignItems: 'center', marginBottom: 16
        }}>
          <Feather name={message.toLowerCase().includes('амжилттай') ? "check-circle" : (buttons && buttons.length > 0) ? "help-circle" : "alert-circle"} size={28} color="#FFF" />
        </View>
        <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '600', textAlign: 'center', marginBottom: 24, lineHeight: 22 }}>
          {message}
        </Text>
        {buttons && buttons.length > 0 ? (
          <View style={{ flexDirection: 'row', width: '100%', gap: 10 }}>
            {buttons.map((button, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={button.onPress} 
                style={{ 
                  backgroundColor: button.style === 'cancel' ? '#374151' : '#5B21B6', 
                  paddingVertical: 14, flex: 1, borderRadius: 14, alignItems: 'center' 
                }}
              >
                <Text style={{ color: '#FFF', fontSize: 15, fontWeight: 'bold' }}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <TouchableOpacity onPress={onClose} style={{ backgroundColor: '#5B21B6', paddingVertical: 14, width: '100%', borderRadius: 14, alignItems: 'center' }}>
            <Text style={{ color: '#FFF', fontSize: 15, fontWeight: 'bold' }}>Ойлголоо</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomAlert;