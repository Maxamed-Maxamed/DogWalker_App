/* eslint-disable @typescript-eslint/no-unused-vars */
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { calculateWalkPrice, formatDuration, useBookingStore, WalkDuration } from '@/stores/bookingStore';
import { usePetStore } from '@/stores/petStore';
import { useWalkerStore } from '@/stores/walkerStore';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type BookingStep = 'pets' | 'duration' | 'datetime' | 'details' | 'payment' | 'confirm';

export default function BookWalkScreen() {
  const { walkerId } = useLocalSearchParams<{ walkerId: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const { getWalkerById } = useWalkerStore();
  const { pets } = usePetStore();
  const {
    currentBooking,
    startBooking,
    updateBookingDetails,
    clearCurrentBooking,
    createBooking,
    paymentMethods,
    emergencyContacts,
    isLoading,
  } = useBookingStore();

  const [currentStep, setCurrentStep] = useState<BookingStep>('pets');
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<WalkDuration>(60);
  const [isInstantBook, setIsInstantBook] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [selectedEmergencyContact, setSelectedEmergencyContact] = useState('');

  const walker = walkerId ? getWalkerById(walkerId) : null;

  useEffect(() => {
    if (walker) {
      startBooking(walker.id, walker.displayName, walker.avatar);
    }
  }, [walker, startBooking]);

  useEffect(() => {
    if (paymentMethods.length > 0 && !selectedPaymentMethod) {
      const defaultMethod = paymentMethods.find((pm) => pm.isDefault);
      setSelectedPaymentMethod(defaultMethod?.id || paymentMethods[0].id);
    }
  }, [paymentMethods]);

  const durations: WalkDuration[] = [30, 45, 60, 90, 120];

  const totalPrice = walker ? calculateWalkPrice(selectedDuration, walker.pricePerHour) : 0;

  const handlePetToggle = (petId: string) => {
    setSelectedPets((prev) =>
      prev.includes(petId) ? prev.filter((id) => id !== petId) : [...prev, petId]
    );
  };

  const handleNext = () => {
    const steps: BookingStep[] = ['pets', 'duration', 'datetime', 'details', 'payment', 'confirm'];
    const currentIndex = steps.indexOf(currentStep);
    
    // Validation
    if (currentStep === 'pets' && selectedPets.length === 0) {
      Alert.alert('Select Pets', 'Please select at least one pet for the walk.');
      return;
    }

    if (currentStep === 'datetime' && !isInstantBook) {
      if (!selectedTime) {
        Alert.alert('Select Time', 'Please select a time for the walk.');
        return;
      }
    }

    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: BookingStep[] = ['pets', 'duration', 'datetime', 'details', 'payment', 'confirm'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    } else {
      router.back();
    }
  };

  const handleConfirmBooking = async () => {
    if (!walker) return;

    const selectedPetObjects = pets.filter((p) => selectedPets.includes(p.id));
    const bookingDetails = {
      walkerId: walker.id,
      walkerName: walker.displayName,
      walkerAvatar: walker.avatar,
      petIds: selectedPets,
      petNames: selectedPetObjects.map((p) => p.name),
      duration: selectedDuration,
      scheduledDate: isInstantBook ? new Date() : selectedDate,
      scheduledTime: isInstantBook ? 'ASAP' : selectedTime,
      isInstantBook,
      specialInstructions: specialInstructions || undefined,
      emergencyContactId: selectedEmergencyContact || undefined,
      paymentMethodId: selectedPaymentMethod,
      totalPrice,
      address: '123 Main St, New York, NY 10001', // In production, get from user profile
    };

    try {
      const bookingId = await createBooking(bookingDetails);
      Alert.alert(
        'Booking Confirmed!',
        `Your walk with ${walker.displayName} has been booked successfully.`,
        [
          {
            text: 'View Booking',
            onPress: () => router.push('/walks' as any),
          },
          {
            text: 'Done',
            onPress: () => router.push('/(tabs)' as any),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Booking Failed', 'Unable to create booking. Please try again.');
    }
  };

  if (!walker) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Walker not found</Text>
      </SafeAreaView>
    );
  }

  const renderStepIndicator = () => {
    const steps: BookingStep[] = ['pets', 'duration', 'datetime', 'details', 'payment', 'confirm'];
    const currentIndex = steps.indexOf(currentStep);

    return (
      <View style={styles.stepIndicator}>
        {steps.map((step, index) => (
          <View key={step} style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                index <= currentIndex && styles.stepCircleActive,
              ]}
            >
              {index < currentIndex ? (
                <Ionicons name="checkmark" size={16} color="#fff" />
              ) : (
                <Text style={styles.stepNumber}>{index + 1}</Text>
              )}
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  index < currentIndex && styles.stepLineActive,
                ]}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderPetSelection = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Select Your Pet(s)</Text>
      <Text style={[styles.stepSubtitle, { color: colors.tabIconDefault }]}>
        Choose which pet(s) will go on this walk
      </Text>

      {pets.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="paw-outline" size={64} color={colors.tabIconDefault} />
          <Text style={[styles.emptyText, { color: colors.text }]}>No pets added yet</Text>
          <TouchableOpacity
            style={styles.addPetButton}
            onPress={() => router.push('/pets/add')}
          >
            <Text style={styles.addPetButtonText}>Add Your First Pet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.petList}>
          {pets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              style={[
                styles.petCard,
                selectedPets.includes(pet.id) && styles.petCardSelected,
              ]}
              onPress={() => handlePetToggle(pet.id)}
            >
              <Image source={{ uri: pet.photo_url || 'https://via.placeholder.com/60' }} style={styles.petImage} />
              <View style={styles.petInfo}>
                <Text style={[styles.petName, { color: colors.text }]}>{pet.name}</Text>
                <Text style={[styles.petBreed, { color: colors.tabIconDefault }]}>
                  {pet.breed} • {pet.age} {pet.age === 1 ? 'year' : 'years'}
                </Text>
              </View>
              {selectedPets.includes(pet.id) && (
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderDurationSelection = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Walk Duration</Text>
      <Text style={[styles.stepSubtitle, { color: colors.tabIconDefault }]}>
        How long should the walk be?
      </Text>

      <View style={styles.durationGrid}>
        {durations.map((duration) => {
          const price = calculateWalkPrice(duration, walker.pricePerHour);
          return (
            <TouchableOpacity
              key={duration}
              style={[
                styles.durationCard,
                selectedDuration === duration && styles.durationCardSelected,
              ]}
              onPress={() => setSelectedDuration(duration)}
            >
              <Text style={[styles.durationTime, { color: colors.text }]}>
                {formatDuration(duration)}
              </Text>
              <Text style={[styles.durationPrice, { color: colors.tabIconDefault }]}>
                ${price.toFixed(2)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderDateTimeSelection = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>When?</Text>
      <Text style={[styles.stepSubtitle, { color: colors.tabIconDefault }]}>
        Choose when you `&apos;`d like the walk
      </Text>

      <View style={styles.bookingTypeContainer}>
        <TouchableOpacity
          style={[
            styles.bookingTypeCard,
            isInstantBook && styles.bookingTypeCardSelected,
          ]}
          onPress={() => setIsInstantBook(true)}
        >
          <Ionicons name="flash" size={32} color={isInstantBook ? '#10B981' : colors.tabIconDefault} />
          <Text style={[styles.bookingTypeTitle, { color: colors.text }]}>Book Now</Text>
          <Text style={[styles.bookingTypeDesc, { color: colors.tabIconDefault }]}>
            Start within 30 minutes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.bookingTypeCard,
            !isInstantBook && styles.bookingTypeCardSelected,
          ]}
          onPress={() => setIsInstantBook(false)}
        >
          <Ionicons name="calendar" size={32} color={!isInstantBook ? '#0a7ea4' : colors.tabIconDefault} />
          <Text style={[styles.bookingTypeTitle, { color: colors.text }]}>Schedule</Text>
          <Text style={[styles.bookingTypeDesc, { color: colors.tabIconDefault }]}>
            Pick a date & time
          </Text>
        </TouchableOpacity>
      </View>

      {!isInstantBook && (
        <View style={styles.dateTimeInputs}>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.text} />
            <Text style={[styles.dateTimeButtonText, { color: colors.text }]}>
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="time-outline" size={20} color={colors.text} />
            <Text style={[styles.dateTimeButtonText, { color: colors.text }]}>
              {selectedTime || 'Select time'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setSelectedDate(date);
              }}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="time"
              display="default"
              onChange={(event, date) => {
                setShowTimePicker(false);
                if (date) {
                  const timeStr = date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  });
                  setSelectedTime(timeStr);
                }
              }}
            />
          )}
        </View>
      )}
    </View>
  );

  const renderDetails = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Walk Details</Text>
      <Text style={[styles.stepSubtitle, { color: colors.tabIconDefault }]}>
        Add any special instructions
      </Text>

      <TextInput
        style={[styles.textArea, { color: colors.text, borderColor: '#E5E7EB' }]}
        placeholder="E.g., Max loves the park, Bella needs to avoid other dogs..."
        placeholderTextColor={colors.tabIconDefault}
        value={specialInstructions}
        onChangeText={setSpecialInstructions}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Emergency Contact</Text>
      {emergencyContacts.map((contact) => (
        <TouchableOpacity
          key={contact.id}
          style={[
            styles.contactCard,
            selectedEmergencyContact === contact.id && styles.contactCardSelected,
          ]}
          onPress={() => setSelectedEmergencyContact(contact.id)}
        >
          <Ionicons
            name="call-outline"
            size={24}
            color={selectedEmergencyContact === contact.id ? '#0a7ea4' : colors.tabIconDefault}
          />
          <View style={styles.contactInfo}>
            <Text style={[styles.contactName, { color: colors.text }]}>{contact.name}</Text>
            <Text style={[styles.contactDetail, { color: colors.tabIconDefault }]}>
              {contact.phone} • {contact.relationship}
            </Text>
          </View>
          {selectedEmergencyContact === contact.id && (
            <Ionicons name="checkmark-circle" size={24} color="#0a7ea4" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPayment = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Payment Method</Text>
      <Text style={[styles.stepSubtitle, { color: colors.tabIconDefault }]}>
        Choose how you&apos;d like to pay
      </Text>

      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.paymentCard,
            selectedPaymentMethod === method.id && styles.paymentCardSelected,
          ]}
          onPress={() => setSelectedPaymentMethod(method.id)}
        >
          <Ionicons
            name="card-outline"
            size={24}
            color={selectedPaymentMethod === method.id ? '#0a7ea4' : colors.tabIconDefault}
          />
          <View style={styles.paymentInfo}>
            <Text style={[styles.paymentBrand, { color: colors.text }]}>
              {method.brand} •••• {method.last4}
            </Text>
            <Text style={[styles.paymentExpiry, { color: colors.tabIconDefault }]}>
              Expires {method.expiryMonth}/{method.expiryYear}
            </Text>
          </View>
          {method.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
          {selectedPaymentMethod === method.id && (
            <Ionicons name="checkmark-circle" size={24} color="#0a7ea4" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderConfirmation = () => {
    const selectedPetObjects = pets.filter((p) => selectedPets.includes(p.id));
    const selectedPayment = paymentMethods.find((pm) => pm.id === selectedPaymentMethod);
    
    return (
      <View style={styles.stepContent}>
        <Text style={[styles.stepTitle, { color: colors.text }]}>Confirm Booking</Text>
        <Text style={[styles.stepSubtitle, { color: colors.tabIconDefault }]}>
          Review your walk details
        </Text>

        <View style={styles.confirmSection}>
          <View style={styles.confirmRow}>
            <Image source={{ uri: walker.avatar }} style={styles.confirmWalkerImage} />
            <View style={styles.confirmWalkerInfo}>
              <Text style={[styles.confirmWalkerName, { color: colors.text }]}>
                {walker.displayName}
              </Text>
              <View style={styles.confirmRating}>
                <Ionicons name="star" size={14} color="#FCD34D" />
                <Text style={[styles.confirmRatingText, { color: colors.text }]}>
                  {walker.rating.toFixed(1)} ({walker.reviewCount} reviews)
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.confirmDivider} />

          <View style={styles.confirmDetail}>
            <Ionicons name="paw" size={20} color={colors.tabIconDefault} />
            <Text style={[styles.confirmDetailText, { color: colors.text }]}>
              {selectedPetObjects.map((p) => p.name).join(', ')}
            </Text>
          </View>

          <View style={styles.confirmDetail}>
            <Ionicons name="time" size={20} color={colors.tabIconDefault} />
            <Text style={[styles.confirmDetailText, { color: colors.text }]}>
              {formatDuration(selectedDuration)}
            </Text>
          </View>

          <View style={styles.confirmDetail}>
            <Ionicons name="calendar" size={20} color={colors.tabIconDefault} />
            <Text style={[styles.confirmDetailText, { color: colors.text }]}>
              {isInstantBook
                ? 'ASAP (within 30 min)'
                : `${selectedDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })} at ${selectedTime}`}
            </Text>
          </View>

          {specialInstructions && (
            <View style={styles.confirmDetail}>
              <Ionicons name="document-text" size={20} color={colors.tabIconDefault} />
              <Text style={[styles.confirmDetailText, { color: colors.text }]}>
                {specialInstructions}
              </Text>
            </View>
          )}

          <View style={styles.confirmDivider} />

          <View style={styles.confirmDetail}>
            <Ionicons name="card" size={20} color={colors.tabIconDefault} />
            <Text style={[styles.confirmDetailText, { color: colors.text }]}>
              {selectedPayment?.brand} •••• {selectedPayment?.last4}
            </Text>
          </View>

          <View style={styles.confirmDivider} />

          <View style={styles.confirmPriceRow}>
            <Text style={[styles.confirmPriceLabel, { color: colors.text }]}>Total</Text>
            <Text style={styles.confirmPrice}>${totalPrice.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Book a Walk</Text>
        <View style={{ width: 40 }} />
      </View>

      {renderStepIndicator()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 'pets' && renderPetSelection()}
        {currentStep === 'duration' && renderDurationSelection()}
        {currentStep === 'datetime' && renderDateTimeSelection()}
        {currentStep === 'details' && renderDetails()}
        {currentStep === 'payment' && renderPayment()}
        {currentStep === 'confirm' && renderConfirmation()}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background }]}>
        <View style={styles.bottomBarContent}>
          <View style={styles.priceInfo}>
            <Text style={[styles.priceLabel, { color: colors.tabIconDefault }]}>Total</Text>
            <Text style={styles.priceAmount}>${totalPrice.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={[styles.nextButton, isLoading && styles.nextButtonDisabled]}
            onPress={currentStep === 'confirm' ? handleConfirmBooking : handleNext}
            disabled={isLoading}
          >
            <Text style={styles.nextButtonText}>
              {isLoading ? 'Processing...' : currentStep === 'confirm' ? 'Confirm Booking' : 'Next'}
            </Text>
            {!isLoading && <Ionicons name="arrow-forward" size={20} color="#fff" />}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  stepIndicator: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  stepItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#0a7ea4',
  },
  stepNumber: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: '#0a7ea4',
  },
  content: {
    flex: 1,
  },
  stepContent: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 15,
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  addPetButton: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addPetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  petList: {
    gap: 12,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  petCardSelected: {
    borderColor: '#10B981',
    backgroundColor: '#D1FAE5',
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
    marginRight: 16,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 14,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  durationCard: {
    flex: 1,
    minWidth: '30%',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  durationCardSelected: {
    borderColor: '#0a7ea4',
    backgroundColor: '#E0F2FE',
  },
  durationTime: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  durationPrice: {
    fontSize: 14,
  },
  bookingTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  bookingTypeCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  bookingTypeCardSelected: {
    borderColor: '#0a7ea4',
    backgroundColor: '#E0F2FE',
  },
  bookingTypeTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  bookingTypeDesc: {
    fontSize: 13,
    textAlign: 'center',
  },
  dateTimeInputs: {
    gap: 12,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  dateTimeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  contactCardSelected: {
    borderColor: '#0a7ea4',
    backgroundColor: '#E0F2FE',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactDetail: {
    fontSize: 14,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  paymentCardSelected: {
    borderColor: '#0a7ea4',
    backgroundColor: '#E0F2FE',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentBrand: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  paymentExpiry: {
    fontSize: 14,
  },
  defaultBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  confirmSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmWalkerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
    marginRight: 16,
  },
  confirmWalkerInfo: {
    flex: 1,
  },
  confirmWalkerName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  confirmRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  confirmRatingText: {
    fontSize: 14,
  },
  confirmDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  confirmDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  confirmDetailText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  confirmPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmPriceLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  confirmPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0a7ea4',
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  priceInfo: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0a7ea4',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
