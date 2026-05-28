import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
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
  onAuthRequest, // Changed from handleAuth to onAuthRequest
  isProcessing, // Шинээр нэмсэн
  authError, // Шинээр нэмсэн
  canUseBiometric, // Шинээр нэмсэн
  handleBiometricLogin, // Шинээр нэмсэн
}) => {
  // Анимацийн утгуудыг тохируулах
  const blob1Anim = useRef(new Animated.Value(0)).current;
  const blob2Anim = useRef(new Animated.Value(0)).current;
  const blob3Anim = useRef(new Animated.Value(0)).current;
  const errorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (val, duration, delay = 0) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: 1, duration, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration, useNativeDriver: true }),
        ])
      ).start();
    };
    animate(blob1Anim, 12000, 0);
    animate(blob2Anim, 18000, 1000);
    animate(blob3Anim, 15000, 2000);
  }, []);

  useEffect(() => {
    if (authError) {
      Animated.sequence([
        Animated.timing(errorAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(errorAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(errorAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(errorAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [authError]);

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

  const blob3Style = {
    transform: [
      { translateX: blob3Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -70] }) },
      { translateY: blob3Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 100] }) },
      { scale: blob3Anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }) },
    ],
  };

  const toggleMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setAuthName('');
    setAuthPhone('');
    setAuthPass('');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#020617' }} // Илүү гүн хар-цэнхэр
    >
      {/* Сайжруулсан хөдөлгөөнт Mesh Gradient суурь */}
      <Animated.View style={[localStyles.bgBlob, { backgroundColor: '#4C1D95', top: -100, right: -50, opacity: 0.4 }, blob1Style]} />
      <Animated.View style={[localStyles.bgBlob, { backgroundColor: '#1E1B4B', bottom: -100, left: -50, opacity: 0.6 }, blob2Style]} />
      <Animated.View style={[localStyles.bgBlob, { backgroundColor: '#701A75', top: '30%', left: '10%', opacity: 0.3 }, blob3Style]} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 30 }} showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ alignItems: 'center', marginBottom: 50 }}>
              <View style={styles.headerLogo}>
              <Text style={[styles.headerLogoText, { fontStyle: 'normal' }]}>X</Text>
              </View>
            <Text style={[styles.appName, { fontSize: 28 }]}>{T.auth.welcome || 'XPAY'}</Text>
              <Text style={styles.subGreeting}>{authMode === 'login' ? (T.auth.loginSubtitle || 'Нэвтрэх') : (T.auth.registerSubtitle || 'Бүртгүүлэх')}</Text>
            </View>

            <View style={{ gap: 16 }}>
              {authMode === 'register' && (
                <View style={localStyles.inputGroup}>
                  <Feather name="user" size={20} color="#6B7280" style={localStyles.inputIcon} />
                  <TextInput
                    style={localStyles.input}
                    placeholder={T.auth.namePlaceholder || 'Нэр'}
                    placeholderTextColor="#6B7280"
                    value={authName}
                    onChangeText={setAuthName}
                  />
                </View>
              )}

              <View style={localStyles.inputGroup}>
                <Feather name="phone" size={20} color="#6B7280" style={localStyles.inputIcon} />
                <TextInput
                  style={localStyles.input}
                  placeholder={T.auth.phonePlaceholder || 'Утасны дугаар'}
                  placeholderTextColor="#6B7280"
                  keyboardType="number-pad"
                  value={authPhone}
                  onChangeText={setAuthPhone}
                  maxLength={8}
                />
              </View>

              <View style={localStyles.inputGroup}>
                <Feather name="lock" size={20} color="#6B7280" style={localStyles.inputIcon} />
                <TextInput
                  style={localStyles.input}
                  placeholder={T.auth.passPlaceholder || 'Нууц үг'}
                  placeholderTextColor="#6B7280"
                  secureTextEntry
                  value={authPass}
                  onChangeText={setAuthPass}
                />
              </View>

              {authError && (
                <Animated.View style={{ transform: [{ translateX: errorAnim }] }}>
                  <Text style={localStyles.errorText}>{authError}</Text>
                </Animated.View>
              )}

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity 
                  onPress={onAuthRequest} 
                  disabled={isProcessing} 
                  style={[localStyles.authButton, { flex: 1 }, isProcessing && { opacity: 0.7 }]}
                >
                  {isProcessing ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={localStyles.authButtonText}>{authMode === 'login' ? (T.auth.loginBtn || 'Нэвтрэх') : (T.auth.registerBtn || 'Бүртгүүлэх')}</Text>
                  )}
                </TouchableOpacity>
                
                {authMode === 'login' && canUseBiometric && (
                  <TouchableOpacity onPress={handleBiometricLogin} style={localStyles.biometricButton}>
                    <MaterialCommunityIcons name="fingerprint" size={28} color="#FFF" />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity onPress={toggleMode} style={{ alignItems: 'center', marginTop: 24, padding: 8 }}>
                <Text style={localStyles.toggleText}>
                  {authMode === 'login' ? (T.auth.noAccount || 'Шинэ хэрэглэгч үү?') : (T.auth.hasAccount || 'Бүртгэлтэй юу?')}
                  <Text style={{ color: '#7C3AED', fontWeight: 'bold' }}>
                    {' '}{authMode === 'login' ? (T.auth.registerNow || 'Бүртгүүлэх') : (T.auth.loginNow || 'Нэвтрэх')}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const localStyles = {
  bgBlob: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
  },
  inputGroup: {
    backgroundColor: 'rgba(30, 30, 45, 0.7)', // Хагас тунгалаг шилэн эффект
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputIcon: {
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    color: '#FFF',
    fontSize: 16,
  },
  authButton: {
    backgroundColor: '#7C3AED',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  authButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  biometricButton: {
    backgroundColor: '#1C1C24',
    width: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D2D3A',
  },
  toggleText: {
    color: '#9CA3AF',
  },
  errorText: {
    color: '#F87171',
    textAlign: 'center',
    marginTop: 8,
  },
};

export default AuthScreen;