import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

const OverviewTab = ({ T, mainBalance, mainData, unitBalance, activePackage, notificationList, setActiveAction, setCurrentTab, handleSelectPackage, refreshing, onRefresh, setShowNotifications }) => {
  // Бодит өгөгдөл дээр суурилсан идэвхтэй багцуудын жагсаалтыг үүсгэх
  const activeItems = [];

  // 1. Үндсэн дата үлдэгдэл
  if (mainData > 0) {
    activeItems.push({
      id: 'data',
      name: 'Үндсэн дата багц',
      price: `${mainData.toFixed(1)} GB`,
      icon: 'wifi',
      color: '#10B981',
      progress: '100%'
    });
  }

  // 2. Идэвхтэй үндсэн багц (Plan)
  if (activePackage) {
    activeItems.push({
      id: 'plan',
      name: activePackage.name,
      price: T.common.active,
      icon: 'layers',
      color: '#8B5CF6',
      progress: '100%'
    });
  }

  // 3. Нэгж (Хэрэв байгаа бол)
  if (unitBalance > 0) {
    activeItems.push({
      id: 'unit',
      name: 'Нэгж',
      price: `₮${unitBalance.toLocaleString()}`,
      icon: 'zap',
      color: '#F59E0B',
      progress: '100%'
    });
  }

  // Диаграммын бодит өгөгдөл (Жишээ)
  const weeklyData = [
    { day: T.overview.days[0], value: 1.2 },
    { day: T.overview.days[1], value: 2.8 },
    { day: T.overview.days[2], value: 0.9 },
    { day: T.overview.days[3], value: 3.5 }, // Хамгийн өндөр
    { day: T.overview.days[4], value: 2.1 },
    { day: T.overview.days[5], value: 4.2 },
    { day: T.overview.days[6], value: 1.5 },
  ];
  const maxValue = Math.max(...weeklyData.map(d => d.value));

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      style={styles.scrollArea}
      contentContainerStyle={{ paddingBottom: 160 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFF" />
      }
    >
      {/* Overview Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{T.overview.title}</Text>
          <Text style={styles.subGreeting}>{T.overview.stats}</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => setActiveAction('more')}>
          <Feather name="pie-chart" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Нийт хэрэглээний карт - Интерактив болгов */}
      <TouchableOpacity 
        style={styles.overviewSummaryCard}
        onPress={() => setCurrentTab('billing')}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={styles.overviewLabel}>{T.overview.totalData}</Text>
            <Text style={styles.overviewAmount}>{mainData.toFixed(1)} GB</Text>
          </View>
          <View style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: 10, borderRadius: 12 }}>
            <Feather name="activity" size={20} color="#3B82F6" />
          </View>
        </View>
        <Text style={styles.overviewCompareText}>{T.overview.compare} <Text style={{color: '#10B981'}}>+2.4 GB</Text> {T.overview.moreThan}</Text>
      </TouchableOpacity>

      {/* Бодит динамик диаграмм */}
      <Text style={styles.sectionTitleInternal}>{T.overview.weekly}</Text>
      <View style={styles.chartContainer}>
        <View style={styles.barsRow}>
          {weeklyData.map((item, index) => {
            const isPeak = item.value === maxValue;
            // Хамгийн өндөр багана нь 140px байна гэж тооцвол:
            const barHeight = (item.value / maxValue) * 140;
            return (
              <View key={index} style={styles.barWrapper}>
                <View style={[styles.bar, { 
                  height: barHeight, 
                  backgroundColor: isPeak ? '#3B82F6' : 'rgba(139, 92, 246, 0.3)',
                  width: 14,
                  borderRadius: 7
                }]} />
                <Text style={[styles.barLabel, isPeak && { color: '#FFF', fontWeight: 'bold' }]}>{item.day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Дансны бодит үлдэгдлүүд */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 4, marginBottom: 20 }}>
        <View style={{ flex: 1, backgroundColor: '#1C1C24', padding: 16, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#2D2D3A' }}>
          <Text style={{ color: '#9CA3AF', fontSize: 12 }}>{T.home.balanceLabel}</Text>
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold', marginTop: 4 }}>₮{mainBalance.toLocaleString()}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: '#1C1C24', padding: 16, borderRadius: 20, marginLeft: 8, borderWidth: 1, borderColor: '#2D2D3A' }}>
          <Text style={{ color: '#9CA3AF', fontSize: 12 }}>{T.home.units}</Text>
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold', marginTop: 4 }}>₮{unitBalance.toLocaleString()}</Text>
        </View>
      </View>

      {/* Дансны хуулга (Гүйлгээний түүх) - Зайг нь нэмж засав */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 16 }}>
        <Text style={[styles.sectionTitleInternal, { marginTop: 0, marginBottom: 0 }]}>Дансны хуулга</Text>
        {notificationList && notificationList.length > 3 && (
          <TouchableOpacity onPress={() => setShowNotifications(true)}>
            <Text style={{ color: '#3B82F6', fontSize: 13 }}>Бүгдийг харах</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={{ marginBottom: 24, paddingHorizontal: 4 }}>
        {notificationList && notificationList.length > 0 ? (
          notificationList.slice(0, 3).map((item) => (
            <View 
              key={item.id} 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: '#1C1C24', 
                padding: 18, 
                borderRadius: 20, 
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#2D2D3A'
              }}
            >
              <View style={{ backgroundColor: item.color + '15', padding: 10, borderRadius: 14 }}>
                {item.family === 'material' ? (
                  <MaterialCommunityIcons name={item.icon} size={18} color={item.color} />
                ) : (
                  <Feather name={item.icon || 'arrow-up-right'} size={18} color={item.color} />
                )}
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={{ color: '#FFF', fontWeight: '600' }}>{item.title}</Text>
                <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2 }}>{item.desc}</Text>
              </View>
              <Text style={{ color: '#6B7280', fontSize: 11 }}>{item.time}</Text>
            </View>
          ))
        ) : (
          <Text style={{ color: '#6B7280', textAlign: 'center', marginTop: 10 }}>Гүйлгээний түүх одоогоор хоосон байна.</Text>
        )}
      </View>

      {/* Шуурхай үйлдлүүдийн хэсэг */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
        <TouchableOpacity onPress={() => setActiveAction('topup')} style={{ flex: 1, backgroundColor: '#1C1C24', padding: 12, borderRadius: 16, alignItems: 'center', marginRight: 6, borderWidth: 1, borderColor: '#2D2D3A' }}>
          <Feather name="plus-circle" size={20} color="#B265FF" />
          <Text style={{ color: '#FFF', fontSize: 11, marginTop: 6, fontWeight: '500' }}>{T.home.topup}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveAction('data')} style={{ flex: 1, backgroundColor: '#1C1C24', padding: 12, borderRadius: 16, alignItems: 'center', marginHorizontal: 3, borderWidth: 1, borderColor: '#2D2D3A' }}>
          <Feather name="wifi" size={20} color="#10B981" />
          <Text style={{ color: '#FFF', fontSize: 11, marginTop: 6, fontWeight: '500' }}>{T.home.dataPkg}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveAction('unit')} style={{ flex: 1, backgroundColor: '#1C1C24', padding: 12, borderRadius: 16, alignItems: 'center', marginLeft: 6, borderWidth: 1, borderColor: '#2D2D3A' }}>
          <Feather name="zap" size={20} color="#F59E0B" />
          <Text style={{ color: '#FFF', fontSize: 11, marginTop: 6, fontWeight: '500' }}>{T.home.buyUnits}</Text>
        </TouchableOpacity>
      </View>

      {/* Идэвхтэй нэмэлт багцууд */}
      <Text style={styles.sectionTitleInternal}>{T.overview.activePkgs}</Text>
      
      {activeItems.length > 0 ? (
        activeItems.map((pkg) => (
          <TouchableOpacity key={pkg.id} style={styles.categoryCard} onPress={() => pkg.id === 'plan' ? setCurrentTab('billing') : setActiveAction('data')}>
            <View style={[styles.categoryIconBg, { backgroundColor: pkg.color }]}>
              <Feather name={pkg.icon} size={18} color="#FFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <View style={styles.categoryInfoRow}>
                <Text style={styles.categoryName}>{pkg.name}</Text>
                <Text style={styles.categoryPrice}>{pkg.price}</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: pkg.progress, backgroundColor: pkg.color }]} />
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={{ color: '#6B7280', textAlign: 'center', marginTop: 10 }}>Идэвхтэй багц одоогоор байхгүй байна.</Text>
      )}
    </ScrollView>
  );
};

export default OverviewTab;