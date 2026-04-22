import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useApp, Task } from '../context/AppContext';

type Filter = 'tümü' | 'aktif' | 'tamamlanan' | 'yüksek' | 'orta' | 'düşük';

const PRIORITY_COLORS = {
  yüksek: '#EF4444',
  orta: '#F59E0B',
  düşük: '#22C55E',
};

const PRIORITY_LABELS = { yüksek: 'Yüksek', orta: 'Orta', düşük: 'Düşük' };

export default function TasksScreen() {
  const { tasks, addTask, toggleTask, deleteTask, colors } = useApp();
  const [taskInput, setTaskInput] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('orta');
  const [filter, setFilter] = useState<Filter>('tümü');
  const [search, setSearch] = useState('');

  const filteredTasks = useMemo(() => {
    let list = tasks;
    if (filter === 'aktif') list = list.filter((t) => !t.completed);
    if (filter === 'tamamlanan') list = list.filter((t) => t.completed);
    if (filter === 'yüksek' || filter === 'orta' || filter === 'düşük') {
      list = list.filter((t) => t.priority === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q));
    }
    return list;
  }, [tasks, filter, search]);

  const completedCount = tasks.filter((t) => t.completed).length;

  const handleAdd = () => {
    if (!taskInput.trim()) return;
    addTask({ title: taskInput.trim(), completed: false, priority });
    setTaskInput('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Görevler</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>Yapılacak işlerini yönet</Text>

      {/* Tik açıklaması */}
      <View style={[styles.tipBox, { backgroundColor: colors.cardAlt, borderLeftColor: colors.accent }]}>
        <Text style={[styles.tipTitle, { color: colors.accent }]}>✓ Tik işareti</Text>
        <Text style={[styles.tipText, { color: colors.textMuted }]}>
          Kutuya tıklayarak görevi tamamlanmış işaretleyebilirsin. Tamamlanan görevler İstatistik
          sayfasındaki "Biten Görev" sayısına eklenir ve üzeri çizili gösterilir.
        </Text>
      </View>

      {/* Arama */}
      <TextInput
        style={[styles.searchInput, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="Görev ara..."
        placeholderTextColor={colors.textMuted}
        value={search}
        onChangeText={setSearch}
      />

      {/* Görev ekleme */}
      <View style={styles.inputSection}>
        <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Yeni görev ekle (öncelik seç):</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="Yeni görev ekle..."
          placeholderTextColor={colors.textMuted}
          value={taskInput}
          onChangeText={setTaskInput}
        />
        <View style={styles.priorityRow}>
          {(['düşük', 'orta', 'yüksek'] as const).map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.priorityChip,
                { backgroundColor: colors.accentSoft },
                priority === p && { backgroundColor: PRIORITY_COLORS[p] },
              ]}
              onPress={() => setPriority(p)}
            >
              <Text
                style={[
                  styles.priorityChipText,
                  { color: colors.textMuted },
                  priority === p && styles.priorityChipActive,
                ]}
              >
                {PRIORITY_LABELS[p]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.accent }]} onPress={handleAdd}>
          <Text style={[styles.addButtonText, { color: colors.tabTextActive }]}>Ekle</Text>
        </TouchableOpacity>
      </View>

      {/* Özet ve filtre */}
      <View style={styles.toolbar}>
        <Text style={[styles.summaryText, { color: colors.textMuted }]}>
          Toplam: {tasks.length} | Tamamlanan: {completedCount}
        </Text>
        <Text style={[styles.filterLabel, { color: colors.textMuted }]}>Filtrele:</Text>
        <View style={styles.filterRow}>
          {(['tümü', 'aktif', 'tamamlanan'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                { backgroundColor: colors.card },
                filter === f && { backgroundColor: colors.accent },
              ]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: colors.textMuted },
                  filter === f && styles.filterChipTextActive,
                ]}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.filterLabel, { color: colors.textMuted }]}>Önceliğe göre:</Text>
        <View style={styles.filterRow}>
          {(['yüksek', 'orta', 'düşük'] as const).map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.filterChip,
                { backgroundColor: colors.card },
                filter === p && { backgroundColor: PRIORITY_COLORS[p] },
              ]}
              onPress={() => setFilter(filter === p ? 'tümü' : p)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filter === p && styles.filterChipTextActive,
                ]}
              >
                {PRIORITY_LABELS[p]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        renderItem={({ item }) => (
          <View style={[styles.taskCard, { backgroundColor: colors.card }, item.completed && styles.taskCardDone]}>
            <TouchableOpacity
              style={styles.taskLeft}
              onPress={() => toggleTask(item.id)}
            >
              <View style={[styles.checkbox, { borderColor: colors.accent }, item.completed && styles.checkboxDone]}>
                {item.completed && <Text style={[styles.checkmark, { color: colors.tabTextActive }]}>✓</Text>}
              </View>
              <View style={styles.taskBody}>
                <Text style={[styles.taskText, { color: colors.text }, item.completed && styles.taskTextDone]}>
                  {item.title}
                </Text>
                <View style={styles.taskMeta}>
                  <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS[item.priority] }]}>
                    <Text style={styles.priorityBadgeText}>{PRIORITY_LABELS[item.priority]}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={[styles.deleteText, { color: '#F87171' }]}>Sil</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            {search || filter !== 'tümü'
              ? 'Bu filtreye uygun görev bulunamadı.'
              : 'Henüz görev eklenmedi.'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#081120', paddingHorizontal: 20, paddingTop: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#F8FAFC', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#A5B4CC', marginBottom: 12 },
  tipBox: {
    backgroundColor: '#0F1A2B',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#14B8A6',
  },
  tipTitle: { color: '#14B8A6', fontSize: 14, fontWeight: '700', marginBottom: 6 },
  tipText: { color: '#94A3B8', fontSize: 13, lineHeight: 20 },
  searchInput: {
    backgroundColor: '#132034',
    color: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  inputSection: { marginBottom: 16 },
  inputLabel: { color: '#94A3B8', fontSize: 13, marginBottom: 8 },
  input: {
    backgroundColor: '#132034',
    color: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 10,
  },
  priorityRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  priorityChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#1E293B',
  },
  priorityChipText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  priorityChipActive: { color: '#fff' },
  addButton: {
    backgroundColor: '#14B8A6',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonText: { color: '#062C2C', fontWeight: '700', fontSize: 15 },
  toolbar: { marginBottom: 16 },
  summaryText: { color: '#94A3B8', fontSize: 13, marginBottom: 8 },
  filterLabel: { color: '#64748B', fontSize: 12, marginBottom: 6, marginTop: 8 },
  filterRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#132034',
  },
  filterChipActive: { backgroundColor: '#14B8A6' },
  filterChipText: { color: '#94A3B8', fontSize: 13 },
  filterChipTextActive: { color: '#062C2C', fontWeight: '700' },
  listContent: { paddingBottom: 100 },
  taskCard: {
    backgroundColor: '#132034',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskCardDone: { opacity: 0.8 },
  taskLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#14B8A6',
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: '#14B8A6' },
  checkmark: { color: '#062C2C', fontWeight: '800', fontSize: 14 },
  taskBody: { flex: 1 },
  taskText: { color: '#F8FAFC', fontSize: 15 },
  taskTextDone: { textDecorationLine: 'line-through', color: '#64748B' },
  taskMeta: { flexDirection: 'row', marginTop: 6, gap: 8 },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  priorityBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  deleteText: { color: '#F87171', fontWeight: '600', fontSize: 14 },
  emptyText: { color: '#64748B', fontSize: 15, marginTop: 20 },
});
