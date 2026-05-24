import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { styles } from './styles';

const AuthScreen = ({ 
  T, 
  authName,
  setAuthName,
  authPhone, 
  setAuthPhone, 
  authPass, 
  setAuthPass, 
  authMode, 
  setAuthMode, 
  handleAuth 
}) => {
  // Анимацийн утгуудыг тохируулах
  const blob1Anim = useRef(new Animated.Value(0)).current;
  const blob2Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Бөмбөлөг 1-ийн хөдөлгөөн (Loop)
    const startBlob1 = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blob1Anim, { toValue: 1, duration: 8000, useNativeDriver: true }),
          Animated.timing(blob1Anim, { toValue: 0, duration: 8000, useNativeDriver: true }),
        ])
      ).start();
    };

    // Бөмбөлөг 2-ийн хөдөлгөөн (Loop)
    const startBlob2 = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blob2Anim, { toValue: 1, duration: 10000, useNativeDriver: true }),
          Animated.timing(blob2Anim, { toValue: 0, duration: 10000, useNativeDriver: true }),
        ])
      ).start();
    };

    startBlob1();
    startBlob2();
  }, []);

  // Interpolation ашиглан байршлыг тодорхойлох
  const blob1Style = {
    transform: [
      { translateX: blob1Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 60] }) },
      { translateY: blob1Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 40] }) },
    ],
  };

  const blob2Style = {
    transform: [
      { translateX: blob2Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -50] }) },
      { translateY: blob2Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -80] }) },
    ],
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#0F0F14' }}
    >
      {/* Хөдөлгөөнт бөмбөлгүүд */}
      <Animated.View style={[styles.bgBlob1, blob1Style]} />
      <Animated.View style={[styles.bgBlob2, blob2Style]} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, justifyContent: 'center', padding: 30 }}>
          <View style={{ alignItems: 'center', marginBottom: 50 }}>
            <View style={styles.headerLogo}>
              <Text style={styles.headerLogoText}>X</Text>
            </View>
            <Text style={{ color: '#FFF', fontSize: 28, fontWeight: 'bold', marginTop: 16 }}>XPAY</Text>
            <Text style={{ color: '#9CA3AF', fontSize: 14, marginTop: 8 }}>{authMode === 'login' ? T.auth.login : T.auth.register}</Text>
          </View>

          <View style={{ gap: 16 }}>
            {authMode === 'register' && (
              <View style={{ backgroundColor: '#1C1C24', borderRadius: 16, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: '#2D2D3A' }}>
                <Feather name="user" size={20} color="#6B7280" />
                <TextInput
                  style={{ flex: 1, padding: 16, color: '#FFF' }}
                  placeholder={T.auth.name}
                  placeholderTextColor="#6B7280"
                  value={authName}
                  onChangeText={setAuthName}
                />
              </View>
            )}

            <View style={{ backgroundColor: '#1C1C24', borderRadius: 16, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: '#2D2D3A' }}>
              <Feather name="phone" size={20} color="#6B7280" />
              <TextInput
                style={{ flex: 1, padding: 16, color: '#FFF' }}
                placeholder={T.auth.phone}
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                value={authPhone}
                onChangeText={setAuthPhone}
                maxLength={8}
              />
            </View>

            <View style={{ backgroundColor: '#1C1C24', borderRadius: 16, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: '#2D2D3A' }}>
              <Feather name="lock" size={20} color="#6B7280" />
              <TextInput
                style={{ flex: 1, padding: 16, color: '#FFF' }}
                placeholder={T.auth.pass}
                placeholderTextColor="#6B7280"
                secureTextEntry
                value={authPass}
                onChangeText={setAuthPass}
              />
            </View>

            <TouchableOpacity onPress={handleAuth} style={{ backgroundColor: '#7C3AED', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 10, shadowColor: '#7C3AED', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 }}>
              <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>{authMode === 'login' ? T.auth.loginBtn : T.auth.registerBtn}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} style={{ alignItems: 'center', marginTop: 10 }}>
              <Text style={{ color: '#9CA3AF' }}>
                {authMode === 'login' ? T.auth.newUser : T.auth.hasAccount}
                <Text style={{ color: '#7C3AED', fontWeight: 'bold' }}>{authMode === 'login' ? T.auth.registerBtn : T.auth.loginBtn}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;