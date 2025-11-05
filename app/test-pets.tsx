/**
 * Pet Store Diagnostic Script
 * Run this to test your Supabase pet integration
 * 
 * Usage:
 * 1. Create a new screen: app/test-pets.tsx
 * 2. Copy this code
 * 3. Navigate to /test-pets in your app
 * 4. Check console for results
 */

import { supabase } from '@/utils/supabase';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PetDiagnosticScreen() {
  const runDiagnostics = async () => {
    console.log('\n🔍 ========== PET STORE DIAGNOSTICS ==========\n');

    // Test 1: Authentication
    console.log('TEST 1: Checking Authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Auth Error:', authError.message);
      return;
    }
    
    if (!user) {
      console.warn('⚠️  No user logged in. Please log in first.');
      return;
    }
    
    console.log('✅ User authenticated');
    console.log('   User ID:', user.id);
    console.log('   Email:', user.email);

    // Test 2: Database Connection
    console.log('\nTEST 2: Testing Database Connection...');
    const { data: tableTest, error: tableError } = await supabase
      .from('pets')
      .select('count');

    if (tableError) {
      console.error('❌ Database Error:', tableError.message);
      console.error('   Code:', tableError.code);
      console.error('   Details:', tableError.details);
      
      if (tableError.code === '42P01') {
        console.log('\n💡 Solution: Run database/schema.sql in Supabase SQL Editor');
      } else if (tableError.message.includes('RLS')) {
        console.log('\n💡 Solution: Enable RLS policies on pets table');
      }
      return;
    }
    
    console.log('✅ Database connection successful');

    // Test 3: Fetch User's Pets
    console.log('\nTEST 3: Fetching User Pets...');
    const { data: pets, error: fetchError } = await supabase
      .from('pets')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Fetch Error:', fetchError.message);
      return;
    }

    console.log(`✅ Found ${pets?.length || 0} pets`);
    if (pets && pets.length > 0) {
      pets.forEach((pet, index) => {
        console.log(`   ${index + 1}. ${pet.name} (${pet.breed || 'Unknown breed'})`);
      });
    } else {
      console.log('   No pets found. Try creating one!');
    }

    // Test 4: Storage Bucket
    console.log('\nTEST 4: Checking Storage Bucket...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

    if (bucketError) {
      console.error('❌ Storage Error:', bucketError.message);
      return;
    }

    const petPhotosBucket = buckets?.find(b => b.id === 'pet-photos');
    
    if (!petPhotosBucket) {
      console.warn('⚠️  pet-photos bucket not found');
      console.log('💡 Solution: Create bucket in Supabase Storage');
    } else {
      console.log('✅ pet-photos bucket exists');
      console.log('   Public:', petPhotosBucket.public);
    }

    // Test 5: RLS Policies
    console.log('\nTEST 5: Testing RLS Policies...');
    
    // Test SELECT policy
    const { error: selectError } = await supabase
      .from('pets')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1);

    if (selectError) {
      console.error('❌ SELECT policy issue:', selectError.message);
    } else {
      console.log('✅ SELECT policy working');
    }

    // Summary
    console.log('\n🎉 ========== DIAGNOSTIC COMPLETE ==========\n');
    console.log('Check logs above for any ❌ or ⚠️  issues');
    console.log('All ✅ means your pet store is ready!\n');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Pet Store Diagnostics</Text>
        <Text style={styles.description}>
          This will test your Supabase integration for pet management.
        </Text>
        <Text style={styles.description}>
          Check the console (developer tools) for detailed results.
        </Text>
        
        <Button title="Run Diagnostics" onPress={runDiagnostics} />

        <View style={styles.instructions}>
          <Text style={styles.sectionTitle}>What Gets Tested:</Text>
          <Text style={styles.bullet}>✓ User authentication status</Text>
          <Text style={styles.bullet}>✓ Database connection</Text>
          <Text style={styles.bullet}>✓ Pets table access</Text>
          <Text style={styles.bullet}>✓ Storage bucket configuration</Text>
          <Text style={styles.bullet}>✓ RLS policies</Text>
          
          <Text style={styles.sectionTitle}>Expected Results:</Text>
          <Text style={styles.bullet}>• All checks should show ✅</Text>
          <Text style={styles.bullet}>• Any ❌ will include a solution</Text>
          <Text style={styles.bullet}>• Check browser/device console</Text>
        </View>

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 Common Issues:</Text>
          <Text style={styles.tipText}>
            <Text style={styles.bold}>Not logged in:</Text> Go to auth screen and log in first
          </Text>
          <Text style={styles.tipText}>
            <Text style={styles.bold}>Table not found:</Text> Run database/schema.sql in Supabase
          </Text>
          <Text style={styles.tipText}>
            <Text style={styles.bold}>RLS errors:</Text> Enable RLS policies (see documentation)
          </Text>
          <Text style={styles.tipText}>
            <Text style={styles.bold}>Storage errors:</Text> Create pet-photos bucket
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    lineHeight: 22,
  },
  instructions: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
    color: '#000',
  },
  bullet: {
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
    marginBottom: 5,
  },
  tips: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
  },
});
