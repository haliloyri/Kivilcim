import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { t } from '../locales/i18n';
import { getNotificationWindowDisplayTime, getNotificationWindowLabel } from '../utils/notifications';

const NotificationPreferences = ({
  selectedReminders,
  reminderOptions,
  onToggleReminder,
  colors,
  lang,
  isDark,
}) => {
  const getFormattedReminderTime = (window) => {
    const label = getNotificationWindowLabel(window, lang);
    const time = getNotificationWindowDisplayTime(window, lang);
    return `${label} (${time})`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Ionicons name="time-outline" size={24} color={colors.textSecondary} />
        <Text style={[styles.title, { color: colors.text }]}>{t('reminderTime', lang)}</Text>
      </View>

      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {t('reminderTimeHint', lang) || 'Select when you'd like to receive daily reminders:'}
      </Text>

      <View style={styles.optionsContainer}>
        {reminderOptions.map((option) => {
          const isSelected = selectedReminders.includes(option.value);
          const displayTime = getFormattedReminderTime(option.value);

          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onToggleReminder(option.value)}
              style={[
                styles.reminderOption,
                {
                  borderColor: isSelected ? colors.primary : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                  backgroundColor: isSelected
                    ? `${colors.primary}15`
                    : isDark
                    ? '#1F1F1F'
                    : '#F8F3EA',
                },
              ]}
            >
              <View style={styles.optionContent}>
                <Text style={[styles.optionIcon]}>{option.icon}</Text>
                <View style={styles.optionText}>
                  <Text style={[styles.optionLabel, { color: colors.text }]}>
                    {getNotificationWindowLabel(option.value, lang)}
                  </Text>
                  <Text style={[styles.optionTime, { color: colors.textSecondary }]}>
                    {displayTime}
                  </Text>
                </View>
              </View>

              {isSelected && (
                <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={[styles.note, { backgroundColor: isDark ? '#1F1F1F' : '#FDF9F3' }]}>
        <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
        <Text style={[styles.noteText, { color: colors.textSecondary }]}>
          {t('reminderNote', lang) || 'You must select at least one time slot for reminders.'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginHorizontal: 12,
    marginBottom: 12,
    lineHeight: 16,
  },
  optionsContainer: {
    gap: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  reminderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    minHeight: 60,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionIcon: {
    fontSize: 24,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 2,
  },
  optionTime: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginHorizontal: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },
  noteText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    flex: 1,
    lineHeight: 16,
  },
});

export default NotificationPreferences;
