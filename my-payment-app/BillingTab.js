import { Feather } from '@expo/vector-icons';
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

const BillingTab = ({ 
  T, 
  isBillPaid, 
  lastPaymentDate, 
  setActiveAction, 
  refreshing,
  onRefresh,
  handlePayBill, 
  autoPayEnabled, 
  setAutoPayEnabled, 
  setCustomAlert, 
  savedCards,
  activePackage,
  nextPackage,
  handlePackageChange,
  serviceType,
  handleServiceTypeChange
}) => {
  const postpaidPackages = [
    { id: 'M', name: 'M-Plan', price: 19000, data: '15GB', talk: '300min', benefits: ['Social дата хязгааргүй', 'Мессеж хязгааргүй'] },
    { id: 'L', name: 'L-Plan', price: 29000, data: '30GB', talk: '500min', benefits: ['Бүх дата хязгааргүй (хурд хязгаартай)', 'Шөнийн дата хязгааргүй'] },
    { id: 'XL', name: 'XL-Plan', price: 49000, data: '100GB', talk: '1000min', benefits: ['Роуминг дата 1GB', 'IPTV эрх багтсан', 'VIP үйлчилгээ'] },
  ];

  const billAmount = activePackage?.price || 24500;

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFF" />}>
      {/* Толгой хэсэг */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{T.billing?.title || 'Төлбөр'}</Text>
          <Text style={styles.subGreeting}>{T.billing?.subtitle || 'Төлбөрийн мэдээлэл'}</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => setActiveAction('topup')}>
          <Feather name="plus" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Үйлчилгээний төрөл сонгох */}
      <View style={localStyles.tabContainer}>
        <TouchableOpacity 
          style={[localStyles.tabButton, serviceType === 'prepaid' && localStyles.activeTab]} 
          onPress={() => handleServiceTypeChange('prepaid')}
        >
          <Text style={[localStyles.tabText, serviceType === 'prepaid' && localStyles.activeTabText]}>
            {T.billing.prepaid}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[localStyles.tabButton, serviceType === 'postpaid' && localStyles.activeTab]} 
          onPress={() => handleServiceTypeChange('postpaid')}
        >
          <Text style={[localStyles.tabText, serviceType === 'postpaid' && localStyles.activeTabText]}>{T.billing.postpaid}</Text>
        </TouchableOpacity>
      </View>
      {serviceType === 'postpaid' ? (
        <>
      {/* Төлбөрийн үндсэн карт */}
      <View style={[styles.walletCard, { backgroundColor: '#1E1B4B', borderWidth: 1, borderColor: '#4338CA', paddingBottom: 20 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#D8B4FE', fontSize: 13, fontWeight: '500' }}>ЭНЭ САРЫН НЭХЭМЖЛЭХ</Text>
            <View style={{ backgroundColor: isBillPaid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                <Text style={{ color: isBillPaid ? '#10B981' : '#FCA5A5', fontSize: 10, fontWeight: 'bold' }}>
                  {isBillPaid ? 'ТӨЛӨГДСӨН' : 'ТӨЛӨӨГҮЙ'}
                </Text>
            </View>
        </View>
        <Text style={{ color: '#FFF', fontSize: 32, fontWeight: 'bold', marginTop: 8 }}>{isBillPaid ? '₮0' : `₮${billAmount.toLocaleString()}`}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
            <Feather name="calendar" size={12} color={isBillPaid ? '#D8B4FE' : '#FCA5A5'} />
            <Text style={{ color: isBillPaid ? '#D8B4FE' : '#FCA5A5', fontSize: 12, marginLeft: 6, fontWeight: '500' }}>
              {isBillPaid ? `Төлсөн огноо: ${new Date(lastPaymentDate).toLocaleDateString()}` : 'Эцсийн хугацаа: 2026.06.05'}
            </Text>
        </View>

        {/* Төлбөрийн задгай */}
        <View style={{ marginTop: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ color: '#9CA3AF', fontSize: 12 }}>Үндсэн багц (M-Plan)</Text>
                <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '500' }}>₮19,000</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ color: '#9CA3AF', fontSize: 12 }}>Нэмэлт дата (5GB)</Text>
                <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '500' }}>₮4,500</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#9CA3AF', fontSize: 12 }}>Хэрэглээний НӨАТ</Text>
                <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '500' }}>₮1,000</Text>
            </View>
        </View>
        
        {!isBillPaid && (
          <TouchableOpacity 
              style={{ backgroundColor: '#FFF', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 }}
              onPress={() => handlePayBill(billAmount)}
          >
            <Text style={{ color: '#1E1B4B', fontWeight: 'bold', fontSize: 15 }}>{T.billing.payMonthly}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Багц солих хэсэг - Зөвхөн төлбөр төлсөн үед харагдана */}
      {isBillPaid && (
        <View style={{ marginTop: 24 }}>
          <Text style={styles.sectionTitleInternal}>{T.billing.availablePackages}</Text>
          {postpaidPackages.map((pkg) => (
            <View key={pkg.id} style={localStyles.packageCard}>
              <View style={localStyles.packageHeader}>
                <View>
                  <Text style={localStyles.packageName}>{pkg.name}</Text>
                  <Text style={localStyles.packagePrice}>₮{pkg.price.toLocaleString()} / {T.billing.month}</Text>
                </View>
                <TouchableOpacity 
                  style={[localStyles.changeButton, (activePackage?.id === pkg.id || nextPackage?.id === pkg.id) && {backgroundColor: '#374151'}]}
                  onPress={() => handlePackageChange(pkg)}
                  disabled={activePackage?.id === pkg.id || nextPackage?.id === pkg.id}
                >
                  <Text style={[localStyles.changeButtonText, (activePackage?.id === pkg.id || nextPackage?.id === pkg.id) && {color: '#9CA3AF'}]}>
                    {activePackage?.id === pkg.id ? 'Идэвхтэй' : nextPackage?.id === pkg.id ? 'Сонгогдсон' : 'Шилжих'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={localStyles.packageSpecs}>
                <View style={localStyles.specItem}>
                  <Feather name="wifi" size={14} color="#10B981" />
                  <Text style={localStyles.specText}>{pkg.data}</Text>
                </View>
                <View style={localStyles.specItem}>
                  <Feather name="phone" size={14} color="#3B82F6" />
                  <Text style={localStyles.specText}>{pkg.talk}</Text>
                </View>
              </View>
    
              <View style={localStyles.benefitsList}>
                {pkg.benefits.map((benefit, i) => (
                  <View key={i} style={localStyles.benefitItem}>
                    <Feather name="check-circle" size={12} color="#10B981" />
                    <Text style={localStyles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Автомат тохиргоо - Зөвхөн Postpaid үед */}
      <Text style={styles.sectionTitleInternal}>Автомат тохиргоо (Auto-Pay)</Text>
      <View style={{ backgroundColor: '#1C1C24', padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#2D2D3A' }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '600' }}>Төлбөр автомат суутгал</Text>
          <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>Сар бүр нэхэмжлэх гарах үед холбосон картаас автоматаар төлөгдөнө.</Text>
        </View>
        <TouchableOpacity 
          onPress={() => setAutoPayEnabled(!autoPayEnabled)}
          style={{ 
            width: 48, height: 26, borderRadius: 13, 
            backgroundColor: autoPayEnabled ? '#10B981' : '#374151', 
            padding: 2, justifyContent: 'center'
          }}>
          <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFF', alignSelf: autoPayEnabled ? 'flex-end' : 'flex-start' }} />
        </TouchableOpacity>
      </View>

      {/* Өмнөх нэхэмжлэхүүд - Зөвхөн Postpaid үед */}
      {[
          { month: '5-р сар', date: '2026.05.01', amount: '28,000', status: 'Төлөгдсөн', color: '#10B981' },
          { month: '4-р сар', date: '2026.04.01', amount: '32,400', status: 'Төлөгдсөн', color: '#10B981' },
      ].map((item, index) => (
        <TouchableOpacity key={index} style={styles.categoryCard} onPress={() => setCustomAlert({ visible: true, message: `${item.month}ын төлбөр төлөгдсөн байна.` })}>
            <View style={[styles.categoryIconBg, { backgroundColor: '#374151' }]}><Feather name="file-text" size={18} color="#FFF" /></View>
            <View style={{ flex: 1, marginLeft: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View><Text style={styles.categoryName}>{item.month}ын төлбөр</Text><Text style={{ color: item.color, fontSize: 11, marginTop: 2 }}>{item.status}</Text></View>
                <View style={{ alignItems: 'flex-end' }}><Text style={{ color: '#FFF', fontWeight: 'bold' }}>₮{item.amount}</Text></View>
            </View>
        </TouchableOpacity>
      ))}
      </>
      ) : (
        <View style={localStyles.prepaidContainer}>
          <View style={localStyles.prepaidCard}>
            <Feather name="zap" size={40} color="#F59E0B" />
            <Text style={localStyles.prepaidTitle}>Таны үйлчилгээ хэвийн байна</Text>
            <Text style={localStyles.prepaidDesc}>Урьдчилсан төлбөрт үйлчилгээнд сар бүр төлбөр төлөх шаардлагагүй. Та дансаа цэнэглэж хэрэглээгээ хянана уу.</Text>
            <TouchableOpacity 
              style={localStyles.topupButton}
              onPress={() => setActiveAction('topup')}
            >
              <Text style={localStyles.topupButtonText}>Данс цэнэглэх</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Картууд */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={[styles.sectionTitleInternal, { marginTop: 0, marginBottom: 0 }]}>Миний картууд</Text>
        <TouchableOpacity onPress={() => setActiveAction('topup')}>
            <Text style={{ color: '#3B82F6', fontSize: 13 }}>Нэмэх</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {savedCards && savedCards.length > 0 ? (
            savedCards.map(card => (
              <View key={card.id} style={{ backgroundColor: '#1F2937', width: 180, height: 100, borderRadius: 16, padding: 16, marginRight: 12, justifyContent: 'space-between', borderWidth: 1, borderColor: card.color || '#374151' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Feather name="credit-card" size={20} color={card.color || "#FFF"} />
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>{card.bank.toUpperCase()}</Text>
                </View>
                <Text style={{ color: '#FFF', fontSize: 14, letterSpacing: 2 }}>**** {card.number}</Text>
              </View>
            ))
          ) : (
            <Text style={{ color: '#6B7280', fontSize: 13, marginLeft: 4 }}>Хадгалсан карт байхгүй.</Text>
          )}
      </ScrollView>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1C1C24',
    borderRadius: 16,
    padding: 4,
    marginHorizontal: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2D2D3A',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#2D2D3A',
  },
  tabText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFF',
  },
  packageCard: {
    backgroundColor: '#1C1C24',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#2D2D3A',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  packageName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  packagePrice: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  changeButton: {
    backgroundColor: '#3B82F620',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  changeButtonText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: 'bold',
  },
  packageSpecs: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 20,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  prepaidContainer: {
    paddingHorizontal: 4,
    marginBottom: 20,
  },
  prepaidCard: {
    backgroundColor: '#1C1C24',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D2D3A',
  },
  prepaidTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  prepaidDesc: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
    fontSize: 14,
  },
  topupButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  topupButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  // Багц солих
  packageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C24',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPackage: {
    borderColor: '#7C3AED',
  },
  packageDesc: { color: '#9CA3AF', fontSize: 12, marginTop: 4 },
  nextPackageInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: 14, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.3)' },
  nextPackageText: { color: '#FFF', marginLeft: 10, fontWeight: '600' },
});

export default BillingTab;