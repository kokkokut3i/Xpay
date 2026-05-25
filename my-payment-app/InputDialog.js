import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

const InputDialog = ({ visible, title, placeholder, secureTextEntry = false, onCancel, onConfirm }) => {
  const [inputValue, setInputValue] = useState('');

  if (!visible) return null;

  const handleConfirm = () => {
    onConfirm(inputValue);
    setInputValue('');
  };

  const handleCancel = () => {
    onCancel();
    setInputValue('');
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#6B7280"
            value={inputValue}
            onChangeText={setInputValue}
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handleCancel} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Цуцлах</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={[styles.button, styles.confirmButton]}>
              <Text style={[styles.buttonText, { color: '#FFF' }]}>Хадгалах</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 15, 20, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: '#1C1C24',
    width: width * 0.85,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2D2D3A',
  },
  title: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  input: { backgroundColor: '#111827', borderRadius: 12, padding: 14, color: '#FFF', fontSize: 15, borderWidth: 1, borderColor: '#374151', marginBottom: 20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  button: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  cancelButton: { backgroundColor: '#374151' },
  confirmButton: { backgroundColor: '#7C3AED' },
  buttonText: { color: '#D1D5DB', fontWeight: 'bold' },
});

export default InputDialog;