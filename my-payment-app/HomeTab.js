import { Feather } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

const ServiceTile = ({ icon, color, title, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={{ 
      width: '48%', 
      backgroundColor: '#1C1C24', 
      borderRadius: 20, 
      padding: 16, 
      marginBottom: 12, 
      flexDirection: 'row', 
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#2D2D3A'
    }}
  >
    <View style={{ backgroundColor: color + '20', padding: 8, borderRadius: 12 }}>
      <Feather name={icon} size={20} color={color} />
    </View>
    <Text style={{ color: '#FFF', marginLeft: 12, fontWeight: '600', fontSize: 14 }}>{title}</Text>
  </TouchableOpacity>
);

const HomeTab = ({ 
  T, 
  userName,
  userPhone,
  mainBalance, 
  mainData, 
  unitBalance, 
  setActiveAction, 
  setCurrentTab, 
  setIsSearching, 
  setShowNotifications,
  setCustomAlert,
  handleSelectPackage
}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.headerLogo}>
            <Text style={styles.headerLogoText}>X</Text>
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.greeting}>{T.home.greeting}</Text>
            <Text style={styles.subGreeting}>{T.home.subtitle}</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => setIsSearching(true)}>
            <Feather name="search" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => setShowNotifications(true)}>
            <Feather name="bell" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.walletCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={styles.walletLabel}>{T.home.mainNum}: {userPhone || '95335501'}</Text>
          <View style={[styles.percentBadge, { backgroundColor: '#10B981' }]}>
            <Text style={styles.percentText}>{T.common.active}</Text>
          </View>
        </View>
        <View style={[styles.balanceRow, { marginBottom: 14 }]}>
          <Text style={styles.balanceText}>₮{mainBalance.toLocaleString()}</Text>
          <Text style={{ color: '#D8B4FE', fontSize: 14, marginLeft: 4, marginBottom: 4 }}>{T.home.balanceLabel}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          <TouchableOpacity 
            style={{ backgroundColor: '#FFF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', elevation: 2 }} 
            onPress={() => setActiveAction('topup')}
          >
            <Feather name="plus" size={16} color="#5B21B6" style={{ marginRight: 6 }} />
            <Text style={{ color: '#5B21B6', fontSize: 13, fontWeight: 'bold' }}>{T.home.topup}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#FFF' }} 
            onPress={() => setActiveAction('transfer')}
          >
            <Feather name="send" size={16} color="#FFF" style={{ marginRight: 6 }} />
            <Text style={{ color: '#FFF', fontSize: 13, fontWeight: 'bold' }}>Шилжүүлэх</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#D8B4FE', fontSize: 12 }}>{T.home.data}</Text>
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold', marginTop: 4 }}>{mainData.toFixed(1)} GB</Text>
          </View>
          <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 8 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#D8B4FE', fontSize: 12 }}>{T.home.units}</Text>
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold', marginTop: 4 }}>{unitBalance.toLocaleString()} ₮</Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: 20 }}>
        <TouchableOpacity style={{ alignItems: 'center', flex: 1 }} onPress={() => setCurrentTab('billing')}>
          <View style={[styles.actionBtn, { backgroundColor: '#1F2937', width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }]}>
            <Feather name="credit-card" size={24} color="#3B82F6" />
          </View>
          <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 8 }}>{T.home.payBill}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', flex: 1 }} onPress={() => setActiveAction('data')}>
          <View style={[styles.actionBtn, { backgroundColor: '#1F2937', width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }]}>
            <Feather name="wifi" size={24} color="#10B981" />
          </View>
          <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 8 }}>{T.home.dataPkg}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', flex: 1 }} onPress={() => setActiveAction('unit')}>
          <View style={[styles.actionBtn, { backgroundColor: '#1F2937', width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }]}>
            <Feather name="zap" size={24} color="#F59E0B" />
          </View>
          <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 8 }}>{T.home.buyUnits}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', flex: 1 }} onPress={() => setActiveAction('more')}>
          <View style={[styles.actionBtn, { backgroundColor: '#1F2937', width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }]}>
            <Feather name="grid" size={24} color="#8B5CF6" />
          </View>
          <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 8 }}>{T.home.more}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{T.home.services}</Text>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <ServiceTile icon="file-text" color="#3B82F6" title="Төлбөр" onPress={() => setCurrentTab('billing')} />
        <ServiceTile icon="wifi" color="#10B981" title="Дата" onPress={() => setActiveAction('data')} />
        <ServiceTile icon="zap" color="#F59E0B" title="Нэгж" onPress={() => setActiveAction('unit')} />
        <ServiceTile icon="smartphone" color="#EC4899" title="Роуминг" onPress={() => setCustomAlert({ visible: true, message: "Олон улсын роуминг үйлчилгээ тун удахгүй." })} />
      </View>

      <Text style={styles.sectionTitleInternal}>{T.home.needed}</Text>
      <TouchableOpacity style={styles.assetCard} onPress={() => setCustomAlert({ visible: true, message: "Гар утасны даатгал үйлчилгээ удахгүй нээгдэнэ." })}>
        <View style={styles.assetLeft}>
          <View style={[styles.assetIcon, { backgroundColor: '#8B5CF6' }]}>
            <Feather name="shield" size={20} color="#FFF" />
          </View>
          <View><Text style={styles.assetName}>{T.home.insurance}</Text><Text style={styles.assetSub}>{T.home.insuranceSub}</Text></View>
        </View>
        <Feather name="plus" size={20} color="#6B7280" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.assetCard} onPress={() => setCustomAlert({ visible: true, message: "Зээлийн үйлчилгээ тун удахгүй нээгдэнэ." })}>
        <View style={styles.assetLeft}>
          <View style={[styles.assetIcon, { backgroundColor: '#10B981' }]}>
            <Feather name="dollar-sign" size={20} color="#FFF" />
          </View>
          <View><Text style={styles.assetName}>{T.home.loan}</Text><Text style={styles.assetSub}>{T.home.loanSub}</Text></View>
        </View>
        <Feather name="chevron-right" size={20} color="#6B7280" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.assetCard} onPress={() => setCustomAlert({ visible: true, message: "Таны цуглуулсан оноо: 1,250" })}>
        <View style={styles.assetLeft}>
          <View style={[styles.assetIcon, { backgroundColor: '#F59E0B' }]}>
            <Feather name="star" size={20} color="#FFF" />
          </View>
          <View><Text style={styles.assetName}>{T.home.loyalty}</Text><Text style={styles.assetSub}>{T.home.loyaltySub}</Text></View>
        </View>
        <Feather name="chevron-right" size={20} color="#6B7280" />
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

export default HomeTab;