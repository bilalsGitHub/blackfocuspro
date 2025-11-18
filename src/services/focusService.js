import { supabase } from '../lib/supabaseClient';

/**
 * Save a focus session to Supabase with user_id
 * @param {number} duration - Session duration in minutes
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function saveSession(duration) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!user) throw new Error('No authenticated user');

    // Insert session with user_id
    const { data, error } = await supabase
      .from('focus_sessions')
      .insert([
        {
          user_id: user.id,
          duration: duration,
          timestamp: new Date().toISOString(),
        }
      ])
      .select();

    if (error) throw error;

    console.log('Session saved:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error saving session:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all focus sessions for the current user
 * @returns {Promise<{success: boolean, data?: any[], error?: string}>}
 */
export async function getSessions() {
  try {
    // Get the current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!user) throw new Error('No authenticated user');

    // Fetch sessions for this user only
    const { data, error } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return { success: false, error: error.message, data: [] };
  }
}

/**
 * Get sessions for a specific date range
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {Promise<{success: boolean, data?: any[], error?: string}>}
 */
export async function getSessionsByDateRange(startDate, endDate) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', user.id)
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString())
      .order('timestamp', { ascending: false });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching sessions by date:', error);
    return { success: false, error: error.message, data: [] };
  }
}

/**
 * Get today's focus sessions
 * @returns {Promise<{success: boolean, data?: any[], error?: string}>}
 */
export async function getTodaySessions() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return getSessionsByDateRange(today, tomorrow);
}

/**
 * Delete a session by ID
 * @param {string} sessionId 
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteSession(sessionId) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!user) throw new Error('No authenticated user');

    // Delete only if it belongs to the user
    const { error } = await supabase
      .from('focus_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', user.id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting session:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get total focus time for the current user
 * @returns {Promise<{success: boolean, totalMinutes?: number, error?: string}>}
 */
export async function getTotalFocusTime() {
  try {
    const result = await getSessions();
    
    if (!result.success) throw new Error(result.error);

    const totalMinutes = result.data.reduce((sum, session) => sum + session.duration, 0);
    
    return { success: true, totalMinutes };
  } catch (error) {
    console.error('Error calculating total focus time:', error);
    return { success: false, error: error.message, totalMinutes: 0 };
  }
}

