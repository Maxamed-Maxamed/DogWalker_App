/**
 * Supabase connection test utility
 * 
 * Use this to verify your Supabase configuration is working correctly.
 */

import { isSupabaseConfigured, supabase } from './supabase';

export const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase Connection...\n');
  
  // Check if environment variables are set
  if (!isSupabaseConfigured()) {
    console.error('❌ Supabase is not configured!');
    console.error('Please check your .env.local file has:');
    console.error('  - EXPO_PUBLIC_SUPABASE_URL');
    console.error('  - EXPO_PUBLIC_SUPABASE_ANON_KEY\n');
    return false;
  }
  
  console.log('✅ Environment variables are set');
  
  // Test connection by checking Supabase service availability
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error && error.message !== 'Auth session missing!') {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Successfully connected to Supabase');
    console.log(`   Project URL: ${process.env.EXPO_PUBLIC_SUPABASE_URL}`);
    
    if (data.session) {
      console.log('✅ Active session found');
      console.log(`   User: ${data.session.user.email}`);
    } else {
      console.log('ℹ️  No active session (not logged in)');
    }
    
    console.log('\n✨ Supabase is ready to use!\n');
    return true;
    
  } catch (error: any) {
    console.error('❌ Connection test failed:', error.message);
    console.error('   Please verify your Supabase URL and key are correct\n');
    return false;
  }
};

// Export a simple function to check auth status
export const checkAuthStatus = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    return { authenticated: false, error: error.message };
  }
  
  return {
    authenticated: !!data.session,
    user: data.session?.user,
    session: data.session,
  };
};
