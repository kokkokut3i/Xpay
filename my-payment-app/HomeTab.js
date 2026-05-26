import { Feather } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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

const promoPackages = [
  { id: 'p1', type: 'data', gb: 1, price: 1000, title: '1GB / 24 Цаг', color: '#10B981', icon: 'wifi' },
  { id: 'p2', type: 'data', gb: 5, price: 4500, title: '5GB / 7 Хоног', color: '#3B82F6', icon: 'wifi' },
  { id: 'p3', type: 'unit', amount: 5000, price: 5000, title: '5,000 Нэгж', color: '#F59E0B', icon: 'zap' },
  { id: 'p4', type: 'unit', amount: 10000, price: 10000, title: '10,000 Нэгж', color: '#EC4899', icon: 'zap' },
  { id: 'p5', type: 'data', gb: 15, price: 15000, title: '15GB / 30 Хоног', color: '#8B5CF6', icon: 'wifi' },
];

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
  setShowAllServices,
  setCustomAlert,
  handleSelectPackage,
  refreshing,
  onRefresh
}) => {
  const randomPromos = useMemo(() => {
    // Санамсаргүйгээр хольж, эхний 3-ыг харуулна
    return [...promoPackages].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#0F0F14' }}>
      {/* Хөдөлгөөнгүй байх толгой хэсэг */}
      <View style={[styles.header, { paddingHorizontal: 20, paddingTop: 0, paddingBottom: 0, backgroundColor: '#0F0F14' }]}>
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

      {/* Гүйдэг контент хэсэг */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: 160 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFF" />
        }>
        <View style={{ paddingHorizontal: 0 }}>
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
        <TouchableOpacity style={{ alignItems: 'center', flex: 1 }} onPress={() => setShowAllServices(true)}>
          <View style={[styles.actionBtn, { backgroundColor: '#1F2937', width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }]}>
            <Feather name="grid" size={24} color="#8B5CF6" />
          </View>
          <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 8 }}>{T.home.more}</Text>
        </TouchableOpacity>
      </View>

      {/* Танд зориулсан багцууд (Horizontal Promo Cards) */}
      <View style={styles.promoContainer}>
        <View style={[styles.sectionHeader, { paddingHorizontal: 20 }]}>
          <Text style={styles.sectionTitle}>{T.home.specialOffers}</Text>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.promoScroll}
        >
          {randomPromos.map((pkg) => (
            <TouchableOpacity 
              key={pkg.id} 
              style={[styles.promoCard, { backgroundColor: pkg.color + '15', borderColor: pkg.color + '30' }]}
              onPress={() => {
                if (pkg.type === 'data') {
                  handleSelectPackage(pkg.gb, pkg.price);
                } else {
                  setActiveAction('unit');
                }
              }}
            >
              <View style={[styles.promoIconContainer, { backgroundColor: pkg.color + '20' }]}>
                <Feather name={pkg.icon} size={18} color={pkg.color} />
              </View>
              <Text style={styles.promoTitle}>{pkg.title}</Text>
              <Text style={styles.promoPrice}>₮{pkg.price.toLocaleString()}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{T.home.services}</Text>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <ServiceTile icon="file-text" color="#3B82F6" title="Төлбөр" onPress={() => setCurrentTab('billing')} />
        <ServiceTile icon="wifi" color="#10B981" title="Дата" onPress={() => setActiveAction('data')} />
        <ServiceTile icon="zap" color="#F59E0B" title="Нэгж" onPress={() => setActiveAction('unit')} />
      </View>

        </View>
      </ScrollView>
    </View>
  );
};

export default HomeTab;