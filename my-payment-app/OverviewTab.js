import { Feather } from '@expo/vector-icons';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

// Жишээ болгож: Энэ өгөгдлийг API эсвэл props-оор авах нь зүйтэй.
const MOCK_ACTIVE_PACKAGES = [
  { name: 'Social багц (30 хоног)', price: '2.5 GB', icon: 'facebook', color: '#3B82F6', progress: '80%' },
  { name: 'Шөнийн хязгааргүй', price: '3 хоног', icon: 'moon', color: '#8B5CF6', progress: '30%' },
  { name: 'Youtube багц', price: '500 MB', icon: 'youtube', color: '#F43F5E', progress: '15%' },
];


const OverviewTab = ({ T, mainBalance, mainData, unitBalance, notificationList, setActiveAction, setCurrentTab, handleSelectPackage, refreshing, onRefresh }) => {
  return (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      style={styles.scrollArea}
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
      <Text style={[styles.sectionTitleInternal, { marginTop: 24, marginBottom: 16 }]}>Дансны хуулга</Text>
      <View style={{ marginBottom: 24, paddingHorizontal: 4 }}>
        {notificationList && notificationList.length > 0 ? (
          notificationList.map((item) => (
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
                <Feather name={item.icon || 'arrow-up-right'} size={18} color={item.color} />
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

      {/* График хэсэг (Дата хэрэглээгээр) */}
      <Text style={styles.sectionTitleInternal}>{T.overview.weekly}</Text>
      <View style={styles.chartContainer}>
        <View style={styles.barsRow}>
          {T.overview.days.map((day, index) => {
            const heights = [60, 110, 40, 140, 90, 75, 50];
            const isPeak = index === 3;
            return (
              <View key={index} style={styles.barWrapper}>
                <View style={[styles.bar, { height: heights[index], backgroundColor: isPeak ? '#3B82F6' : 'rgba(139, 92, 246, 0.3)' }]} />
                <Text style={[styles.barLabel, isPeak && { color: '#FFF' }]}>{day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Танд санал болгох багц */}
      <Text style={styles.sectionTitleInternal}>{T.overview.recommend}</Text>
      <TouchableOpacity 
        onPress={() => handleSelectPackage(7, 7000)}
        style={{ backgroundColor: '#1E1B4B', padding: 18, borderRadius: 20, borderLeftWidth: 4, borderLeftColor: '#10B981', marginBottom: 5 }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: '#10B981', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 }}>MOST POPULAR</Text>
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold', marginTop: 4 }}>7GB / 7 Хоног</Text>
          </View>
          <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}>
            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>₮7,000</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Идэвхтэй нэмэлт багцууд */}
      <Text style={styles.sectionTitleInternal}>{T.overview.activePkgs}</Text>
      
      {MOCK_ACTIVE_PACKAGES.map((pkg, idx) => (
        <TouchableOpacity key={idx} style={styles.categoryCard} onPress={() => setActiveAction('data')}>
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
      ))}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

export default OverviewTab;