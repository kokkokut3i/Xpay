import { Feather } from '@expo/vector-icons';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const AiChatModal = ({ visible, onClose, chatMessages, chatInput, setChatInput, onSendMessage }) => {
  if (!visible) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#111827', zIndex: 999, paddingTop: 60, paddingHorizontal: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981', marginRight: 8 }} />
          <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Телеком AI Туслах</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={{ backgroundColor: '#1F2937', padding: 8, borderRadius: 20 }}>
          <Feather name="x" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={{ flex: 1, marginBottom: 20 }} showsVerticalScrollIndicator={false}>
        {chatMessages.map((msg) => (
          <View 
            key={msg.id} 
            style={{ 
              backgroundColor: msg.sender === 'ai' ? '#1F2937' : '#7C3AED', 
              padding: 14, 
              borderRadius: 16, 
              maxWidth: '85%', 
              marginBottom: 12, 
              alignSelf: msg.sender === 'ai' ? 'flex-start' : 'flex-end',
              borderTopLeftRadius: msg.sender === 'ai' ? 2 : 16,
              borderBottomRightRadius: msg.sender === 'user' ? 2 : 16,
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 14, lineHeight: 20 }}>{msg.text}</Text>
            {msg.time && <Text style={{ color: '#3B82F6', fontSize: 12, marginTop: 6, fontWeight: '500' }}>{msg.time}</Text>}
          </View>
        ))}
      </ScrollView>

      <View style={{ flexDirection: 'row', backgroundColor: '#1F2937', borderRadius: 16, padding: 12, marginBottom: 30, alignItems: 'center' }}>
        <TextInput
          style={{ color: '#FFF', flex: 1, marginLeft: 8, paddingVertical: 4 }}
          placeholder="AI-аас асуух зүйлээ бичнэ үү..."
          placeholderTextColor="#6B7280"
          value={chatInput}
          onChangeText={setChatInput}
          onSubmitEditing={onSendMessage}
        />
        <TouchableOpacity onPress={onSendMessage} style={{ backgroundColor: '#3B82F6', padding: 8, borderRadius: 12 }}>
          <Feather name="send" size={16} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AiChatModal;