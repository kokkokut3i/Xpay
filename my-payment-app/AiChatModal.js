import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const AiChatModal = ({ visible, onClose, chatMessages, chatInput, setChatInput, onSendMessage }) => {
  const scrollViewRef = useRef();

  if (!visible) return null;

  const suggestions = [
    "Дансны үлдэгдэл шалгах",
    "Дата багц авах",
    "Төлбөр төлөх заавар",
    "Нэгж шилжүүлэх"
  ];

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 15, 20, 0.94)', zIndex: 999, paddingTop: Platform.OS === 'ios' ? 60 : 40 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#7C3AED20', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
            <MaterialCommunityIcons name="robot-outline" size={24} color="#A78BFA" />
          </View>
          <View>
            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>X-Assistant</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 6 }} />
              <Text style={{ color: '#9CA3AF', fontSize: 12 }}>Онлайн байна</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={{ backgroundColor: 'rgba(28, 28, 36, 0.8)', padding: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(45, 45, 58, 0.5)' }}>
          <Feather name="x" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        style={{ flex: 1, paddingHorizontal: 20 }} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {chatMessages.map((msg) => (
          <View key={msg.id} style={{ flexDirection: 'row', marginBottom: 16, alignSelf: msg.sender === 'ai' ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
            {msg.sender === 'ai' && (
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#1C1C24', justifyContent: 'center', alignItems: 'center', marginRight: 8, marginTop: 4 }}>
                <MaterialCommunityIcons name="robot" size={14} color="#A78BFA" />
              </View>
            )}
            <View 
              style={{ 
                backgroundColor: msg.sender === 'ai' ? 'rgba(28, 28, 36, 0.9)' : '#7C3AED', 
                padding: 14, 
                borderRadius: 20, 
                borderTopLeftRadius: msg.sender === 'ai' ? 4 : 20,
                borderBottomRightRadius: msg.sender === 'user' ? 4 : 20,
                borderWidth: msg.sender === 'ai' ? 1 : 0,
                borderColor: '#2D2D3A'
              }}
            >
              <Text style={{ color: '#FFF', fontSize: 15, lineHeight: 22 }}>{msg.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={{ paddingBottom: Platform.OS === 'ios' ? 70 : 100 }}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 20, marginBottom: 12 }}
          keyboardShouldPersistTaps="handled"
        >
          {suggestions.map((text, i) => (
            <TouchableOpacity 
              key={i} 
              onPress={() => {
                setChatInput(text);
              }}
              style={{ backgroundColor: 'rgba(28, 28, 36, 0.8)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, marginRight: 8, borderWidth: 1, borderColor: 'rgba(45, 45, 58, 0.5)' }}
            >
              <Text style={{ color: '#A78BFA', fontSize: 13 }}>{text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ flexDirection: 'row', backgroundColor: 'rgba(28, 28, 36, 0.9)', borderRadius: 24, padding: 8, marginHorizontal: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(45, 45, 58, 0.5)' }}>
        <TextInput
          style={{ color: '#FFF', flex: 1, marginLeft: 8, paddingVertical: 4 }}
          placeholder="AI-аас асуух зүйлээ бичнэ үү..."
          placeholderTextColor="#6B7280"
          value={chatInput}
          onChangeText={setChatInput}
          onSubmitEditing={onSendMessage}
        />
          <TouchableOpacity onPress={onSendMessage} style={{ backgroundColor: '#7C3AED', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
          <Feather name="send" size={16} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
    </KeyboardAvoidingView>
  );
};

export default AiChatModal;